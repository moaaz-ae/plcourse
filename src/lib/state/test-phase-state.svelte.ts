import { pickRenderedProblem } from '$lib/learn/problem-picker';
import { Rating, type RenderedProblem, type Topic } from '$lib/types';

export class TestPhaseState {
	static readonly QUESTION_COUNT = 5;

	problem = $state<RenderedProblem | null>(null);
	cycleIndex = $state(0);
	solved = $state(false);
	result = $state<boolean | null>(null);
	mistakes = $state(0);
	error = $state<string | null>(null);
	problemKey = $state(0);
	isFormSubmitting = $state(false);
	formError = $state<string | null>(null);

	private usedIndices = new Set<number>();
	readonly topic: Topic;
	readonly mode: 'learn' | 'review';

	done = $derived.by(() => {
		if (!this.solved) return false;
		if (this.mode === 'learn' && this.isMercyRule()) return true;
		return this.cycleIndex === TestPhaseState.QUESTION_COUNT - 1;
	});

	mercyRule = $derived.by(() => {
		if (this.mode !== 'learn') return false;
		return this.isMercyRule();
	});

	grade = $derived.by((): Rating => {
		if (this.mistakes === 0) return Rating.Easy;
		if (this.mistakes === 1) return Rating.Good;
		if (this.mistakes === 2) return Rating.Hard;
		return Rating.Again;
	});

	progress = $derived(
		((this.cycleIndex + (this.solved ? 1 : 0)) / TestPhaseState.QUESTION_COUNT) * 100
	);

	constructor(topic: Topic, mode: 'learn' | 'review') {
		this.topic = topic;
		this.mode = mode;

		if (!topic?.problems?.length) {
			this.error = 'No problems available for this topic.';
			return;
		}
		this.pickProblem();
	}

	onCorrect(): void {
		this.solved = true;
		this.result = true;
	}

	onWrong(): void {
		this.solved = true;
		this.result = false;
		this.mistakes++;
	}

	next(): void {
		if (this.cycleIndex < TestPhaseState.QUESTION_COUNT - 1) {
			this.cycleIndex++;
			this.pickProblem();
		}
	}

	retry(): void {
		this.error = null;
		this.pickProblem();
	}

	// ── Private ──────────────────────────────────────────────────────────────

	private isMercyRule(): boolean {
		return this.cycleIndex === 2 && this.mistakes === 0 && this.solved && this.result === true;
	}

	private pickProblem(): void {
		const picked = pickRenderedProblem({
			problems: this.topic.problems,
			renderedProblems: this.topic.renderedProblems,
			usedIndices: this.usedIndices
		});

		this.usedIndices = picked.usedIndices;
		this.problem = picked.rendered;
		this.error = picked.error;
		this.solved = false;
		this.result = null;
		this.problemKey++;
	}
}
