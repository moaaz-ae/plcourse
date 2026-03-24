import { describe, it, expect } from 'vitest';
import { renderMarkdownToHtml, renderProblem } from './renderer';
import type { GeneratedProblem } from '$lib/types';

describe('Renderer', () => {
	describe('renderMarkdownToHtml', () => {
		it('renders basic markdown', () => {
			expect(renderMarkdownToHtml('# Hello')).toContain('<h1>Hello</h1>');
			expect(renderMarkdownToHtml('*Italic*')).toContain('<em>Italic</em>');
		});

		it('renders bold text', () => {
			expect(renderMarkdownToHtml('**Bold**')).toContain('<strong>Bold</strong>');
		});

		it('renders lists', () => {
			const html = renderMarkdownToHtml('- Item 1\n- Item 2');
			expect(html).toContain('<ul>');
			expect(html).toContain('<li>Item 1</li>');
		});

		it('renders inline math with $', () => {
			const html = renderMarkdownToHtml('Let $x=1$');
			expect(html).toContain('katex');
			expect(html).toContain('x=1');

			expect(html).not.toContain('katex-display');
		});

		it('renders block math with $$', () => {
			const html = renderMarkdownToHtml('\n$$\nx^2\n$$\n');
			expect(html).toContain('katex-display');
		});

		it('sanitizes dangerous HTML (XSS Protection)', () => {
			const dangerous = 'Hello <script>alert("xss")</script>';
			const html = renderMarkdownToHtml(dangerous);
			expect(html).toContain('Hello');
			expect(html).not.toContain('<script>');
		});

		it('sanitizes onclick attributes', () => {
			const dangerous = '<button onclick="alert(\'hi\')">Click</button>';
			const html = renderMarkdownToHtml(dangerous);

			expect(html).not.toContain('onclick');
		});
	});

	describe('renderProblem', () => {
		describe('MCQ', () => {
			it('renders basic MCQ problem', () => {
				const problem: GeneratedProblem = {
					type: 'mcq',
					question: 'What is $2+2$?',
					answer: '4',
					options: ['3', '4', '5'],
					hint: 'Think about addition.',
					walkthrough: '2 + 2 = 4.'
				};

				const rendered = renderProblem(problem);
				expect(rendered.questionHtml).toContain('katex');
				expect(rendered.optionsHtml).toHaveLength(3);
				expect(rendered.optionsHtml![1]).toBe('4');
			});

			it('renders MCQ option with math', () => {
				const problem: GeneratedProblem = {
					type: 'mcq',
					question: 'Q',
					answer: 'A',
					options: ['$x$', 'y'],
					hint: 'Hint.',
					walkthrough: 'Walkthrough.'
				};

				const rendered = renderProblem(problem);
				expect(rendered.optionsHtml![0]).toContain('katex');
				expect(rendered.optionsHtml![1]).toBe('y');
			});
		});

		describe('Truth Table', () => {
			it('renders Truth Table headers with math', () => {
				const problem: GeneratedProblem = {
					type: 'truth-table',
					question: 'Fill table',
					answer: '',
					headers: ['$P$', '$Q$', '$P \\land Q$'],
					expectedTable: [[true]],
					hiddenColumns: [2],
					hint: 'Hint.',
					walkthrough: 'Walkthrough.'
				};

				const rendered = renderProblem(problem);
				expect(rendered.headersHtml).toHaveLength(3);
				expect(rendered.headersHtml![0]).toContain('katex');
				expect(rendered.headersHtml![2]).toContain('\\land');
			});
		});

		describe('Assertion Judgment', () => {
			it('renders premises and conclusion', () => {
				const problem: GeneratedProblem = {
					type: 'assertion-judgment',
					question: 'Valid?',
					answer: 'yes',
					premises: ['$P \\to Q$', '$P$'],
					conclusion: '$Q$',
					isValid: true,
					hint: 'Hint.',
					walkthrough: 'Walkthrough.'
				};

				const rendered = renderProblem(problem);
				expect(rendered.premisesHtml).toHaveLength(2);
				expect(rendered.premisesHtml![0]).toContain('katex');
				expect(rendered.conclusionHtml).toContain('katex');
			});
		});

		describe('Formula Builder', () => {
			it('renders variable keys with math', () => {
				const problem: GeneratedProblem = {
					type: 'formula-builder',
					question: 'Build it',
					answer: '',
					variableMap: { R: 'It rains', $W$: 'Wet' },
					hint: 'Hint.',
					walkthrough: 'Walkthrough.'
				};

				const rendered = renderProblem(problem);
				expect(rendered.variableKeysHtml).toBeDefined();

				expect(rendered.variableKeysHtml!['R']).toContain('katex');

				expect(rendered.variableKeysHtml!['$W$']).toContain('katex');
			});
		});

		describe('Hint and Walkthrough Rendering', () => {
			it('renders hint as inline markdown', () => {
				const problem: GeneratedProblem = {
					type: 'mcq',
					question: 'Q',
					answer: 'A',
					options: [],
					hint: 'Use *logic*',
					walkthrough: 'The answer.'
				};
				const rendered = renderProblem(problem);
				expect(rendered.hintHtml).toContain('<em>logic</em>');
			});

			it('renders walkthrough as block markdown', () => {
				const problem: GeneratedProblem = {
					type: 'mcq',
					question: 'Q',
					answer: 'A',
					options: [],
					hint: 'Hint.',
					walkthrough: '**Step 1:** Do this.'
				};
				const rendered = renderProblem(problem);
				expect(rendered.walkthroughHtml).toContain('<strong>Step 1:</strong>');
			});
		});
	});
});
