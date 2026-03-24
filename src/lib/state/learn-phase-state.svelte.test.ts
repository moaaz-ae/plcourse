import { describe, expect, it } from 'vitest';
import { flushSync } from 'svelte';
import { LearnPhaseState } from './learn-phase-state.svelte';
import type { Topic, Slide, GeneratedProblem, RenderedProblem } from '$lib/types';

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

function makeSlides(): Slide[] {
	return [
		{ type: 'content', html: '<p>Lesson content</p>' },
		{ type: 'problem' },
		{ type: 'content', html: '<p>More content</p>' },
		{ type: 'problem' }
	];
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('LearnPhaseState', () => {
	it('initializes with correct defaults', () => {
		const topic = makeTopic(5);
		const slides = makeSlides();
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		expect(s.slideIndex).toBe(0);
		expect(s.status).toBe('idle');
		expect(s.score).toBe(0);
		expect(s.attemptPhase).toBe('answering');
		expect(s.poolExhausted).toBe(false);
		expect(s.error).toBeNull();
		expect(s.currentSlide?.type).toBe('content');
		expect(s.problem).toBeNull(); // content slide, no problem
	});

	it('loads a problem for a problem slide', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		expect(s.problem).not.toBeNull();
		expect(s.currentSlide?.type).toBe('problem');
	});

	it('onCorrect increments score and marks success', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		s.onCorrect();
		flushSync();

		expect(s.score).toBe(1);
		expect(s.status).toBe('success');
		expect(s.completed).toBe(false);
	});

	it('onCorrect marks completed at REQUIRED_SCORE', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		s.onCorrect();
		flushSync();
		expect(s.completed).toBe(false);

		// Simulate continue → next question
		s.continue(() => {});
		flushSync();

		s.onCorrect();
		flushSync();
		expect(s.score).toBe(2);
		expect(s.completed).toBe(true);
	});

	it('onWrong resets score and escalates to showHint', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		// Give some score first
		s.onCorrect();
		flushSync();
		expect(s.score).toBe(1);

		// continue → next question
		s.continue(() => {});
		flushSync();

		s.onWrong();
		flushSync();
		expect(s.score).toBe(0);
		expect(s.attemptPhase).toBe('showHint');
		expect(s.status).toBe('failure');
	});

	it('onWrong escalates from showHint to showWalkthrough', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		s.onWrong(); // answering → showHint
		flushSync();
		expect(s.attemptPhase).toBe('showHint');

		s.onWrong(); // showHint → showWalkthrough
		flushSync();
		expect(s.attemptPhase).toBe('showWalkthrough');
	});

	it('onCorrect during hint phase does not increment score', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		s.onWrong(); // → showHint, score = 0
		flushSync();

		s.onCorrect(); // correct during hint
		flushSync();
		expect(s.score).toBe(0); // score not incremented during hint
		expect(s.status).toBe('success');
	});

	it('continue advances to next slide for content', () => {
		const topic = makeTopic(5);
		const slides = makeSlides();
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		expect(s.slideIndex).toBe(0);
		expect(s.currentSlide?.type).toBe('content');

		s.continue(() => {});
		flushSync();
		expect(s.slideIndex).toBe(1);
		expect(s.currentSlide?.type).toBe('problem');
	});

	it('continue calls startTest on last slide', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		// Complete the required score
		s.onCorrect();
		flushSync();
		s.continue(() => {});
		flushSync();
		s.onCorrect();
		flushSync();

		let testStarted = false;
		s.continue(() => {
			testStarted = true;
		});
		flushSync();

		expect(testStarted).toBe(true);
	});

	it('goBack decrements slideIndex', () => {
		const topic = makeTopic(5);
		const slides = makeSlides();
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		s.continue(() => {}); // slide 0 → 1
		flushSync();
		expect(s.slideIndex).toBe(1);

		s.goBack();
		flushSync();
		expect(s.slideIndex).toBe(0);
	});

	it('goBack does nothing at slide 0', () => {
		const topic = makeTopic(5);
		const slides = makeSlides();
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		s.goBack();
		flushSync();
		expect(s.slideIndex).toBe(0);
	});

	it('progress is calculated correctly', () => {
		const topic = makeTopic(5);
		const slides = makeSlides(); // 4 slides
		const s = new LearnPhaseState(topic, slides);

		flushSync();

		// slide 0 of 4 → (0+1)/4 = 25%
		expect(s.progress).toBe(25);
	});

	it('canProceed is true for content slides', () => {
		const topic = makeTopic(5);
		const slides = makeSlides();
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		expect(s.canProceed).toBe(true); // content slide
	});

	it('canProceed is false for idle problem slides', () => {
		const topic = makeTopic(5);
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		expect(s.canProceed).toBe(false);
	});

	it('pool exhaustion is detected', () => {
		const topic = makeTopic(1); // Only 1 problem
		const slides: Slide[] = [{ type: 'problem' }];
		const s = new LearnPhaseState(topic, slides);

		flushSync();
		expect(s.problem).not.toBeNull();

		// Correct answer, then continue → picks next problem → pool exhausted
		s.onCorrect();
		flushSync();
		s.continue(() => {}); // should try to load next problem
		flushSync();

		expect(s.poolExhausted).toBe(true);
	});
});
