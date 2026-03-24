import { getCandidateProblemIndices, pickRenderedProblem } from '$lib/learn/problem-picker';
import type { Slide, Topic, RenderedProblem } from '$lib/types';

export type AttemptPhase = 'answering' | 'showHint' | 'showWalkthrough';

interface SlideRuntime {
	status: 'idle' | 'success' | 'failure';
	completed: boolean;
	problem: RenderedProblem | null;
	score: number;
	attemptPhase: AttemptPhase;
	poolExhausted: boolean;
}

export class LearnPhaseState {
	static readonly REQUIRED_SCORE = 2;

	slideIndex = $state(0);
	problemKey = $state(0);
	error = $state<string | null>(null);
	private runtimes = $state<SlideRuntime[]>([]);

	// Not reactive — internal bookkeeping (assigned in constructor before any reactive use)
	private usedBySlide: Set<number>[];
	private readonly topic!: Topic;
	readonly slides: Slide[] = [];
	private readonly candidatesBySlide!: (number[] | null)[];

	// All template reads go through these deriveds
	currentSlide = $derived(this.slides[this.slideIndex]);
	private rt = $derived(this.runtimes[this.slideIndex]);
	status = $derived(this.rt?.status ?? 'idle');
	attemptPhase = $derived(this.rt?.attemptPhase ?? ('answering' as AttemptPhase));
	score = $derived(this.rt?.score ?? 0);
	poolExhausted = $derived(this.rt?.poolExhausted ?? false);
	problem = $derived(this.currentSlide?.type === 'problem' ? (this.rt?.problem ?? null) : null);
	progress = $derived(this.slides.length ? ((this.slideIndex + 1) / this.slides.length) * 100 : 0);
	canProceed = $derived(
		this.currentSlide?.type === 'content' || this.status === 'success' || this.poolExhausted
	);
	completed = $derived(this.rt?.completed ?? false);

	constructor(topic: Topic, slides: Slide[]) {
		this.topic = topic;
		this.slides = slides;

		this.candidatesBySlide = slides.map((slide) =>
			slide.type === 'problem' ? getCandidateProblemIndices(topic.problems, slide.filter) : null
		);

		this.usedBySlide = slides.map(() => new Set<number>());

		this.runtimes = slides.map(() => ({
			status: 'idle' as const,
			completed: false,
			problem: null,
			score: 0,
			attemptPhase: 'answering' as AttemptPhase,
			poolExhausted: false
		}));

		if (slides[0]?.type === 'problem') {
			this.ensureProblemForSlide(0, false);
		}
	}

	onCorrect(): void {
		const rt = this.runtimes[this.slideIndex];
		if (!rt) return;
		if (rt.attemptPhase === 'answering') rt.score++;
		rt.status = 'success';
		if (rt.score >= LearnPhaseState.REQUIRED_SCORE) rt.completed = true;
	}

	onWrong(): void {
		const rt = this.runtimes[this.slideIndex];
		if (!rt) return;

		if (rt.attemptPhase === 'answering') {
			rt.score = 0;
			rt.attemptPhase = 'showHint';
			rt.status = 'failure';
		} else if (rt.attemptPhase === 'showHint') {
			rt.attemptPhase = 'showWalkthrough';
			rt.status = 'failure';
		}
	}

	continue(startTest: () => void): void {
		const rt = this.runtimes[this.slideIndex];

		if (this.currentSlide?.type === 'problem' && rt?.poolExhausted) {
			this.reviewMaterial();
			return;
		}

		if (this.currentSlide?.type === 'problem' && rt && this.status === 'success' && !rt.completed) {
			this.ensureProblemForSlide(this.slideIndex, true);
			return;
		}

		if (this.slideIndex < this.slides.length - 1) {
			this.setCurrentSlide(this.slideIndex + 1);
		} else {
			startTest();
		}
	}

	goBack(): void {
		if (this.slideIndex === 0) return;
		this.setCurrentSlide(this.slideIndex - 1);
	}

	retry(): void {
		this.error = null;
		if (this.currentSlide?.type === 'problem') {
			this.ensureProblemForSlide(this.slideIndex, true);
		}
	}

	reviewMaterial(): void {
		const rt = this.runtimes[this.slideIndex];
		if (rt) {
			this.usedBySlide[this.slideIndex] = new Set();
			rt.poolExhausted = false;
			rt.score = 0;
			rt.attemptPhase = 'answering';
			rt.status = 'idle';
			rt.problem = null;
		}
		const reviewIndex = this.findReviewSlideIndex();
		this.setCurrentSlide(reviewIndex);
	}

	// ── Private ──────────────────────────────────────────────────────────────

	private setCurrentSlide(index: number): void {
		this.slideIndex = index;
		this.error = null;
		if (this.slides[index]?.type === 'problem') {
			this.ensureProblemForSlide(index, false);
		}
	}

	private ensureProblemForSlide(index: number, forceRefresh: boolean): void {
		const slide = this.slides[index];
		if (slide?.type !== 'problem') return;

		const rt = this.runtimes[index];
		if (!rt) return;

		if (!forceRefresh && rt.problem) {
			this.error = null;
			this.problemKey++;
			return;
		}

		const slideUsed = this.usedBySlide[index];
		const candidates = this.candidatesBySlide[index] ?? [];
		const availableCandidates = candidates.filter((idx) => !slideUsed.has(idx));

		if (availableCandidates.length === 0 && candidates.length > 0) {
			rt.poolExhausted = true;
			this.error = null;
			this.problemKey++;
			return;
		}

		const picked = pickRenderedProblem({
			problems: this.topic.problems,
			renderedProblems: this.topic.renderedProblems,
			usedIndices: slideUsed,
			candidateIndices: candidates
		});

		this.usedBySlide[index] = picked.usedIndices;
		this.error = picked.error;
		rt.status = 'idle';
		rt.attemptPhase = 'answering';
		rt.problem = picked.rendered;
		this.problemKey++;
	}

	private findReviewSlideIndex(): number {
		let prevProblemIndex = -1;
		for (let i = this.slideIndex - 1; i >= 0; i--) {
			if (this.slides[i]?.type === 'problem') {
				prevProblemIndex = i;
				break;
			}
		}
		const startSearch = prevProblemIndex + 1;
		for (let i = startSearch; i < this.slideIndex; i++) {
			if (this.slides[i]?.type === 'content') {
				return i;
			}
		}
		return Math.max(0, startSearch);
	}
}
