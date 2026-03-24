<script lang="ts">
	import { untrack } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Component } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import ErrorBoundary from '$lib/components/ui/error-boundary.svelte';
	import { setQuestionEnv } from '$lib/state/session-context.svelte';
	import { LearnPhaseState } from '$lib/state/learn-phase-state.svelte';
	import type { Slide, Topic } from '$lib/types';
	import { prefersReducedMotion } from 'svelte/motion';
	import QuestionMcq from '$lib/components/questions/question-mcq.svelte';
	import QuestionTruthTable from '$lib/components/questions/question-truth-table.svelte';
	import QuestionAssertionJudgment from '$lib/components/questions/question-assertion-judgment.svelte';
	import QuestionFormulaBuilder from '$lib/components/questions/question-formula-builder.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const QUESTION_COMPONENTS: Record<string, Component<any>> = {
		mcq: QuestionMcq,
		'truth-table': QuestionTruthTable,
		'assertion-judgment': QuestionAssertionJudgment,
		'formula-builder': QuestionFormulaBuilder
	};

	const {
		topic,
		slides,
		onStartTest
	}: {
		topic: Topic;
		slides: Slide[];
		onStartTest: () => void;
	} = $props();

	// topic/slides are stable per instance (parent keys by topicId)
	const s = untrack(() => new LearnPhaseState(topic, slides));

	let submitting = $state(false);
	let submissionCount = $state(0);

	setQuestionEnv({
		get status() {
			if (s.status === 'success') return 'correct';
			if (s.status === 'failure') return 'wrong';
			return 'idle';
		},
		get disabled() {
			return submitting;
		},
		diagnostic: false,
		get submissionCount() {
			return submissionCount;
		},
		onAnswer(correct: boolean) {
			submitting = true;
			setTimeout(
				() => {
					submitting = false;
					if (correct) s.onCorrect();
					else s.onWrong();
					submissionCount++;
				},
				prefersReducedMotion.current ? 0 : 300
			);
		}
	});
</script>

<article
	class="border-border bg-card min-h-100 w-full rounded-xl border p-8 shadow-xs transition-all sm:p-12"
	aria-label="Lesson content"
	data-testid="practice-content"
	data-score={s.score}
	data-required-score={LearnPhaseState.REQUIRED_SCORE}
	data-attempt-phase={s.attemptPhase}
	data-pool-exhausted={s.poolExhausted}
