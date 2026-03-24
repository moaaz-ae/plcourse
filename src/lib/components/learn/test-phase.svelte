<script lang="ts">
	import { untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Component } from 'svelte';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import ErrorBoundary from '$lib/components/ui/error-boundary.svelte';
	import { setQuestionEnv } from '$lib/state/session-context.svelte';
	import { TestPhaseState } from '$lib/state/test-phase-state.svelte';
	import type { Topic } from '$lib/types';
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
		mode = 'learn'
	}: {
		topic: Topic;
		mode?: 'learn' | 'review';
	} = $props();

	// topic/mode are stable per instance (parent keys by topicId)
	const s = untrack(() => new TestPhaseState(topic, mode));

	let submitting = $state(false);
	let submissionCount = $state(0);
	const prefersReducedMotion =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	setQuestionEnv({
		get status() {
			if (s.result === true) return 'correct';
			if (s.result === false) return 'wrong';
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
				prefersReducedMotion ? 0 : 300
			);
		}
	});
</script>

<article
	class="border-border bg-card min-h-100 rounded-xl border p-8 shadow-xs sm:p-12"
	aria-label={mode === 'review' ? 'Review question' : 'Test question'}
	data-testid="test-content"
>
	{#if s.error}
		<ErrorBoundary error={s.error} onRetry={() => s.retry()} />
	{:else if s.problem}
		{#key s.problemKey}
			<div in:fly={{ x: 20, duration: 300 }} data-testid="test-problem">
				<header class="mb-3 flex items-center justify-center gap-2 text-center">
					<div
						class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full"
					>
						<span class="icon-[mingcute--flash-fill] size-3.5"></span>
					</div>
					<span class="text-primary text-sm font-bold tracking-wider uppercase">Practice</span>
				</header>

				{#if true}
					{@const QuestionComponent = QUESTION_COMPONENTS[s.problem.type]}
					{#if QuestionComponent}
						<QuestionComponent
							data={s.problem}
							problemId={mode === 'review' ? `review-${s.cycleIndex}` : `test-${s.cycleIndex}`}
						/>
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
			role="status"
			aria-live="polite"
			data-testid="loading"
		>
			<span class="icon-[mingcute--loading-line] size-6 animate-spin"></span>
			<span class="ml-2">Loading...</span>
		</div>
	{/if}
</article>

<nav
	class="mt-8 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4"
	aria-label={mode === 'review' ? 'Review navigation' : 'Test navigation'}
	data-testid="test-nav"
>
	<div></div>

	<div
		class="mx-auto w-full max-w-96 min-w-0 px-2"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={TestPhaseState.QUESTION_COUNT}
		aria-valuenow={s.cycleIndex + (s.solved ? 1 : 0)}
		aria-valuetext={`${Math.round(s.progress)}% complete`}
		aria-label="Test progress"
		data-testid="slide-indicators"
	>
		<div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
			<div
				class="bg-primary h-full rounded-full transition-all duration-300 ease-out"
				style={`width: ${s.progress}%`}
				data-testid="test-indicator-progress"
			></div>
		</div>
	</div>

	<div class="flex items-center justify-end">
		{#if s.done}
			<form
				method="POST"
				action="?/complete"
				use:enhance={() => {
					s.isFormSubmitting = true;
					s.formError = null;

					return async ({ result, update }) => {
						s.isFormSubmitting = false;

						if (result.type === 'failure') {
							s.formError =
								(result.data as { message?: string })?.message ?? 'Something went wrong';
							return;
						}

						await update();
					};
				}}
				data-testid="finish-form"
			>
				<input type="hidden" name="grade" value={s.grade} data-testid="grade-input" />
				<Button
					type="submit"
					disabled={!s.solved || s.isFormSubmitting}
					data-testid="finish-button"
				>
					{#if s.isFormSubmitting}
						Saving...
					{:else if mode === 'review'}
						Finish Review
					{:else}
						{s.mercyRule ? 'Finish Lesson (Perfect!)' : 'Finish Lesson'}
					{/if}
					<span class="icon-[mingcute--check-fill]" aria-hidden="true"></span>
				</Button>
				{#if s.formError}
					<p class="mt-2 text-sm text-red-600" data-testid="form-error">{s.formError}</p>
				{/if}
			</form>
		{:else}
			<Button
				onclick={() => s.next()}
				disabled={!s.solved}
				aria-label={mode === 'review' ? 'Go to next question' : 'Go to next problem'}
				data-testid="next-button"
			>
				{#if mode === 'review'}
					Next Question
				{:else}
					Next Problem
				{/if}
				<span class="icon-[mingcute--arrow-right-line]" aria-hidden="true"></span>
			</Button>
		{/if}
	</div>
</nav>
