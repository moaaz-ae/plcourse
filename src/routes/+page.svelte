<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import LearnStatsSidebar from '$lib/components/learn-stats-sidebar.svelte';
	import LearnTaskList from '$lib/components/learn-task-list.svelte';
	import { page } from '$app/state';

	const year = new Date().getFullYear();
	const canonicalUrl = $derived(page.url.href);
	const siteUrl = $derived(page.url.origin);
	const structuredData = $derived(
		JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'Introduction to Propositional Logic',
				url: siteUrl
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Course',
				name: 'Introduction to Propositional Logic',
				description:
					'An adaptive tutoring platform for propositional logic with deliberate practice and spaced repetition.',
				provider: {
					'@type': 'Organization',
					name: 'Introduction to Propositional Logic',
					url: siteUrl
				},
				url: canonicalUrl
			}
		])
	);
	const structuredDataTag = $derived(
		`<script type="application/ld+json">${structuredData}</scr` + `ipt>`
	);
	const demoWeeklyActivity = [
		{ day: 'M', count: 8, heightPct: 40 },
		{ day: 'T', count: 12, heightPct: 60 },
		{ day: 'W', count: 16, heightPct: 80 },
		{ day: 'T', count: 10, heightPct: 50 },
		{ day: 'F', count: 14, heightPct: 70 },
		{ day: 'S', count: 6, heightPct: 30 },
		{ day: 'S', count: 9, heightPct: 45 }
	];
	const demoTasks = [
		{
			id: 'lesson-1',
			title: 'Arguments and Validity',
			type: 'review' as const,
			status: 'active' as const
		},
		{
			id: 'lesson-2',
			title: 'Symbolization Basics',
			type: 'new' as const,
			status: 'active' as const
		},
		{
			id: 'lesson-3',
			title: 'Truth Tables: Foundations',
			type: 'new' as const,
			status: 'locked' as const
		}
	];
	let heroActionsEl: HTMLDivElement | null = null;
	let showFloatingCta = $state(false);

	onMount(() => {
		if (!heroActionsEl) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				showFloatingCta = !entry.isIntersecting;
			},
			{ threshold: 0.2 }
		);

		observer.observe(heroActionsEl);

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Introduction to Propositional Logic | Adaptive Logic Tutor</title>
	<meta
		name="description"
		content="Master propositional logic in 29 lessons with adaptive practice, instant feedback, and spaced repetition."
	/>
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:url" content={canonicalUrl} />
	{@html structuredDataTag}
</svelte:head>

