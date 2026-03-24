import fs from 'node:fs';
import path from 'node:path';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { z } from 'zod';
import type { Database } from '../server/db/types';
import type { GeneratedProblem, Slide, ProblemType, RenderedProblem } from '../types';
import { renderMarkdownToHtml, renderProblem } from '../renderer';
import { getDatabaseConnectionString } from '../server/db/config';
import { generateTruthTable } from './truth-table-generator';

const CURRICULUM_DIR = path.join(process.cwd(), 'src/lib/curriculum');
const DATABASE_URL = getDatabaseConnectionString(process.env);

const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({ connectionString: DATABASE_URL })
	})
});

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const PrerequisiteSchema = z.object({
	id: z.string(),
	weight: z.number().min(0).max(1)
});

const FrontmatterSchema = z.object({
	id: z.string(),
	title: z.string(),
	prerequisites: z.array(PrerequisiteSchema).default([])
});

const BaseProblemSchema = z.object({
	type: z.enum(['mcq', 'truth-table', 'assertion-judgment', 'formula-builder']),
	question: z.string(),
	answer: z.string(),
	hint: z.string(),
	walkthrough: z.string(),
	tags: z.array(z.string()).optional()
});

const McqSchema = BaseProblemSchema.extend({
	type: z.literal('mcq'),
	options: z.array(z.string()),
	answer: z.number().int().positive()
})
	.superRefine((data, ctx) => {
		const idx = data.answer - 1;
		if (idx < 0 || idx >= data.options.length) {
			ctx.addIssue({
				code: 'custom',
				path: ['answer'],
				message: `answer must be a 1-based index between 1 and ${data.options.length} (got ${data.answer})`
			});
		}
	})
	.transform((data) => ({
		...data,
		answer: data.options[data.answer - 1]
	}));

const TruthTableSchema = BaseProblemSchema.extend({
	type: z.literal('truth-table'),
	answer: z.string().optional(),
	headers: z.array(z.string()).optional(),
	expectedTable: z.array(z.array(z.boolean())).optional(),
	hiddenColumns: z.array(z.number()).optional(),
	formulas: z.array(z.string()).optional(),
	hiddenFormulas: z.array(z.string()).optional()
}).superRefine((data, ctx) => {
	const hasLegacy = data.headers !== undefined && data.expectedTable !== undefined;
	const hasMinimal = data.formulas !== undefined && data.hiddenFormulas !== undefined;

	if (!hasLegacy && !hasMinimal) {
		ctx.addIssue({
			code: 'custom',
			message:
				'Truth table must have either (headers + expectedTable) or (formulas + hiddenFormulas)'
		});
	}
});

const AssertionJudgmentSchema = BaseProblemSchema.extend({
	type: z.literal('assertion-judgment'),
	premises: z.array(z.string()),
	conclusion: z.string(),
	isValid: z.boolean(),
	counterexample: z.record(z.string(), z.boolean()).optional()
});

const FormulaBuilderSchema = BaseProblemSchema.extend({
	type: z.literal('formula-builder'),
	variableMap: z.record(z.string(), z.string())
});

const ProblemSchema = z.discriminatedUnion('type', [
	McqSchema,
	TruthTableSchema,
	AssertionJudgmentSchema,
	FormulaBuilderSchema
]);

const QuestionsSchema = z.array(ProblemSchema);

interface TruthTableProblemRaw {
	type: 'truth-table';
	question: string;
	answer: string;
	hint: string;
	walkthrough: string;
	tags?: string[];
	headers?: string[];
	expectedTable?: boolean[][];
	hiddenColumns?: number[];
	formulas?: string[];
	hiddenFormulas?: string[];
}

function expandTruthTableProblem(problem: TruthTableProblemRaw): GeneratedProblem {
	if (problem.formulas && problem.hiddenFormulas) {
		const result = generateTruthTable({
			formulas: problem.formulas,
			hiddenFormulas: problem.hiddenFormulas
		});

		if (!result.success) {
			throw new Error(
				`Truth table generation failed for "${problem.question}": ${result.error.message}`
			);
		}

		return {
			type: 'truth-table',
			question: problem.question,
			answer: result.data.answer,
			hint: problem.hint,
			walkthrough: problem.walkthrough,
			tags: problem.tags,
			headers: result.data.headers,
			expectedTable: result.data.expectedTable,
			hiddenColumns: result.data.hiddenColumns
		};
	}

	if (!problem.headers || !problem.expectedTable) {
		throw new Error(`Truth table problem "${problem.question}" is missing required fields`);
	}

	return {
		type: 'truth-table',
		question: problem.question,
		answer: problem.answer,
		hint: problem.hint,
		walkthrough: problem.walkthrough,
		tags: problem.tags,
		headers: problem.headers,
		expectedTable: problem.expectedTable,
		hiddenColumns: problem.hiddenColumns
	};
}

