<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Component } from 'svelte';

	import * as Card from '$lib/components/ui/card';
	import { setQuestionEnv } from '$lib/state/session-context.svelte';
	import QuestionMcq from '$lib/components/questions/question-mcq.svelte';
	import QuestionTruthTable from '$lib/components/questions/question-truth-table.svelte';
	import QuestionAssertionJudgment from '$lib/components/questions/question-assertion-judgment.svelte';
	import QuestionFormulaBuilder from '$lib/components/questions/question-formula-builder.svelte';

	import type { PageData } from './$types';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const QUESTION_COMPONENTS: Record<string, Component<any>> = {
		mcq: QuestionMcq,
		'truth-table': QuestionTruthTable,
		'assertion-judgment': QuestionAssertionJudgment,
		'formula-builder': QuestionFormulaBuilder
	};

	const ESTIMATED_QUESTIONS = 10;

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);

	setQuestionEnv({
		get status() {
			return 'idle' as const;
		},
		get disabled() {
			return submitting;
		},
		diagnostic: true,
		get submissionCount() {
			return 0;
		},
		onAnswer() {} // no-op; form handles submission
	});

	let progressPercent = $derived(Math.min((data.questionNumber / ESTIMATED_QUESTIONS) * 100, 100));
</script>

<svelte:head>
	<title>Diagnostic Assessment | Introduction to Propositional Logic</title>
	<meta
		name="description"
		content="Adaptive diagnostic for propositional logic to place you at the right starting lesson."
	/>
</svelte:head>

<div
	class="flex min-h-dvh items-start justify-center p-4 py-8 sm:items-center"
	data-testid="diagnostic-page"
>
	<main class="flex w-full max-w-4xl flex-col gap-6">
		<header class="flex flex-col gap-3 text-center" data-testid="diagnostic-header">
			<h1 class="text-foreground text-lg font-semibold">Diagnostic Assessment</h1>
			<p class="text-muted-foreground text-sm" data-question-number={data.questionNumber}>
				Question {data.questionNumber} of ~{ESTIMATED_QUESTIONS}
			</p>
			<div class="bg-muted mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full">
				<div
					class="bg-primary h-full rounded-full transition-all duration-300 ease-out"
					style="width: {progressPercent}%"
				></div>
			</div>
		</header>

		{#key data.problemId}
			<div in:fade={{ duration: 150, easing: cubicOut }}>
				<Card.Root data-testid="diagnostic-question" data-topic-id={data.topic.id}>
					<Card.Header>
						<div class="flex items-center gap-2">
							<div
								class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full"
							>
								<span class="icon-[mingcute--flash-fill] size-4"></span>
							</div>
							<div>
								<p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
									Testing
								</p>
								<p
									class="text-foreground text-sm font-semibold"
									data-testid="diagnostic-topic-title"
								>
									{data.topic.title}
								</p>
							</div>
						</div>
					</Card.Header>

					<Card.Content class="flex flex-col gap-6">
						<form
							method="POST"
							action="?/answer"
							data-testid="diagnostic-form"
							use:enhance={({ formData, submitter }) => {
								if (submitter?.dataset.skip !== undefined) {
									formData.set('answer', '__skipped__');
								}
								submitting = true;
								return async ({ update }) => {
									await update();
									submitting = false;
								};
							}}
						>
							<input type="hidden" name="topicId" value={data.topic.id} />
							<input type="hidden" name="problemIndex" value={data.problemIndex} />
							<input type="hidden" name="challenge" value={data.challenge} />

							{#if data.problem}
								{@const QuestionComponent = QUESTION_COMPONENTS[data.problem.type]}
								{#if QuestionComponent}
									<QuestionComponent data={data.problem} problemId={data.problemId} />
								{:else}
									<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
										<p>Unknown problem type: {data.problem.type}</p>
										<p class="mt-2 text-sm">
											Supported types: mcq, truth-table, assertion-judgment, formula-builder
										</p>
									</div>
								{/if}
							{/if}

							<div class="mt-4 flex justify-center">
								<button
									type="submit"
									data-skip
									disabled={submitting}
									class="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
									data-testid="i-dont-know-button"
								>
									<span class="icon-[mingcute--question-line] size-4"></span>
									I Don't Know
								</button>
							</div>
						</form>
					</Card.Content>
				</Card.Root>
			</div>
		{/key}
	</main>
</div>
