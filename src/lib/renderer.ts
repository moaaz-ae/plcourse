import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { Schema } from 'hast-util-sanitize';
import type { GeneratedProblem, RenderedProblem } from './types';

const katexSanitizeSchema: Schema = {
	...defaultSchema,
	tagNames: [
		...(defaultSchema.tagNames || []),
		'math',
		'semantics',
		'mrow',
		'mi',
		'mo',
		'mn',
		'msup',
		'msub',
		'mfrac',
		'munder',
		'mover',
		'munderover',
		'msqrt',
		'mroot',
		'mtable',
		'mtr',
		'mtd',
		'mlabeledtr',
		'mtext',
		'mspace',
		'annotation',
		'annotation-xml'
	],
	attributes: {
		...defaultSchema.attributes,
		span: [
			...(defaultSchema.attributes?.span || []),
			['className', /^katex/],
			'style',
			'aria-hidden'
		],
		div: [...(defaultSchema.attributes?.div || []), ['className', /^katex/], 'style'],
		math: ['xmlns', 'display'],
		annotation: ['encoding'],
		'annotation-xml': ['encoding'],
		'*': [...(defaultSchema.attributes?.['*'] || []), 'style']
	}
};

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkRehype, { allowDangerousHtml: false })
	.use(rehypeKatex)
	.use(rehypeSanitize, katexSanitizeSchema)
	.use(rehypeStringify);

export function renderMarkdownToHtml(markdown: string, options?: { inline?: boolean }): string {
	const inline = options?.inline ?? false;

	let html: string;

	if (inline) {
		const result = processor.processSync(markdown);
		html = String(result);

		const trimmed = html.trim();
		if (trimmed.startsWith('<p>') && trimmed.endsWith('</p>')) {
			const inner = trimmed.slice(3, -4);
			if (!inner.includes('<p>')) {
				html = inner;
			}
		}
	} else {
		const result = processor.processSync(markdown);
		html = String(result);
	}

	return html;
}

const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

export function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function containsMath(content: string): boolean {
	return /(?<!\\)\$/.test(content);
}

function renderMathContent(content: string): string {
	if (containsMath(content)) {
		return renderMarkdownToHtml(content, { inline: true });
	}
	return escapeHtml(content);
}

export function renderProblem(problem: GeneratedProblem): RenderedProblem {
	const base: RenderedProblem = {
		...problem,
		questionHtml: renderMarkdownToHtml(problem.question),
		hintHtml: renderMarkdownToHtml(problem.hint, { inline: true }),
		walkthroughHtml: renderMarkdownToHtml(problem.walkthrough)
	};

	switch (problem.type) {
		case 'mcq':
			return {
				...base,
				optionsHtml: problem.options.map((opt) => renderMathContent(opt))
			};

		case 'truth-table':
			return {
				...base,
				headersHtml: problem.headers.map((h) => renderMathContent(h))
			};

		case 'assertion-judgment':
			return {
				...base,
				premisesHtml: problem.premises.map((p) => renderMathContent(p)),
				conclusionHtml: renderMathContent(problem.conclusion)
			};

		case 'formula-builder': {
			const variableKeysHtml: Record<string, string> = {};
			for (const [key] of Object.entries(problem.variableMap)) {
				const latexKey = key.startsWith('$') ? key : `$${key}$`;
				variableKeysHtml[key] = renderMathContent(latexKey);
			}
			return {
				...base,
				variableKeysHtml
			};
		}

		default:
			return base;
	}
}
