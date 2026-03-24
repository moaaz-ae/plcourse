<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type DashboardUser = {
		name?: string | null;
		email?: string | null;
		image?: string | null;
		isAnonymous?: boolean | null;
	};

	let {
		user = null,
		actionHref,
		actionLabel,
		actionIconClass = ''
	}: {
		user?: DashboardUser | null;
		actionHref: string;
		actionLabel: string;
		actionIconClass?: string;
	} = $props();

	const isAnonymous = $derived(user?.isAnonymous === true);

	const userInitials = $derived(
		user?.name
			?.split(' ')
			.map((name) => name[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U'
	);

	async function handleSignOut() {
		await authClient.signOut();
		goto(resolve('/auth'));
	}
</script>

<header class="border-border bg-background/80 sticky top-0 z-20 shrink-0 border-b backdrop-blur-sm">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-3 text-sm">
				<a href={resolve('/learn')} class="text-foreground hidden font-bold sm:block">
					Introduction to Propositional Logic
				</a>
				<a href={resolve('/learn')} class="text-foreground font-bold sm:hidden"
					>Propositional Logic</a
				>
			</div>

			<div class="flex items-center gap-2 sm:gap-4">
				<Button href={actionHref} variant="ghost" size="sm" class="flex items-center gap-2">
					{#if actionIconClass}
						<span class={`${actionIconClass} size-4`}></span>
					{/if}
					<span class="hidden sm:inline">{actionLabel}</span>
				</Button>

				{#if isAnonymous}
					<Button href={resolve('/auth')} variant="ghost" size="sm">Sign in</Button>
				{:else if user}
					<div class="relative">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="bg-muted hover:bg-muted/80 flex cursor-pointer items-center gap-2 rounded-full p-1.5 transition-colors"
							>
								{#if user.image}
									<img
										src={user.image}
										alt={user.name || 'User avatar'}
										class="ring-background flex h-7 w-7 rounded-full object-cover ring-2"
									/>
								{:else}
									<div
										class="bg-muted-foreground/20 text-muted-foreground ring-background flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-2"
									>
										{userInitials}
									</div>
								{/if}
								<div class="icon-[mingcute--down-fill] text-muted-foreground mr-1 size-4"></div>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56" align="end">
								<DropdownMenu.Label class="font-normal">
									<p class="text-sm font-medium">{user.name || 'User'}</p>
									<p class="text-muted-foreground truncate text-xs">{user.email || ''}</p>
								</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item
									onclick={handleSignOut}
									class="text-rose-500 focus:text-rose-600"
								>
									<span class="icon-[mingcute--exit-line] size-4"></span>
									Log out
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
