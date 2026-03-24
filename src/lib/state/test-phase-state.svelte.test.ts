import { describe, expect, it } from 'vitest';
import { flushSync } from 'svelte';
import { TestPhaseState } from './test-phase-state.svelte';
import { Rating, type Topic, type GeneratedProblem, type RenderedProblem } from '$lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeProblem(index: number): GeneratedProblem {
	return {
		type: 'mcq',
		question: `Q${index}`,
		answer: `A${index}`,
		hint: `Hint ${index}`,
		walkthrough: `Walkthrough ${index}`,
		options: [`A${index}`, `B${index}`]
	};
}

function makeRendered(index: number): RenderedProblem {
	return {
		type: 'mcq',
		question: `Q${index}`,
		answer: `A${index}`,
		hint: `Hint ${index}`,
		walkthrough: `Walkthrough ${index}`,
		questionHtml: `<p>Q${index}</p>`,
		hintHtml: `<p>Hint ${index}</p>`,
		walkthroughHtml: `<p>Walkthrough ${index}</p>`,
		options: [`A${index}`, `B${index}`],
		optionsHtml: [`A${index}`, `B${index}`]
	};
}

function makeTopic(problemCount: number): Topic {
	const problems = Array.from({ length: problemCount }, (_, i) => makeProblem(i));
	const rendered = Array.from({ length: problemCount }, (_, i) => makeRendered(i));
	return {
		id: 'test-topic',
		title: 'Test Topic',
		prerequisites: [],
		problems,
		renderedProblems: rendered,
		slides: []
	};
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('TestPhaseState', () => {
	it('initializes with correct defaults', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		expect(s.cycleIndex).toBe(0);
		expect(s.solved).toBe(false);
		expect(s.result).toBeNull();
		expect(s.mistakes).toBe(0);
		expect(s.problem).not.toBeNull();
		expect(s.error).toBeNull();
		expect(s.done).toBe(false);
	});

	it('sets error when no problems available', () => {
		const topic = makeTopic(0);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		expect(s.error).toBe('No problems available for this topic.');
		expect(s.problem).toBeNull();
	});

	it('onCorrect sets solved and result', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		s.onCorrect();
		flushSync();

		expect(s.solved).toBe(true);
		expect(s.result).toBe(true);
		expect(s.mistakes).toBe(0);
	});

	it('onWrong sets solved, result, and increments mistakes', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		s.onWrong();
		flushSync();

		expect(s.solved).toBe(true);
		expect(s.result).toBe(false);
		expect(s.mistakes).toBe(1);
	});

	it('next advances cycleIndex and picks new problem', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		s.onCorrect();
		flushSync();

		const prevKey = s.problemKey;
		s.next();
		flushSync();

		expect(s.cycleIndex).toBe(1);
		expect(s.solved).toBe(false);
		expect(s.result).toBeNull();
		expect(s.problemKey).not.toBe(prevKey);
	});

	it('done is true after QUESTION_COUNT questions', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		for (let i = 0; i < TestPhaseState.QUESTION_COUNT - 1; i++) {
			s.onCorrect();
			flushSync();
			s.next();
			flushSync();
		}

		s.onCorrect();
		flushSync();

		expect(s.cycleIndex).toBe(TestPhaseState.QUESTION_COUNT - 1);
		expect(s.done).toBe(true);
	});

	it('mercy rule triggers on 3rd question with 0 mistakes (learn mode)', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		s.onCorrect();
		flushSync();
		s.next();
		flushSync();

		s.onCorrect();
		flushSync();
		s.next();
		flushSync();

		s.onCorrect();
		flushSync();

		expect(s.mercyRule).toBe(true);
		expect(s.done).toBe(true);
	});

	it('mercy rule does not trigger in review mode', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'review');

		flushSync();

		s.onCorrect();
		flushSync();
		s.next();
		flushSync();
		s.onCorrect();
		flushSync();
		s.next();
		flushSync();
		s.onCorrect();
		flushSync();

		expect(s.mercyRule).toBe(false);
		expect(s.done).toBe(false);
	});

	it('mercy rule does not trigger with mistakes', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		s.onWrong();
		flushSync();
		s.next();
		flushSync();
		s.onCorrect();
		flushSync();
		s.next();
		flushSync();
		s.onCorrect();
		flushSync();

		expect(s.mercyRule).toBe(false);
		expect(s.done).toBe(false);
	});

	it('grade calculation: 0 mistakes → Easy', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');
		flushSync();
		expect(s.grade).toBe(Rating.Easy);
	});

	it('grade calculation: 1 mistake → Good', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');
		flushSync();
		s.onWrong();
		flushSync();
		expect(s.grade).toBe(Rating.Good);
	});

	it('grade calculation: 2 mistakes → Hard', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');
		flushSync();
		s.onWrong();
		s.onWrong();
		flushSync();
		expect(s.grade).toBe(Rating.Hard);
	});

	it('grade calculation: 3+ mistakes → Again', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');
		flushSync();
		s.onWrong();
		s.onWrong();
		s.onWrong();
		flushSync();
		expect(s.grade).toBe(Rating.Again);
	});

	it('progress calculation', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		expect(s.progress).toBe(0);

		s.onCorrect();
		flushSync();
		expect(s.progress).toBe(20);

		s.next();
		flushSync();
		expect(s.progress).toBe(20);
	});

	it('retry picks a new problem', () => {
		const topic = makeTopic(10);
		const s = new TestPhaseState(topic, 'learn');

		flushSync();

		const prevKey = s.problemKey;
		s.retry();
		flushSync();

		expect(s.problemKey).not.toBe(prevKey);
		expect(s.error).toBeNull();
	});
});