function expandProblems(problems: z.infer<typeof QuestionsSchema>): GeneratedProblem[] {
	return problems.map((problem) => {
		if (problem.type === 'truth-table') {
			return expandTruthTableProblem(problem as TruthTableProblemRaw);
		}
		return problem as GeneratedProblem;
	});
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoadedTopic {
	id: string;
	title: string;
	prerequisites: Array<{ id: string; weight: number }>;
	problems: GeneratedProblem[];
	lessonMarkdown: string;
}

interface GraphMetadata {
	depthById: Map<string, number>;
	topologicalRankById: Map<string, number>;
	milestoneIds: Set<string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDirectories(source: string): string[] {
	return fs
		.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
}

const PROBLEM_REGEX = /^:::problem(?:\s*\{(.*)\})?\s*$/;

function parseAttributes(attrString: string): { tags?: string[]; type?: ProblemType } {
	if (!attrString) return {};

	const result: { tags?: string[]; type?: ProblemType } = {};

	const getValue = (key: string) => {
		const regex = new RegExp(`${key}=["']([^"']*)["']`);
		const match = attrString.match(regex);
		return match ? match[1] : undefined;
	};

	const tagsStr = getValue('tags');
	if (tagsStr) {
		result.tags = tagsStr
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);
	}

	const typeStr = getValue('type');
	if (typeStr) {
		result.type = typeStr as ProblemType;
	}

	return result;
}

function parseLessonContent(rawText: string): Slide[] {
	const chunks = rawText.split(/^\s*---\s*$/m);

	return chunks
		.map((chunk): Slide | null => {
			const trimmed = chunk.trim();
			if (!trimmed) {
				return null;
			}

			const lines = trimmed
				.split('\n')
				.map((l) => l.trim())
				.filter((l) => l.length > 0);

			const cleanLines = lines.filter((l) => l !== ':::');

			if (cleanLines.length === 1) {
				const match = cleanLines[0].match(PROBLEM_REGEX);
				if (match) {
					const attrString = match[1] || '';
					const filter = parseAttributes(attrString);
					const hasFilter = filter.tags || filter.type;

					return {
						type: 'problem' as const,
						filter: hasFilter ? filter : undefined
					};
				}
			}

			const html = renderMarkdownToHtml(trimmed);

			return {
				type: 'content' as const,
				html
			};
		})
		.filter((slide): slide is Slide => slide !== null);
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

async function loadTopics(): Promise<LoadedTopic[]> {
	console.log('📂 Discovering topics...');

	if (!fs.existsSync(CURRICULUM_DIR)) {
		console.error(`❌ Curriculum directory not found: ${CURRICULUM_DIR}`);
		process.exit(1);
	}

	const topicDirs = getDirectories(CURRICULUM_DIR);
	const topics: LoadedTopic[] = [];

	for (const dir of topicDirs) {
		const lessonPath = path.join(CURRICULUM_DIR, dir, 'lesson.md');
		const questionsPath = path.join(CURRICULUM_DIR, dir, 'questions.yaml');

		if (!fs.existsSync(lessonPath)) {
			console.warn(`⚠️  Skipping ${dir}: no lesson.md found`);
			continue;
		}

		if (!fs.existsSync(questionsPath)) {
			console.warn(`⚠️  Skipping ${dir}: no questions.yaml found`);
			continue;
		}

		try {
			// --- Parse lesson.md frontmatter ---
			const lessonRaw = fs.readFileSync(lessonPath, 'utf-8');
			const { data: rawFrontmatter, content: lessonBody } = matter(lessonRaw);

			const frontmatterResult = FrontmatterSchema.safeParse(rawFrontmatter);
			if (!frontmatterResult.success) {
				console.error(`❌ Invalid frontmatter in ${dir}/lesson.md:`);
				console.error(frontmatterResult.error.format());
				process.exit(1);
			}
			const frontmatter = frontmatterResult.data;

			// --- Parse questions.yaml ---
			const questionsRaw = fs.readFileSync(questionsPath, 'utf-8');
			const parsedYaml = yaml.load(questionsRaw);

			const questionsResult = QuestionsSchema.safeParse(parsedYaml);
			if (!questionsResult.success) {
				console.error(`❌ Invalid questions in ${dir}/questions.yaml:`);
				console.error(questionsResult.error.format());
				process.exit(1);
			}

			let problems: GeneratedProblem[];
			try {
				problems = expandProblems(questionsResult.data);
			} catch (e) {
				console.error(`❌ Failed to expand problems in ${dir}/questions.yaml:`);
				console.error(e instanceof Error ? e.message : e);
				process.exit(1);
			}

			if (problems.length === 0) {
				console.warn(`⚠️  Skipping ${dir}: no problems defined (incomplete topic)`);
				continue;
			}

			topics.push({
				id: frontmatter.id,
				title: frontmatter.title,
				prerequisites: frontmatter.prerequisites,
				problems,
				lessonMarkdown: lessonBody.trim()
			});
		} catch (e) {
			console.error(`❌ Failed to load ${dir}:`, e);
			process.exit(1);
		}
	}

	console.log(`✅ Loaded ${topics.length} topics`);
	return topics;
}

// ---------------------------------------------------------------------------
// Graph computation (unchanged)
// ---------------------------------------------------------------------------

function filterTopicsWithMissingPrerequisites(topics: LoadedTopic[]): LoadedTopic[] {
	const validTopicIds = new Set(topics.map((t) => t.id));
	let changed = true;

	while (changed) {
		changed = false;
		for (const topic of topics) {
			if (!validTopicIds.has(topic.id)) continue;

			for (const prereq of topic.prerequisites) {
				if (!validTopicIds.has(prereq.id)) {
					console.warn(`⚠️  Excluding "${topic.id}": prerequisite "${prereq.id}" is not available`);
					validTopicIds.delete(topic.id);
					changed = true;
					break;
				}
			}
		}
	}

	return topics.filter((t) => validTopicIds.has(t.id));
}

function computeGraphMetadata(topics: LoadedTopic[]): GraphMetadata {
	const topicById = new Map(topics.map((topic) => [topic.id, topic]));
	const topicIds = topics.map((topic) => topic.id).sort();

	const childrenById = new Map<string, string[]>();
	const indegreeById = new Map<string, number>();

	for (const topicId of topicIds) {
		childrenById.set(topicId, []);
		indegreeById.set(topicId, 0);
	}

	for (const topic of topics) {
		indegreeById.set(topic.id, topic.prerequisites.length);
		for (const prereq of topic.prerequisites) {
			childrenById.get(prereq.id)?.push(topic.id);
		}
	}

	for (const children of childrenById.values()) {
		children.sort();
	}

	const queue = topicIds.filter((topicId) => (indegreeById.get(topicId) ?? 0) === 0).sort();
	const topologicalOrder: string[] = [];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) break;
		topologicalOrder.push(currentId);

		const children = childrenById.get(currentId) ?? [];
		for (const childId of children) {
			const nextIndegree = (indegreeById.get(childId) ?? 0) - 1;
			indegreeById.set(childId, nextIndegree);
			if (nextIndegree === 0) {
				queue.push(childId);
				queue.sort();
			}
		}
	}

	if (topologicalOrder.length !== topics.length) {
		throw new Error('Curriculum graph contains a cycle; cannot compute metadata.');
	}

	const topologicalRankById = new Map<string, number>();
	for (let index = 0; index < topologicalOrder.length; index++) {
		topologicalRankById.set(topologicalOrder[index], index);
	}

	const depthById = new Map<string, number>();
	for (const topicId of topologicalOrder) {
		const topic = topicById.get(topicId);
		if (!topic) continue;

		let depth = 0;
		for (const prereq of topic.prerequisites) {
			const prereqDepth = depthById.get(prereq.id) ?? 0;
			depth = Math.max(depth, prereqDepth + 1);
		}
		depthById.set(topicId, depth);
	}

	const ancestorsById = new Map<string, Set<string>>();
	for (const topicId of topologicalOrder) {
		const topic = topicById.get(topicId);
		if (!topic) continue;

		const ancestors = new Set<string>();
		for (const prereq of topic.prerequisites) {
			ancestors.add(prereq.id);
			for (const ancestor of ancestorsById.get(prereq.id) ?? []) {
				ancestors.add(ancestor);
			}
		}
		ancestorsById.set(topicId, ancestors);
	}

	const descendantsById = new Map<string, Set<string>>();
	for (let index = topologicalOrder.length - 1; index >= 0; index--) {
		const topicId = topologicalOrder[index];
		const descendants = new Set<string>();
		const children = childrenById.get(topicId) ?? [];

		for (const childId of children) {
			descendants.add(childId);
			for (const descendant of descendantsById.get(childId) ?? []) {
				descendants.add(descendant);
			}
		}

		descendantsById.set(topicId, descendants);
	}

	const bestByDepth = new Map<number, { id: string; value: number }>();
	for (const topicId of topologicalOrder) {
		const depth = depthById.get(topicId) ?? 0;
		const value =
			(ancestorsById.get(topicId)?.size ?? 0) + (descendantsById.get(topicId)?.size ?? 0);

		const currentBest = bestByDepth.get(depth);
		if (
			!currentBest ||
			value > currentBest.value ||
			(value === currentBest.value && topicId < currentBest.id)
		) {
			bestByDepth.set(depth, { id: topicId, value });
		}
	}

	const milestoneIds = new Set(Array.from(bestByDepth.values()).map((entry) => entry.id));

	return { depthById, topologicalRankById, milestoneIds };
}

