<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let {
		error,
		onRetry
	}: {
		error: Error | string;
		onRetry?: () => void;
	} = $props();

	let errorMessage = $derived(typeof error === 'string' ? error : error.message);
</script>

<div
	class="flex flex-col items-center justify-center gap-4 p-8 text-center"
	role="alert"
	aria-live="assertive"
>
	<div class="bg-muted flex size-12 items-center justify-center rounded-full">
		<span class="icon-[mingcute--close-circle-line] text-muted-foreground size-6" aria-hidden="true"
		></span>
	</div>

	<div class="space-y-2">
		<h2 class="text-foreground text-lg font-semibold">Something went wrong</h2>
		<p class="text-muted-foreground text-sm">{errorMessage}</p>
	</div>

	{#if onRetry}
		<Button variant="outline" onclick={onRetry} aria-label="Try again">
			<span class="icon-[mingcute--refresh-2-line] size-4" aria-hidden="true"></span>
			Try Again
		</Button>
	{/if}
</div>
