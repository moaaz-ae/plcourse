<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Latex from '$lib/components/ui/latex.svelte';
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

	let selectedJudgment = $state<'valid' | 'invalid' | null>(null);
	const variables = $derived.by(() => extractVariables(data));

	let userCounterexample = $state<Record<string, boolean>>({});

	let scratchpadOpen = $state(false);
	let scratchpadAssignment = $state<Record<string, boolean>>({});
	let scratchpadPremiseEvals = $state<(boolean | null)[]>([]);
	let scratchpadConclusionEval = $state<boolean | null>(null);

	// Initialize working state immediately (no onMount needed)
	$effect.pre(() => {
		const vars = extractVariables(data);
		const initialAssignment = createTruthAssignment(vars);
		userCounterexample = { ...initialAssignment };
		scratchpadAssignment = { ...initialAssignment };
		scratchpadPremiseEvals = Array((data.premises || []).length).fill(null);
		scratchpadConclusionEval = null;
	});

	function cycleScratchpadPremise(index: number) {
		const current = scratchpadPremiseEvals[index];
		const next = current === null ? true : current === true ? false : null;
		scratchpadPremiseEvals = scratchpadPremiseEvals.map((value, i) => (i === index ? next : value));
	}

	function cycleScratchpadConclusion() {
		scratchpadConclusionEval =
			scratchpadConclusionEval === null ? true : scratchpadConclusionEval === true ? false : null;
	}

	function extractVariables(problem: RenderedProblem): string[] {
		const varSet = new Set<string>();
		const allFormulas = [...(problem.premises || []), problem.conclusion || ''];

		for (const formula of allFormulas) {
			const clean = formula.replace(/\$/g, '');
			const matches = clean.match(/[A-Z]/g);
			if (matches) {
				matches.forEach((variable) => varSet.add(variable));
			}
		}
		return Array.from(varSet).sort();
	}

	function createTruthAssignment(vars: string[]): Record<string, boolean> {
		const assignment: Record<string, boolean> = {};
		for (const variable of vars) {
			assignment[variable] = true;
		}
		return assignment;
	}

	function toggleScratchpadVar(variable: string) {
		scratchpadAssignment = {
			...scratchpadAssignment,
			[variable]: !scratchpadAssignment[variable]
		};
	}

	function toggleCounterexampleVar(variable: string) {
		if (env.status === 'correct' || env.disabled) return;
		userCounterexample = {
			...userCounterexample,
			[variable]: !userCounterexample[variable]
		};
	}

	function serializeAnswer(): string {
		return JSON.stringify({
			judgment: selectedJudgment,
			counterexample: userCounterexample
		});
	}

	let serializedAnswer = $derived(serializeAnswer());

	function handleCheck() {
		if (selectedJudgment === null || env.disabled || env.status === 'correct') return;
		const answer = serializeAnswer();
		const correct = evaluateAnswer(
			{ ...data, type: 'assertion-judgment' } as Parameters<typeof evaluateAnswer>[0],
			answer
		);
		env.onAnswer(correct, answer);
	}

	let showCounterexample = $derived(selectedJudgment === 'invalid');
</script>

