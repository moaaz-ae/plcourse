<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { authClient } from '$lib/auth-client';
	import { page } from '$app/state';

	let isSigningIn = $state(false);
	let signingInProvider = $state<'google' | 'github' | null>(null);

	async function handleSocialSignIn(provider: 'google' | 'github') {
		isSigningIn = true;
		signingInProvider = provider;

		try {
			const redirectTo = page.url.searchParams.get('redirectTo') || '/learn';
			await authClient.signIn.social({
				provider,
				callbackURL: redirectTo
			});
		} catch (error) {
			console.error(error);
		} finally {
			isSigningIn = false;
			signingInProvider = null;
		}
	}
</script>

<svelte:head>
	<title>Sign In | Introduction to Propositional Logic</title>
	<meta
		name="description"
		content="Sign in to save your progress and continue learning propositional logic."
	/>
</svelte:head>

<div class="relative flex min-h-dvh w-full items-center justify-center p-4">
	<img
		src="/hero-bg.webp"
		alt="Authentication background"
		class="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
	/>
	<main
		class="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-stone-300/50 bg-stone-50 px-6 py-10 text-center text-stone-800 shadow-xs shadow-stone-900/10 sm:px-10"
	>
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-bold sm:text-3xl">Introduction to Propositional Logic</h1>
			<p class="text-lg font-medium text-stone-600 sm:text-xl">The fastest way to master logic.</p>
		</div>

		<div class="flex w-full flex-col gap-2">
			<Button
				size="lg"
				class="w-full"
				disabled={isSigningIn}
				onclick={() => handleSocialSignIn('google')}
			>
				{#if signingInProvider === 'google'}
					<span class="icon-[mingcute--loading-line] mr-2 size-6 animate-spin"></span>
				{:else}
					<span class="icon-[mingcute--google-fill] mr-2 size-6"></span>
				{/if}
				Continue with Google
			</Button>

			<Button
				variant="secondary"
				size="lg"
				class="w-full bg-stone-200/50 text-stone-800 hover:bg-stone-200/80 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/50"
				disabled={isSigningIn}
				onclick={() => handleSocialSignIn('github')}
			>
				{#if signingInProvider === 'github'}
					<span class="icon-[mingcute--loading-line] mr-2 size-6 animate-spin"></span>
				{:else}
					<span class="icon-[mingcute--github-line] mr-2 size-6"></span>
				{/if}
				Continue with GitHub
			</Button>
		</div>
		<p class="px-8 text-center text-sm font-medium text-stone-600">
			Asked if he wanted a vegan muffin, Descartes said, "I think not," and vanished. .
		</p>
	</main>
</div>
