import { db } from '../db';
import type { Topic, KnowledgeGraph, GeneratedProblem, Slide, RenderedProblem } from '$lib/types';

let cachedGraph: KnowledgeGraph | null = null;
let inflightPromise: Promise<KnowledgeGraph> | null = null;

export async function getKnowledgeGraph(): Promise<KnowledgeGraph> {
	if (cachedGraph) {
		return cachedGraph;
	}

	if (inflightPromise) {
		return inflightPromise;
	}

	inflightPromise = fetchKnowledgeGraph();
	try {
		return await inflightPromise;
	} finally {
		inflightPromise = null;
	}
}

async function fetchKnowledgeGraph(): Promise<KnowledgeGraph> {
	const [rows, prereqRows] = await Promise.all([
		db
			.selectFrom('topic')
			.select([
				'id',
				'title',
				'problems',
				'rendered_problems',
				'lesson_slides',
				'depth',
				'topological_rank',
				'is_milestone'
			])
			.execute(),
		db.selectFrom('topic_prerequisite').select(['from_topic_id', 'to_topic_id', 'weight']).execute()
	]);

	const prereqMap = new Map<string, Array<{ id: string; weight: number }>>();
	for (const row of prereqRows) {
		if (!prereqMap.has(row.to_topic_id)) {
			prereqMap.set(row.to_topic_id, []);
		}
		prereqMap.get(row.to_topic_id)!.push({
			id: row.from_topic_id,
			weight: row.weight
		});
	}

	const topics: Record<string, Topic> = {};
	for (const row of rows) {
		const topicId = row.id;
		const problems = (row.problems as GeneratedProblem[]) || [];
		const renderedProblems = (row.rendered_problems as RenderedProblem[]) || [];
		const slides = (row.lesson_slides as Slide[]) || [];

		topics[topicId] = {
			id: topicId,
			title: row.title,
			prerequisites: prereqMap.get(topicId) || [],
			problems,
			renderedProblems,
			slides
		};
	}

	const sortedRows = [...rows].sort((a, b) => {
		if (a.topological_rank !== b.topological_rank) {
			return a.topological_rank - b.topological_rank;
		}
		return a.id.localeCompare(b.id);
	});

	const topologicalOrder = sortedRows.map((row) => row.id);

	const depthMap = new Map<string, number>();
	for (const row of rows) {
		depthMap.set(row.id, row.depth);
	}

	const milestones = sortedRows
		.filter((row) => row.is_milestone)
		.sort((a, b) => {
			if (a.depth !== b.depth) {
				return a.depth - b.depth;
			}
			if (a.topological_rank !== b.topological_rank) {
				return a.topological_rank - b.topological_rank;
			}
			return a.id.localeCompare(b.id);
		})
		.map((row) => row.id);

	cachedGraph = {
		topics,
		topologicalOrder,
		depthMap,
		milestones
	};

	return cachedGraph;
}

export async function getTopic(id: string): Promise<Topic | undefined> {
	const graph = await getKnowledgeGraph();
	return graph.topics[id];
}