<div
	class="space-y-6"
	data-testid="problem-form"
	data-correct-answer={data.answer}
	data-problem-type="assertion-judgment"
	data-counterexample={data.counterexample ? JSON.stringify(data.counterexample) : ''}
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

	{#if data.premisesHtml && data.conclusionHtml}
		<div class="w-full rounded-lg border px-4 py-4 sm:px-8">
			<div class="mb-3 space-y-2">
				<p class="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Premises</p>
				{#each data.premisesHtml as premiseHtml, idx (idx)}
					<div class="flex gap-2">
						<span class="text-foreground">{idx + 1}.</span>
						<span class="text-foreground">{@html premiseHtml}</span>
					</div>
				{/each}
			</div>
			<hr class="border-border my-3" />
			<div>
				<p class="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
					Conclusion
				</p>
				<div class="text-foreground flex gap-2">
					<span>∴</span>
					<span>{@html data.conclusionHtml}</span>
				</div>
			</div>
		</div>
	{/if}

	{#if data.premises && data.premises.length > 0}
		<div class="rounded-lg border border-dashed" data-testid="scratchpad">
			<button
				type="button"
				onclick={() => (scratchpadOpen = !scratchpadOpen)}
				class="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
			>
				<span class="icon-[mingcute--edit-2-line] size-4 shrink-0"></span>
				Scratchpad
				<span
					class="ml-auto size-4 shrink-0 transition-transform {scratchpadOpen
						? 'rotate-180'
						: ''} icon-[mingcute--down-line]"
				></span>
			</button>

			{#if scratchpadOpen}
				<div class="border-t border-dashed px-4 py-3">
					<div class="-mx-4 touch-pan-x overflow-x-auto px-4 sm:mx-0 sm:px-0">
						<div
							class="text-muted-foreground mb-2 flex items-center justify-center gap-1 text-xs sm:hidden"
						>
							<span class="icon-[mingcute--arrow-left-line] size-3"></span>
							<span>Scroll to see full table</span>
							<span class="icon-[mingcute--arrow-right-line] size-3"></span>
						</div>
						<table class="mx-auto border-collapse text-center">
							<thead>
								<tr>
									{#each variables as variable (variable)}
										<th
											class="border-border text-foreground border border-dashed px-3 py-1.5 text-sm font-semibold"
										>
											<Latex content={`$${variable}$`} />
										</th>
									{/each}
									<th class="border-border w-px border border-dashed bg-transparent px-0"></th>
									{#each data.premisesHtml || [] as premiseHtml, idx (idx)}
										<th
											class="border-border text-foreground border border-dashed px-3 py-1.5 text-sm font-semibold"
										>
											<span>{@html premiseHtml}</span>
										</th>
									{/each}
									{#if data.conclusionHtml}
										<th
											class="border-border text-foreground border border-dashed px-3 py-1.5 text-sm font-semibold"
										>
											<span>∴ {@html data.conclusionHtml}</span>
										</th>
									{/if}
								</tr>
							</thead>
							<tbody>
								<tr>
									{#each variables as variable (variable)}
										<td class="border-border border border-dashed p-0">
											<button
												type="button"
												onclick={() => toggleScratchpadVar(variable)}
												class="text-foreground hover:bg-accent flex h-full min-h-11 w-full min-w-11 items-center justify-center px-3 py-1.5 text-base font-semibold transition-colors"
											>
												{scratchpadAssignment[variable] ? 'T' : 'F'}
											</button>
										</td>
									{/each}
									<td class="border-border w-px border border-dashed bg-transparent px-0"></td>
									{#each data.premises || [] as _, idx (idx)}
										<td class="border-border border border-dashed p-0">
											<button
												type="button"
												onclick={() => cycleScratchpadPremise(idx)}
												class="hover:bg-accent flex h-full min-h-11 w-full min-w-11 items-center justify-center px-3 py-1.5 text-base font-semibold transition-colors
													{scratchpadPremiseEvals[idx] === null ? 'text-muted-foreground' : 'text-foreground'}"
											>
												{scratchpadPremiseEvals[idx] === null
													? '?'
													: scratchpadPremiseEvals[idx]
														? 'T'
														: 'F'}
											</button>
										</td>
									{/each}
									{#if data.conclusion}
										<td class="border-border border border-dashed p-0">
											<button
												type="button"
												onclick={cycleScratchpadConclusion}
												class="hover:bg-accent flex h-full min-h-11 w-full min-w-11 items-center justify-center px-3 py-1.5 text-base font-semibold transition-colors
													{scratchpadConclusionEval === null ? 'text-muted-foreground' : 'text-foreground'}"
											>
												{scratchpadConclusionEval === null
													? '?'
													: scratchpadConclusionEval
														? 'T'
														: 'F'}
											</button>
										</td>
									{/if}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div
		class="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
		data-testid="judgment-options"
	>
		<button
			type="button"
			onclick={() => (selectedJudgment = 'valid')}
			disabled={env.status === 'correct' || env.disabled}
			class="min-h-12 rounded-lg border-2 px-6 py-3 font-semibold transition-all
				{selectedJudgment === 'valid'
				? 'border-green-500 bg-green-50 text-green-700'
				: 'border-border bg-card text-foreground hover:border-green-300 hover:bg-green-50/50 active:bg-green-50/70'}
				{env.status === 'correct' ? 'cursor-not-allowed opacity-60' : ''}"
			data-testid="judgment-valid"
		>
			<span class="icon-[mingcute--check-circle-line] mr-2 inline-block size-5 align-middle"></span>
			Valid
		</button>
		<button
			type="button"
			onclick={() => (selectedJudgment = 'invalid')}
			disabled={env.status === 'correct' || env.disabled}
			class="min-h-12 rounded-lg border-2 px-6 py-3 font-semibold transition-all
				{selectedJudgment === 'invalid'
				? 'border-red-500 bg-red-50 text-red-700'
				: 'border-border bg-card text-foreground hover:border-red-300 hover:bg-red-50/50 active:bg-red-50/70'}
				{env.status === 'correct' ? 'cursor-not-allowed opacity-60' : ''}"
			data-testid="judgment-invalid"
		>
			<span class="icon-[mingcute--close-circle-line] mr-2 inline-block size-5 align-middle"></span>
			Invalid
		</button>
	</div>

	{#if showCounterexample}
		<div class="space-y-3">
			<p class="text-muted-foreground text-center text-sm font-medium sm:text-base">
				Provide a counterexample (truth values that make premises true but conclusion false):
			</p>
			<div class="-mx-4 touch-pan-x overflow-x-auto px-4 sm:mx-0 sm:px-0">
				<table class="mx-auto border-collapse text-center" data-testid="counterexample-table">
					<thead>
						<tr>
							{#each variables as variable (variable)}
								<th
									class="border-border bg-primary/10 text-foreground border border-dashed px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base"
								>
									<Latex content={`$${variable}$`} />
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						<tr>
							{#each variables as variable (variable)}
								<td
									class="border-border bg-primary/5 cursor-pointer border border-dashed p-0"
									data-testid="counterexample-{variable}"
								>
									<button
										type="button"
										onclick={() => toggleCounterexampleVar(variable)}
										disabled={env.status === 'correct' || env.disabled}
										class="text-foreground flex h-full min-h-11 w-full min-w-11 items-center justify-center px-3 py-2 text-base font-semibold transition-colors sm:px-4 sm:text-lg
											{env.status !== 'correct' ? 'hover:bg-accent active:bg-accent/80' : ''}"
									>
										{userCounterexample[variable] ? 'T' : 'F'}
									</button>
								</td>
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
			<p class="text-muted-foreground text-center text-sm sm:text-base">Tap cells to toggle T/F</p>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-3">
		<Button
			type={env.diagnostic ? 'submit' : 'button'}
			disabled={selectedJudgment === null || env.status === 'correct' || env.disabled}
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
