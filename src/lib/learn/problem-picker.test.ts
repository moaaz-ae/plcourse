import { describe, expect, it } from 'vitest';
import { getCandidateProblemIndices, pickRenderedProblem } from './problem-picker';
import type { GeneratedProblem, RenderedProblem } from '$lib/types';

const problems: GeneratedProblem[] = [
	{
		type: 'mcq',
		question: 'Q1',
		answer: 'A1',
		options: ['A1', 'B1'],
		hint: 'Hint 1',
		walkthrough: 'Walkthrough 1',
		tags: ['intro']
	},
	{
		type: 'truth-table',
		question: 'Q2',
		answer: 'A2',
		headers: ['$P$'],
		expectedTable: [[true]],
		hint: 'Hint 2',
		walkthrough: 'Walkthrough 2',
		tags: ['table']
	},
	{
		type: 'mcq',
		question: 'Q3',
		answer: 'A3',
		options: ['A3', 'B3'],
		hint: 'Hint 3',
		walkthrough: 'Walkthrough 3',
		tags: ['intro', 'hard']
	}
];

const renderedProblems: RenderedProblem[] = problems.map((problem) => ({
	...problem,
	questionHtml: `<p>${problem.question}</p>`,
	hintHtml: `<p>${problem.hint}</p>`,
	walkthroughHtml: `<p>${problem.walkthrough}</p>`
}));

describe('getCandidateProblemIndices', () => {
	it('returns all indices without filter', () => {
		expect(getCandidateProblemIndices(problems)).toEqual([0, 1, 2]);
	});

	it('filters by type', () => {
		const filter = { type: 'truth-table' as const };
		expect(getCandidateProblemIndices(problems, filter)).toEqual([1]);
	});

	it('filters by all tags', () => {
		const filter = { tags: ['intro', 'hard'] };
		expect(getCandidateProblemIndices(problems, filter)).toEqual([2]);
	});
});

describe('pickRenderedProblem', () => {
	it('returns an error when no problems exist', () => {
		const result = pickRenderedProblem({
			problems: [],
			renderedProblems: [],
			usedIndices: new Set()
		});
		expect(result.rendered).toBeNull();
		expect(result.error).toContain('No problems available');
	});

	it('picks from candidate list and updates used set', () => {
		const result = pickRenderedProblem({
			problems,
			renderedProblems,
			usedIndices: new Set([0]),
			candidateIndices: [1, 2],
			random: () => 0
		});

		expect(result.usedIndices.has(1)).toBe(true);
		expect(result.error).toBeNull();
		expect(result.rendered?.question).toBe('Q2');
	});

	it('resets used set once full pool is exhausted', () => {
		const result = pickRenderedProblem({
			problems,
			renderedProblems,
			usedIndices: new Set([0, 1, 2]),
			candidateIndices: [0, 2],
			random: () => 0
		});

		expect(result.usedIndices.has(0)).toBe(true);
		expect(result.usedIndices.size).toBe(1);
	});

	it('returns filter error when candidate set is empty', () => {
		const result = pickRenderedProblem({
			problems,
			renderedProblems,
			usedIndices: new Set(),
			candidateIndices: []
		});
		expect(result.rendered).toBeNull();
		expect(result.error).toContain('No problems match');
	});

	it('returns an error if rendered pool does not match problem pool', () => {
		const result = pickRenderedProblem({
			problems,
			renderedProblems: renderedProblems.slice(0, 2),
			usedIndices: new Set()
		});

		expect(result.rendered).toBeNull();
		expect(result.error).toContain('Rendered problems are unavailable');
	});
});