// ---------------------------------------------------------------------------
// Database sync (unchanged)
// ---------------------------------------------------------------------------

async function syncToDatabase(topics: LoadedTopic[]): Promise<void> {
	console.log('💾 Syncing to database...');

	topics = filterTopicsWithMissingPrerequisites(topics);
	console.log(`   ${topics.length} topics remain after prerequisite filtering`);
	const metadata = computeGraphMetadata(topics);

	await db.transaction().execute(async (trx) => {
		await trx.deleteFrom('topic_prerequisite').execute();
		await trx.deleteFrom('topic').execute();

		for (const topic of topics) {
			const slides = parseLessonContent(topic.lessonMarkdown);
			const renderedProblems: RenderedProblem[] = topic.problems.map((problem) =>
				renderProblem(problem)
			);
			const depth = metadata.depthById.get(topic.id) ?? 0;
			const topologicalRank = metadata.topologicalRankById.get(topic.id) ?? 0;
			const isMilestone = metadata.milestoneIds.has(topic.id);
			const serializedProblems = JSON.stringify(topic.problems);
			const serializedRenderedProblems = JSON.stringify(renderedProblems);
			const serializedSlides = JSON.stringify(slides);

			await sql`
					INSERT INTO topic (
						id,
						title,
						problems,
						rendered_problems,
						depth,
						topological_rank,
						is_milestone,
						lesson_markdown,
						lesson_slides,
						updated_at
					)
					VALUES (
						${topic.id},
						${topic.title},
						${serializedProblems}::jsonb,
						${serializedRenderedProblems}::jsonb,
						${depth},
						${topologicalRank},
						${isMilestone},
						${topic.lessonMarkdown || null},
						${serializedSlides}::jsonb,
						now()
					)
				`.execute(trx);
		}

		for (const topic of topics) {
			for (const prereq of topic.prerequisites) {
				await trx
					.insertInto('topic_prerequisite')
					.values({
						from_topic_id: prereq.id,
						to_topic_id: topic.id,
						weight: prereq.weight
					})
					.execute();
			}
		}
	});

	console.log(
		`✅ Synced ${topics.length} topics and ${topics.reduce((sum, t) => sum + t.prerequisites.length, 0)} edges`
	);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
	console.log('🚀 Starting curriculum sync...\n');

	try {
		const topics = await loadTopics();

		await syncToDatabase(topics);

		console.log('\n✨ Curriculum sync complete!');
	} catch (e) {
		console.error('\n❌ Sync failed:', e);
		process.exit(1);
	} finally {
		await db.destroy();
	}
}

main();
