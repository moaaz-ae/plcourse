<script lang="ts">
	import katex from 'katex';
	import { escapeHtml } from '$lib/renderer';

	let {
		content,
		class: className = '',
		displayMode = false
	}: {
		content: string;
		class?: string;
		displayMode?: boolean;
	} = $props();

	function needsKatex(text: string): boolean {
		if (/\\[a-zA-Z]+/.test(text)) return true;
		if (/(?<!\\)\$/.test(text)) return true;
		return false;
	}

	let html = $derived.by(() => {
		if (!content) return '';

		if (!needsKatex(content)) {
			return escapeHtml(content);
		}

		let latex = content.replace(/^\$+|\$+$/g, '').trim();

		try {
			return katex.renderToString(latex, {
				displayMode,
				throwOnError: false,
				strict: false
			});
		} catch {
			return `<span class="text-red-500">${escapeHtml(latex)}</span>`;
		}
	});
</script>

{#if displayMode}
	<div class={className} data-testid="latex-display">
		{@html html}
	</div>
{:else}
	<span class={className} data-testid="latex-inline">
		{@html html}
	</span>
{/if}