>
	{#if s.error}
		<ErrorBoundary error={s.error} onRetry={() => s.retry()} />
	{:else if s.poolExhausted}
		<div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
			<div
				class="flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30"
			>
				<span class="icon-[mingcute--book-2-line] size-8 text-amber-600 dark:text-amber-400"></span>
			</div>
			<h2 class="text-foreground text-xl font-semibold">Time to Review</h2>
			<p class="text-muted-foreground max-w-md">
				You've attempted all available questions for this concept. Let's review the material before
				trying again.
			</p>
		</div>
	{:else if s.currentSlide?.type === 'content'}
		{#key s.slideIndex}
			<div in:fade={{ duration: 200 }}>
				<div
					class="prose prose-slate sm:prose-lg prose-headings:font-semibold prose-h1:text-3xl prose-h1:sm:text-4xl prose-h2:text-xl prose-p:leading-relaxed prose-a:text-sky-600 prose-img:rounded-xl max-w-none sm:text-lg"
					data-testid="content-slide"
				>
					{@html s.currentSlide.html}
				</div>
			</div>
		{/key}
	{:else if s.currentSlide?.type === 'problem' && s.problem}
		{#key `${s.slideIndex}-${s.problemKey}`}
			<div in:fade={{ duration: 200 }} data-testid="problem-slide">
				<div class="mb-4 flex items-center justify-center gap-2" data-testid="score-indicator">
					<span class="text-muted-foreground text-sm">Progress:</span>
					<div class="flex gap-1">
						{#each Array(LearnPhaseState.REQUIRED_SCORE) as _, i (i)}
							<div
								class="size-3 rounded-full transition-colors {s.score > i
									? 'bg-emerald-500'
									: 'bg-muted'}"
								data-testid="score-dot-{i}"
								data-filled={s.score > i}
							></div>
						{/each}
					</div>
				</div>

				<header class="mb-3 flex items-center justify-center gap-2 text-center">
					<div
						class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full"
					>
						<span class="icon-[mingcute--flash-fill] size-3.5"></span>
					</div>
					<span class="text-primary text-sm font-bold tracking-wider uppercase">Practice</span>
				</header>

				{#if s.attemptPhase === 'showHint' && s.problem.hintHtml}
					<div
						class="border-muted-foreground/20 mb-6 rounded-xl border-2 border-dashed px-5 py-4"
						transition:slide={{ duration: 200 }}
						data-testid="hint-panel"
					>
						<p class="text-foreground/80 mb-2 text-sm font-semibold">Hint</p>
						<div
							class="prose prose-slate prose-p:leading-relaxed prose-p:my-1 dark:prose-invert max-w-none"
						>
							{@html s.problem.hintHtml}
						</div>
					</div>
				{/if}

				{#if s.attemptPhase === 'showWalkthrough' && s.problem.walkthroughHtml}
					<div
						class="border-muted-foreground/20 mb-6 rounded-xl border-2 border-dashed px-5 py-4"
						transition:slide={{ duration: 200 }}
						data-testid="walkthrough-panel-forced"
					>
						<p class="text-foreground/80 mb-2 text-sm font-semibold">Walkthrough</p>
						<div
							class="prose prose-slate prose-p:leading-relaxed prose-p:my-1 dark:prose-invert max-w-none"
						>
							{@html s.problem.walkthroughHtml}
						</div>
					</div>
				{/if}

				{#if true}
					{@const QuestionComponent = QUESTION_COMPONENTS[s.problem.type]}
					{#if QuestionComponent}
						<QuestionComponent data={s.problem} problemId={`${topic.id}-${s.slideIndex}`} />
					{:else}
						<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
							<p>Unknown problem type: {s.problem.type}</p>
							<p class="mt-2 text-sm">
								Supported types: mcq, truth-table, assertion-judgment, formula-builder
							</p>
						</div>
					{/if}
				{/if}
			</div>
		{/key}
	{:else}
		<div
			class="text-muted-foreground flex items-center justify-center py-16"
			data-testid="loading-problem"
		>
			<span class="icon-[mingcute--loading-line] size-6 animate-spin"></span>
			<span class="ml-2">Loading...</span>
		</div>
	{/if}
</article>

<nav
	class="mt-8 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4"
	aria-label="Lesson navigation"
	data-testid="practice-nav"
>
	<Button
		variant="ghost"
		onclick={() => s.goBack()}
		disabled={s.slideIndex === 0}
		aria-label="Go to previous slide"
		data-testid="prev-button"
	>
		<span class="icon-[mingcute--arrow-left-line]" aria-hidden="true"></span>
		Back
	</Button>

	<div
		class="mx-auto w-full max-w-96 min-w-0 px-2"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={slides.length}
		aria-valuenow={s.slideIndex + 1}
		aria-valuetext={`${Math.round(s.progress)}% complete`}
		aria-label="Slide progress"
		data-testid="slide-indicators"
	>
		<div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
			<div
				class="bg-primary h-full rounded-full transition-all duration-300 ease-out"
				style={`width: ${s.progress}%`}
				data-testid="slide-indicator-progress"
			></div>
		</div>
	</div>

	<Button
		onclick={() => s.continue(onStartTest)}
		disabled={!s.canProceed}
		aria-label={s.poolExhausted
			? 'Review material'
			: s.slideIndex === slides.length - 1 && s.status !== 'failure'
				? 'Start test'
				: s.status === 'success' && !s.completed
					? 'Next question'
					: 'Continue to next slide'}
		data-testid="next-button"
	>
		{#if s.poolExhausted}
			Review Material
			<span class="icon-[mingcute--book-2-line]" aria-hidden="true"></span>
		{:else if s.status === 'success' && !s.completed}
			Next Question
			<span class="icon-[mingcute--arrow-right-line]" aria-hidden="true"></span>
		{:else if s.slideIndex === slides.length - 1}
			Start Test
			<span class="icon-[mingcute--arrow-right-line]" aria-hidden="true"></span>
		{:else}
			Continue
			<span class="icon-[mingcute--arrow-right-line]" aria-hidden="true"></span>
		{/if}
	</Button>
</nav>
