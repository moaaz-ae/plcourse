<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { getQuestionEnv } from '$lib/state/session-context.svelte';
	import { evaluateAnswer } from '$lib/answer-evaluation';
	import type { RenderedProblem } from '$lib/types';

	let {
		data,
		problemId
	}: {
		data: RenderedProblem;
		problemId: string;
	} = $props();

	const env = getQuestionEnv();

	let selectedOption = $state<string | null>(null);
	let shuffledIndices = $derived.by(() => shuffleOptionIndices(data.options));

	function shuffleOptionIndices(options?: string[]): number[] {
		if (!options) return [];
		const indices = options.map((_, i) => i);
		for (let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}
		return indices;
	}

	let serializedAnswer = $derived(selectedOption ?? '');

	function handleCheck() {
		if (!selectedOption || env.disabled || env.status === 'correct') return;
		const correct = evaluateAnswer(
			{ ...data, type: 'mcq' } as Parameters<typeof evaluateAnswer>[0],
			selectedOption
		);
		env.onAnswer(correct, selectedOption);
	}

	let canSubmit = $derived(!!selectedOption && env.status !== 'correct' && !env.disabled);
</script>

<div
	class="space-y-6"
	data-testid="problem-form"
	data-correct-answer={data.answer}
	data-problem-type="mcq"
	data-status={env.status}
	data-submission-count={env.submissionCount}
>
	{#if env.diagnostic}
		<input type="hidden" name="answer" value={serializedAnswer} />
	{/if}

	<div
		class="prose prose-slate prose-p:m-0 text-foreground max-w-none text-lg"
		data-testid="problem-question"
	>
		{@html data.questionHtml}
	</div>

	{#if data.options && data.optionsHtml}
		<fieldset class="flex w-full flex-col gap-2" data-testid="mcq-options">
			<legend class="sr-only">Select an answer</legend>
			{#each shuffledIndices as optionIndex (optionIndex)}
				{@const option = data.options[optionIndex]}
				<label
					class="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-all sm:p-4
						{selectedOption === option
						? 'border-primary bg-primary/5 ring-ring ring-2'
						: 'border-border bg-card hover:border-input hover:bg-accent'}
						{env.status === 'correct' || env.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}"
					data-testid="mcq-option"
					data-option-value={option}
					data-selected={selectedOption === option}
				>
					<input
						type="radio"
						name="mcq-answer-{problemId}"
						value={option}
						bind:group={selectedOption}
						disabled={env.status === 'correct' || env.disabled}
						class="sr-only"
					/>
					<div
						class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 {selectedOption ===
						option
							? 'border-primary bg-primary'
							: 'border-muted-foreground/50'}"
						aria-hidden="true"
					>
						{#if selectedOption === option}
							<div class="size-2 rounded-full bg-white"></div>
						{/if}
					</div>
					<span class="text-foreground font-medium">
						{@html data.optionsHtml[optionIndex]}
					</span>
				</label>
			{/each}
		</fieldset>
	{/if}

	<div class="flex flex-wrap items-center gap-3">
		<Button
			type={env.diagnostic ? 'submit' : 'button'}
			disabled={!canSubmit}
			onclick={env.diagnostic ? undefined : handleCheck}
			data-testid="submit-button"
		>
			{env.disabled ? 'Checking...' : 'Check'}
		</Button>

		{#if !env.diagnostic}
			{#if env.status === 'correct'}
				<span
					class="animate-in fade-in slide-in-from-left-1 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
					data-testid="feedback-correct"
					role="alert"
				>
					<span class="icon-[mingcute--check-circle-fill] size-4 shrink-0"></span>
					Correct!
				</span>
			{:else if env.status === 'wrong'}
				<span
					class="animate-in fade-in slide-in-from-left-1 flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400"
					data-testid="feedback-wrong"
					role="alert"
				>
					<span class="icon-[mingcute--close-circle-fill] size-4 shrink-0"></span>
					Incorrect
				</span>
			{/if}
		{/if}
	</div>
</div>
