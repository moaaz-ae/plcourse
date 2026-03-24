<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<main class="flex h-full min-h-screen w-full flex-col items-center justify-center gap-3">
	<div class="flex flex-col gap-1.5">
		<h1 class="text-center text-xl">{page.status}</h1>
		<p class="text-center text-3xl">{page.error?.message}</p>
	</div>
	<Button href="/" variant="link">Go Home</Button>
</main>
