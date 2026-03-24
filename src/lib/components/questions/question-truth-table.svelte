<script lang="ts">
	import { Button } from '$lib/components/ui/button';
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

	type UserAnswerMap = Record<string, boolean | null>;
	let userAnswers = $state<UserAnswerMap>({});
	let expectedTable = $derived(data.expectedTable ?? []);
	let hiddenColumns = $derived(data.hiddenColumns ?? []);

	function answerKey(rowIndex: number, colIndex: number): string {
		return `${rowIndex}:${colIndex}`;
	}

	function getAnswer(rowIndex: number, colIndex: number): boolean | null {
		return userAnswers[answerKey(rowIndex, colIndex)] ?? null;
	}

	function toggleCell(rowIndex: number, colIndex: number) {
		if (env.status === 'correct' || env.disabled) return;

		const key = answerKey(rowIndex, colIndex);
		const currentValue = userAnswers[key] ?? null;
		if (currentValue === null) {
			userAnswers[key] = true;
		} else if (currentValue === true) {
			userAnswers[key] = false;
		} else {
			userAnswers[key] = null;
		}
	}

	function getCellDisplay(value: boolean | null): string {
		if (value === null) return '?';
		return value ? 'T' : 'F';
	}

	function serializeAnswers(): string {
		const payload: Record<string, boolean> = {};
		for (let rowIndex = 0; rowIndex < expectedTable.length; rowIndex++) {
			for (const colIndex of hiddenColumns) {
				const value = getAnswer(rowIndex, colIndex);
				if (value !== null) {
					payload[answerKey(rowIndex, colIndex)] = value;
				}
			}
		}
		return JSON.stringify(payload);
	}

	let allFilled = $derived.by(() => {
		if (!expectedTable.length || !hiddenColumns.length) return false;
		return expectedTable.every((row, rowIndex) =>
			hiddenColumns.every(
				(colIndex) => row[colIndex] !== undefined && getAnswer(rowIndex, colIndex) !== null
			)
		);
	});

	let serializedAnswer = $derived(serializeAnswers());

	let canSubmit = $derived.by(() => {
		if (env.status === 'correct' || env.disabled) return false;
		return allFilled;
	});

	function handleCheck() {
		if (!canSubmit) return;
		const answer = serializeAnswers();
		const correct = evaluateAnswer(
			{ ...data, type: 'truth-table' } as Parameters<typeof evaluateAnswer>[0],
			answer
		);
		env.onAnswer(correct, answer);
	}
</script>

<div
	class="space-y-6"
	data-testid="problem-form"
	data-correct-answer={data.answer}
	data-problem-type="truth-table"
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

	{#if data.expectedTable && data.headersHtml}
		<div class="-mx-4 touch-pan-x overflow-x-auto px-4 sm:mx-0 sm:px-0">
			<div
				class="text-muted-foreground mb-2 flex items-center justify-center gap-1 text-xs sm:hidden"
			>
				<span class="icon-[mingcute--arrow-left-line] size-3"></span>
				<span>Scroll to see full table</span>
				<span class="icon-[mingcute--arrow-right-line] size-3"></span>
			</div>
			<div class="mx-auto w-fit overflow-hidden rounded-md border">
				<table
					class="border-separate border-spacing-0 text-center text-base sm:text-lg"
					data-testid="truth-table"
				>
					<thead>
						<tr>
							{#each data.headersHtml as headerHtml, idx (idx)}
								{@const isEditable = data.hiddenColumns?.includes(idx)}
								<th
									class="border-border text-foreground border-r border-b px-3 py-2.5 text-sm font-semibold last:border-r-0 sm:px-4 sm:text-base
									{isEditable ? 'bg-primary/10' : 'bg-muted/50'}"
								>
									{@html headerHtml}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.expectedTable as row, rowIdx (rowIdx)}
							<tr>
								{#each data.headersHtml as _, colIdx (colIdx)}
									{@const isHidden = data.hiddenColumns?.includes(colIdx)}
									<td
										class="border-border border-r border-b p-0 last:border-r-0
											{isHidden ? 'bg-primary/5' : ''}
										{isHidden && env.status !== 'correct' ? 'cursor-pointer' : ''}
										{rowIdx === data.expectedTable.length - 1 ? 'border-b-0' : ''}"
										data-testid="truth-table-cell-{rowIdx}-{colIdx}"
									>
										{#if isHidden}
											<button
												type="button"
												onclick={() => toggleCell(rowIdx, colIdx)}
												disabled={env.status === 'correct' || env.disabled}
												class="flex h-full min-h-11 w-full min-w-11 items-center justify-center px-3 py-2 text-base font-semibold transition-colors sm:px-4 sm:text-lg
													{getAnswer(rowIdx, colIdx) === null ? 'text-muted-foreground' : 'text-foreground'}
													{env.status !== 'correct' ? 'hover:bg-accent active:bg-accent/80' : ''}"
											>
												{getCellDisplay(getAnswer(rowIdx, colIdx))}
											</button>
										{:else}
											<span
												class="flex min-h-11 items-center justify-center px-3 py-2 text-base sm:px-4 sm:text-lg"
											>
												{row[colIdx] ? 'T' : 'F'}
											</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<p class="text-muted-foreground mt-3 text-center text-base">
			Tap cells to cycle through: ? → T → F
		</p>
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
