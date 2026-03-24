<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Latex from '$lib/components/ui/latex.svelte';
	import VirtualKeyboard from './virtual-keyboard.svelte';
	import { getQuestionEnv } from '$lib/state/session-context.svelte';
	import { evaluateAnswer } from '$lib/answer-evaluation';
	import type { RenderedProblem } from '$lib/types';

	let {
		data,
		problemId: _
	}: {
		data: RenderedProblem;
		problemId: string;
	} = $props();

	const env = getQuestionEnv();

	let formula = $state<string[]>([]);

	let variables = $derived.by(() => {
		return Object.keys(data.variableMap || {})
			.map((variable) => variable.replace(/\$/g, ''))
			.sort();
	});

	const symbols = ['\\land', '\\lor', '\\to', '\\leftrightarrow', '\\neg', '(', ')'];

	function addSymbol(symbol: string) {
		if (env.status === 'correct' || env.disabled) return;
		formula = [...formula, symbol.replace(/\$/g, '')];
	}

	function backspace() {
		if (env.status === 'correct' || env.disabled || formula.length === 0) return;
		formula = formula.slice(0, -1);
	}

	function clear() {
		if (env.status === 'correct' || env.disabled) return;
		formula = [];
	}

	let serializedAnswer = $derived(formula.join(' '));

	function handleCheck() {
		if (formula.length === 0 || env.disabled || env.status === 'correct') return;
		const answer = formula.join(' ');
		const correct = evaluateAnswer(
			{ ...data, type: 'formula-builder' } as Parameters<typeof evaluateAnswer>[0],
			answer
		);
		env.onAnswer(correct, answer);
	}

	let canSubmit = $derived(formula.length > 0 && env.status !== 'correct' && !env.disabled);
</script>

<div
	class="space-y-6"
	data-testid="problem-form"
	data-correct-answer={data.answer}
	data-problem-type="formula-builder"
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

	{#if data.variableMap && data.variableKeysHtml && Object.keys(data.variableMap).length > 0}
		<div class="space-y-3">
			<p class="text-muted-foreground text-center text-base font-semibold tracking-wide uppercase">
				Variable Key
			</p>
			<div class="flex flex-wrap justify-center gap-2 sm:gap-4">
				{#each Object.entries(data.variableMap) as [variable, meaning] (variable)}
					<span class="rounded-lg border px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base">
						<span class="text-foreground inline font-bold"
							>{@html data.variableKeysHtml[variable]}</span
						>
						<span class="text-foreground"> = </span>
						<span class="text-foreground">{meaning}</span>
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<div>
		<div
			class="bg-card min-h-16 w-full rounded-lg border-2 border-dashed px-4 py-4 text-center sm:px-8
				{formula.length > 0 ? 'border-primary/50' : 'border-border'}"
			data-testid="formula-display"
		>
			<div class="text-xl {formula.length === 0 ? 'text-muted-foreground' : 'text-foreground'}">
				{#if formula.length === 0}
					...
				{:else}
					{@const formulaStr = formula.join(' ')}
					<Latex content={`$${formulaStr}$`} />
				{/if}
			</div>
		</div>
	</div>

	<VirtualKeyboard
		{variables}
		{symbols}
		onKeyPress={addSymbol}
		onBackspace={backspace}
		onClear={clear}
		disabled={env.status === 'correct' || env.disabled}
	/>

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
