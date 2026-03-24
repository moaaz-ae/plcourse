<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Latex from '$lib/components/ui/latex.svelte';

	let {
		variables = [],
		symbols = ['\\land', '\\lor', '\\to', '\\leftrightarrow', '\\neg', '(', ')'],
		onKeyPress,
		onBackspace,
		onClear,
		disabled = false
	}: {
		variables?: string[];
		symbols?: string[];
		onKeyPress: (symbol: string) => void;
		onBackspace: () => void;
		onClear?: () => void;
		disabled?: boolean;
	} = $props();
</script>

<div class="space-y-3">
	{#if variables.length > 0}
		<div class="flex flex-wrap justify-center gap-2">
			{#each variables as variable (variable)}
				{@const plainVar = variable.replace(/\$/g, '')}
				{@const displayVar = `$${plainVar}$`}
				<Button
					type="button"
					variant="outline"
					onclick={() => onKeyPress(plainVar)}
					{disabled}
					class="min-h-12 min-w-12 rounded-md border-blue-200 bg-blue-50 px-2 text-lg font-bold text-blue-700
						hover:bg-blue-100 hover:text-blue-800 sm:px-4"
					data-testid="symbol-{variable}"
				>
					<Latex content={displayVar} />
				</Button>
			{/each}
		</div>
	{/if}

	<div class="flex flex-wrap justify-center gap-2">
		{#each symbols as symbol (symbol)}
			<Button
				type="button"
				variant="outline"
				onclick={() => onKeyPress(symbol)}
				{disabled}
				class="min-h-12 min-w-12 rounded-md border-purple-200 bg-purple-50 px-2 text-lg font-bold text-purple-700
					hover:bg-purple-100 hover:text-purple-800 sm:px-4"
				data-testid="symbol-{symbol}"
			>
				<Latex content={symbol} />
			</Button>
		{/each}
	</div>

	<div class="flex justify-center gap-2">
		<Button
			type="button"
			variant="outline"
			onclick={onBackspace}
			{disabled}
			class="min-h-12 rounded-md border-gray-200 bg-gray-100 px-3 font-semibold text-gray-700
				hover:bg-gray-200 hover:text-gray-900 sm:px-4"
			data-testid="backspace-button"
		>
			<span class="icon-[mingcute--delete-back-line] size-5"></span>
			<span>Backspace</span>
		</Button>
		{#if onClear}
			<Button
				type="button"
				variant="outline"
				onclick={onClear}
				{disabled}
				class="min-h-12 rounded-md border-gray-200 bg-gray-100 px-3 font-semibold text-gray-700
					hover:bg-gray-200 hover:text-gray-900 sm:px-4"
				data-testid="clear-button"
			>
				<span class="icon-[mingcute--eraser-line] size-5"></span>
				<span>Clear</span>
			</Button>
		{/if}
	</div>
</div>
