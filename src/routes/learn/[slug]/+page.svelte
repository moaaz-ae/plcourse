<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import LearnPhase from '$lib/components/learn/learn-phase.svelte';
	import TestPhase from '$lib/components/learn/test-phase.svelte';

	let { data }: { data: PageData } = $props();

	let phaseOverride = $state<'practice' | 'test' | null>(null);
	let phase = $derived(phaseOverride ?? (data.sessionType === 'review' ? 'test' : 'practice'));

	function startTestPhase() {
		phaseOverride = 'test';
	}

	// Allow e2e tests to skip directly to the test phase via ?skipPractice=1
	onMount(() => {
		if (page.url.searchParams.get('skipPractice') === '1' && phase === 'practice') {
			startTestPhase();
		}
	});
</script>

<svelte:head>
	<title
		>{data.topic ? `${data.topic.title} | Learn` : 'Lesson Session'} | Introduction to Propositional Logic</title
	>
	<meta
		name="description"
		content="Interactive lesson and review session for propositional logic."
	/>
</svelte:head>

<div
	class="bg-background flex h-full min-h-dvh flex-col items-center justify-center py-16"
	data-testid="lesson-page"
	data-topic-id={data.topicId}
	data-session-type={data.sessionType}
	data-phase={phase}
>
	<div
		class="bg-background/80 border-border fixed top-0 right-0 left-0 z-10 border-b p-3 backdrop-blur-sm sm:absolute sm:top-6 sm:right-auto sm:left-6 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
	>
		<Button href="/learn" variant="ghost" class="text-foreground/75" data-testid="exit-button">
			<span class="icon-[mingcute--arrow-left-line] size-4"></span>
			Exit
		</Button>
	</div>

	{#key data.topicId}
		<div
			class="mx-auto w-full max-w-4xl px-4 pt-14 sm:px-6 sm:pt-0 lg:px-8"
			aria-label="{data.sessionType === 'learn' ? 'Lesson' : 'Review'} session"
		>
			{#if data.sessionType === 'learn' && phase === 'practice'}
				<LearnPhase topic={data.topic} slides={data.topic.slides} onStartTest={startTestPhase} />
			{:else}
				<TestPhase topic={data.topic} mode={data.sessionType} />
			{/if}
		</div>
	{/key}
</div>