<main class="bg-background flex min-h-screen w-full flex-col gap-64 pb-48 font-sans sm:pb-40">
	<section class="flex flex-col gap-32">
		<header class="mx-auto flex max-w-2xl flex-col items-center px-6 pt-40">
			<h1
				class="text-foreground text-center text-4xl leading-tight font-semibold tracking-tight md:text-5xl"
			>
				An Introduction to Propositional Logic
			</h1>
			<p class="text-foreground/80 mt-6 max-w-lg text-center text-lg leading-relaxed font-medium">
				Learn by solving problems. Each session gives you focused practice, instant feedback, and
				spaced repetition built into every review.
			</p>
			<div bind:this={heroActionsEl} class="mt-10 flex flex-col items-center gap-4">
				<div
					class="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center"
				>
					<Button size="lg" href="/diagnostic" class="w-full sm:w-auto">Take the Diagnostic</Button>
					<Button size="lg" variant="outline" href="/auth" class="w-full sm:w-auto">Sign In</Button>
				</div>
				<span class="text-foreground text-sm">Free and open source</span>
			</div>
		</header>

		<section class="w-full" aria-label="Interactive demo">
			<article class="relative w-full overflow-hidden border sm:aspect-video">
				<img
					src="/hero-bg.webp"
					alt=""
					aria-hidden="true"
					class="absolute inset-0 h-full w-full object-cover opacity-80"
					fetchpriority="high"
					decoding="async"
					width="1920"
					height="1080"
				/>
				<div class="bg-background/35 absolute inset-0 backdrop-blur-[1px]"></div>
				<div class="relative px-2 py-3 sm:px-12 sm:py-6 md:px-20 md:py-8 lg:px-28 lg:py-12">
					<div
						class="border-border bg-background/95 pointer-events-none flex min-h-75 w-full flex-col overflow-hidden rounded-2xl border shadow-lg sm:aspect-video sm:min-h-0"
					>
						<header class="border-border bg-background/90 border-b">
							<div class="mx-auto max-w-7xl px-4 sm:px-18 lg:px-22">
								<div class="flex h-16 items-center justify-between">
									<div class="flex items-center gap-3 text-sm">
										<span class="text-foreground hidden font-bold sm:block"
											>Introduction to Propositional Logic</span
										>
										<span class="text-foreground font-bold sm:hidden">Propositional Logic</span>
									</div>
									<div class="flex items-center gap-2 sm:gap-4">
										<Button
											variant="ghost"
											size="sm"
											class="flex items-center gap-2"
											aria-label="View progress map"
										>
											<span class="icon-[mingcute--department-line] size-4" aria-hidden="true"
											></span>
											<span class="hidden sm:inline">Progress Map</span>
										</Button>
										<button
											type="button"
											class="bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-full p-1.5 transition-colors"
											aria-label="Open profile menu"
										>
											<img
												src="/hero-bg-user.webp"
												alt=""
												width="28"
												height="28"
												class="ring-background h-7 w-7 rounded-full object-cover ring-2"
												loading="lazy"
												decoding="async"
												aria-hidden="true"
											/>
											<div
												class="icon-[mingcute--down-fill] text-muted-foreground mr-1 size-4"
											></div>
										</button>
									</div>
								</div>
							</div>
						</header>
						<div class="flex-1 overflow-auto py-6 sm:py-10">
							<div class="mx-auto max-w-7xl px-4 sm:px-18 lg:px-22">
								<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
									<LearnStatsSidebar
										today={{ completed: 14, total: 20, pct: 70 }}
										progressPct={32}
										weeklyActivity={demoWeeklyActivity}
									/>
									<LearnTaskList
										userName="Sarah Demo"
										tasks={demoTasks}
										isSessionComplete={false}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</section>
	</section>

	<section class="flex flex-col gap-32 px-6">
		<h2 class="sr-only">How it works</h2>

		<article
			class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:items-center md:gap-16"
		>
			<div class="flex flex-1 flex-col justify-center gap-4">
				<h3 class="text-foreground text-2xl leading-tight font-semibold md:text-3xl">
					Take a diagnostic
				</h3>
				<p class="text-foreground/80 text-lg leading-7">
					A short adaptive test maps your current level and picks the first lessons that match what
					you need now.
				</p>
			</div>
			<div
				aria-label="Diagnostic interface preview"
				role="img"
				class="border-border bg-card pointer-events-none w-full flex-1 rounded-xl border shadow-xs"
			>
				<div class="flex flex-col p-6">
					<p class="text-foreground mb-4 text-[15px] leading-relaxed">
						If all premises are true and the conclusion is false, the argument is:
					</p>
					<div class="flex flex-col gap-2">
						<div
							class="border-primary bg-primary/5 ring-primary/30 flex items-center gap-3 rounded-lg border px-4 py-3 ring-2"
						>
							<div
								class="border-primary bg-primary flex size-4 shrink-0 items-center justify-center rounded-full border-2"
							>
								<div class="size-1.5 rounded-full bg-white"></div>
							</div>
							<span class="text-foreground text-sm font-medium">Invalid</span>
						</div>
						<div
							class="border-border bg-background flex items-center gap-3 rounded-lg border px-4 py-3"
						>
							<div class="border-muted-foreground/40 size-4 shrink-0 rounded-full border-2"></div>
							<span class="text-foreground text-sm">Valid</span>
						</div>
					</div>
					<div class="mt-5 flex items-center gap-3">
						<Button size="sm">Check</Button>
						<span class="text-muted-foreground text-xs">Question 3 of ~10</span>
					</div>
				</div>
			</div>
		</article>

		<article
			class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 md:flex-row-reverse md:items-center md:gap-16"
		>
			<div class="flex flex-1 flex-col justify-center gap-4">
				<h3 class="text-foreground text-2xl leading-tight font-semibold md:text-3xl">
					Practice with feedback
				</h3>
				<p class="text-foreground/80 text-lg leading-7">
					Work through focused exercises with immediate corrections, so each mistake becomes a
					concrete next step.
				</p>
			</div>
			<div
				aria-label="Practice interface preview"
				role="img"
				class="border-border bg-card pointer-events-none w-full flex-1 rounded-xl border shadow-xs"
			>
				<div class="flex flex-col p-6">
					<p class="text-foreground mb-4 text-[15px]">
						Complete the truth table for <span class="font-semibold">P ∧ Q</span>
					</p>
					<div class="overflow-hidden rounded-lg border">
						<table class="w-full text-center text-sm">
							<thead>
								<tr class="bg-muted/50">
									<th class="px-4 py-2.5 font-medium">P</th>
									<th class="px-4 py-2.5 font-medium">Q</th>
									<th class="bg-primary/8 px-4 py-2.5 font-semibold">P ∧ Q</th>
								</tr>
							</thead>
							<tbody class="text-foreground/90">
								<tr class="border-t">
									<td class="px-4 py-2.5">T</td>
									<td class="px-4 py-2.5">T</td>
									<td class="bg-primary/5 px-4 py-2.5 font-semibold">T</td>
								</tr>
								<tr class="border-t">
									<td class="px-4 py-2.5">T</td>
									<td class="px-4 py-2.5">F</td>
									<td class="bg-emerald-500/10 px-4 py-2.5">
										<span class="font-semibold text-emerald-700">F</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="mt-5 flex items-center gap-3">
						<Button size="sm" disabled>Check</Button>
						<span class="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
							<span class="icon-[mingcute--check-circle-fill] size-4"></span>
							Correct
						</span>
					</div>
				</div>
			</div>
		</article>

		<article
			class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:items-center md:gap-16"
		>
			<div class="flex flex-1 flex-col justify-center gap-4">
				<h3 class="text-foreground text-2xl leading-tight font-semibold md:text-3xl">
					Review at the right time
				</h3>
				<p class="text-foreground/80 text-lg leading-7">
					Return to earlier questions on a schedule based on your recall, so key ideas stay active
					and usable over time.
				</p>
			</div>
			<div
				aria-label="Review queue preview"
				role="img"
				class="border-border bg-card pointer-events-none w-full flex-1 rounded-xl border shadow-xs"
			>
				<div class="flex flex-col p-6">
					<div class="flex flex-col gap-2">
						<div
							class="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-4 py-3"
						>
							<div class="flex items-center gap-3">
								<div
									class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full"
								>
									<span class="icon-[mingcute--refresh-2-line] size-4"></span>
								</div>
								<div>
									<p class="text-foreground text-sm font-medium">DeMorgan Equivalences</p>
									<p class="text-muted-foreground text-xs">Review</p>
								</div>
							</div>
							<span class="text-foreground text-xs font-semibold">Due now</span>
						</div>
						<div
							class="bg-background flex items-center justify-between rounded-lg border px-4 py-3"
						>
							<div class="flex items-center gap-3">
								<div
									class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full"
								>
									<span class="icon-[mingcute--refresh-2-line] size-4"></span>
								</div>
								<div>
									<p class="text-foreground text-sm font-medium">Material Conditional</p>
									<p class="text-muted-foreground text-xs">Review</p>
								</div>
							</div>
							<span class="text-muted-foreground text-xs">Due in 4h</span>
						</div>
						<div
							class="bg-background flex items-center justify-between rounded-lg border px-4 py-3"
						>
							<div class="flex items-center gap-3">
								<div
									class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full"
								>
									<span class="icon-[mingcute--book-2-line] size-4"></span>
								</div>
								<div>
									<p class="text-foreground text-sm font-medium">Biconditional Introduction</p>
									<p class="text-muted-foreground text-xs">New lesson</p>
								</div>
							</div>
							<span class="text-muted-foreground text-xs">Tomorrow</span>
						</div>
					</div>
				</div>
			</div>
		</article>
	</section>

	<section class="mx-auto w-full max-w-3xl px-6">
		<h2 class="text-foreground mb-8 text-2xl leading-tight font-semibold md:text-3xl">
			Frequently asked questions
		</h2>
		<Accordion.Root type="single" value="item-1">
			<Accordion.Item value="item-1">
				<Accordion.Trigger>How long does the diagnostic take?</Accordion.Trigger>
				<Accordion.Content class="text-foreground/80">
					Most people finish in about 10 minutes. You can stop and continue later.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger>Do I need prior logic experience?</Accordion.Trigger>
				<Accordion.Content class="text-foreground/80">
					No. The course starts from first principles and adapts to your current level.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-3">
				<Accordion.Trigger>How much time should I study each day?</Accordion.Trigger>
				<Accordion.Content class="text-foreground/80">
					Start with 20 to 30 minutes. Consistency matters more than long sessions.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-4">
				<Accordion.Trigger>Is this free to use?</Accordion.Trigger>
				<Accordion.Content class="text-foreground/80">
					Yes. The project is free and open source under the MIT license.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-5">
				<Accordion.Trigger>Do I need an account to start?</Accordion.Trigger>
				<Accordion.Content class="text-foreground/80">
					You can take the diagnostic first. Create an account when you want to save progress.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		<footer class="border-border/70 mt-10 border-t pt-6 pb-2">
			<p class="text-foreground/70 text-center text-base">
				© {year} Introduction to Propositional Logic · MIT License
			</p>
			<p class="mt-2 flex items-center justify-center gap-4 text-base font-medium">
				<a
					href="https://github.com/moaaz-ae/plcourse"
					class="text-foreground/70 hover:text-foreground transition-colors"
					target="_blank"
					rel="noopener"
				>
					GitHub
				</a>
				<a
					href="https://moaaza.com"
					class="text-foreground/70 hover:text-foreground transition-colors"
					target="_blank"
					rel="noopener"
				>
					Moaaz
				</a>
			</p>
		</footer>
	</section>

	<aside
		aria-label="Quick start actions"
		class={`border-border bg-background fixed right-0 bottom-6 left-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border px-6 py-5 shadow-xs transition-all duration-150 ease-in sm:px-7 sm:py-5 ${
			showFloatingCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
		}`}
	>
		<div
			class="flex w-full flex-col items-start gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex max-w-2xl flex-col gap-0.5">
				<p class="text-foreground text-base leading-tight font-semibold sm:text-xl">
					Start learning propositional logic today
				</p>
				<p class="text-muted-foreground hidden text-sm sm:block sm:text-base">
					Take a short diagnostic and get your first lesson.
				</p>
			</div>
			<div class="flex w-full flex-col items-stretch gap-1.5 sm:gap-2 md:w-auto md:min-w-72">
				<Button href="/diagnostic">Take the Diagnostic</Button>
				<Button variant="outline" href="/auth">Sign In</Button>
			</div>
		</div>
	</aside>
</main>
