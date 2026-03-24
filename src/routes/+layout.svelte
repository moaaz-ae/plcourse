<script lang="ts">
	import { dev } from '$app/environment';
	import '../app.css';
	import 'katex/dist/katex.min.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title>Introduction to Propositional Logic</title>
	<link rel="icon" href="/favicon.svg" />
	<meta name="theme-color" content="#ffffff" />

	<link rel="preconnect" href="https://analytics.moaaza.com" />
	<link
		rel="preload"
		href="/fonts/OpenRunde-Medium.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Introduction to Propositional Logic" />
	<meta
		property="og:description"
		content="Learn logical reasoning through adaptive practice. Covers 29 topics including arguments, validity, connectives, and truth tables, with spaced repetition."
	/>
	<meta property="og:image" content="/og-image.png" />
	<meta property="og:url" content="/" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Introduction to Propositional Logic" />
	<meta
		name="twitter:description"
		content="Adaptive tutoring for propositional logic across 29 topics."
	/>
	<meta name="twitter:image" content="/og-image.png" />

	{#if !dev}
		<script
			defer
			src="https://analytics.moaaza.com/script.js"
			data-website-id="9b3f259e-36ff-49c8-bb1e-cb890b953638"
		></script>
	{/if}
</svelte:head>

{@render children()}
