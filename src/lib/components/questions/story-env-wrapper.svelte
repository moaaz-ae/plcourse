<script lang="ts">
	import { setQuestionEnv, type QuestionEnv } from '$lib/state/session-context.svelte';
	import type { Snippet } from 'svelte';

	let {
		diagnostic = false,
		children
	}: {
		diagnostic?: boolean;
		children: Snippet;
	} = $props();

	let status = $state<'idle' | 'correct' | 'wrong'>('idle');
	let submissionCount = $state(0);
	let disabled = $state(false);

	const env: QuestionEnv = {
		get status() {
			return status;
		},
		get disabled() {
			return disabled;
		},
		get diagnostic() {
			return diagnostic;
		},
		get submissionCount() {
			return submissionCount;
		},
		onAnswer(correct: boolean) {
			disabled = true;
			setTimeout(() => {
				disabled = false;
				status = correct ? 'correct' : 'wrong';
				submissionCount++;
			}, 300);
		}
	};

	setQuestionEnv(env);
</script>

{@render children()}
