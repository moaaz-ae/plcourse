<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import { State } from '$lib/types';
	import { cn } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import TopicNode from '$lib/components/visual/topic-node.svelte';

	let { data }: { data: PageData } = $props();

	const nodeTypes = { topic: TopicNode };

	const DEPTH_SPACING = 310;
	const NODE_SPACING = 52;

	let nodes = $derived.by(() => {
		const byDepth = Map.groupBy(data.graph.nodes, (n) => n.depth);
		return data.graph.nodes.map((n) => {
			const siblings = byDepth.get(n.depth)!;
			const index = siblings.indexOf(n);
			const y = (index - (siblings.length - 1) / 2) * NODE_SPACING;
			return {
				id: n.id,
				type: 'topic' as const,
				position: { x: n.depth * DEPTH_SPACING, y },
				zIndex: 1,
				data: {
					id: n.id,
					title: n.title,
					depth: n.depth,
					isMilestone: n.isMilestone,
					state: data.topicStates[n.id]?.state
				}
			};
		});
	});

	let selectedNodeId = $state<string | null>(null);

	let edges = $derived.by(() =>
		data.graph.edges.map((e) => {
			const active =
				!!selectedNodeId && (e.source === selectedNodeId || e.target === selectedNodeId);
			return {
				id: `${e.source}-${e.target}`,
				source: e.source,
				target: e.target,
				animated: active,
				style: active
					? 'stroke: var(--color-primary); stroke-width: 2.5; stroke-opacity: 0.9;'
					: 'stroke: var(--color-border); stroke-width: 1.5; stroke-opacity: 0.8;'
			};
		})
	);

	let tooltipPos = $state<{ x: number; y: number } | null>(null);

	function onNodeClick({ event, node }: { event: MouseEvent | TouchEvent; node: { id: string } }) {
		selectedNodeId = node.id;
		const isMobile = window.innerWidth < 640;
		if (isMobile) {
			tooltipPos = {
				x: Math.max(8, window.innerWidth / 2 - 144),
				y: window.innerHeight - 290
			};
		} else {
			const clientX = 'clientX' in event ? event.clientX : (event.touches[0]?.clientX ?? 0);
			const clientY = 'clientY' in event ? event.clientY : (event.touches[0]?.clientY ?? 0);
			tooltipPos = {
				x: Math.min(Math.max(clientX + 16, 12), window.innerWidth - 308),
				y: Math.min(Math.max(clientY + 16, 12), window.innerHeight - 268)
			};
		}
	}

	function onMoveStart() {
		// Modal remains visible and sticky during navigation
	}

	function onPaneClick() {
		selectedNodeId = null;
		tooltipPos = null;
	}

	const selectedData = $derived(nodes.find((n) => n.id === selectedNodeId)?.data ?? null);
	const selectedState = $derived(selectedNodeId ? data.topicStates[selectedNodeId] : null);

	function statusLabel(topicId: string): string {
		const s = data.topicStates[topicId]?.state;
		if (s === State.Review) return 'Review';
		if (s === State.Learning) return 'Learning';
		if (s === State.Relearning) return 'Relearning';
		return 'New';
	}

	function formatDue(dueDate: string | Date): string {
		const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
		if (diff <= 0) return 'Due today';
		if (diff === 1) return 'Due tomorrow';
		if (diff <= 7) return `Due in ${diff} days`;
		return new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}

	let legendOpen = $state(false);
</script>

<svelte:head>
	<title>Progress Map | Introduction to Propositional Logic</title>
	<meta
		name="description"
		content="Visualize your topic mastery and spaced-repetition state across the logic curriculum."
	/>
</svelte:head>

<div class="bg-background flex h-dvh w-full flex-col overflow-hidden font-sans">
	<DashboardHeader
		user={data.user}
		actionHref={resolve('/learn')}
		actionLabel="Back to Learn"
		actionIconClass="icon-[mingcute--arrow-left-line]"
	/>

	<main class="relative flex-1 overflow-hidden">
		<button
			type="button"
			class="border-border bg-card text-foreground absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold shadow-xs sm:hidden"
			onclick={() => (legendOpen = !legendOpen)}
		>
			<div
				class={cn(
					'size-3.5',
					legendOpen ? 'icon-[mingcute--up-fill]' : 'icon-[mingcute--down-fill]'
				)}
			></div>
			Legend
		</button>

		<div
			class={cn(
				'border-border bg-card/95 absolute top-16 left-4 z-20 w-[calc(100%-2rem)] max-w-xs rounded-xl border p-4 shadow-xs backdrop-blur-sm sm:top-4 sm:w-60 sm:max-w-none',
				!legendOpen && 'hidden sm:block'
			)}
		>
			<p class="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
				Topic States
			</p>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs">Total Topics</span>
					<span class="text-foreground text-sm font-semibold">{data.stats.totalTopics}</span>
				</div>
				<div class="bg-border h-px"></div>
				<div class="grid grid-cols-2 gap-x-3 gap-y-2">
					<div class="flex items-center gap-2">
						<div class="size-2 rounded-full bg-emerald-400"></div>
						<span class="text-muted-foreground text-xs">Review</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-2 rounded-full bg-amber-400"></div>
						<span class="text-muted-foreground text-xs">Learning</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-2 rounded-full bg-orange-400"></div>
						<span class="text-muted-foreground text-xs">Relearning</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="bg-border size-2 rounded-full"></div>
						<span class="text-muted-foreground text-xs">New</span>
					</div>
				</div>
				<div class="bg-border h-px"></div>
				<div class="flex items-center gap-2">
					<div class="icon-[mingcute--star-fill] size-3 text-orange-400"></div>
					<span class="text-muted-foreground text-xs">Milestone topic</span>
				</div>
			</div>
		</div>

		<div class="absolute inset-0 z-10">
			<SvelteFlow
				bind:nodes
				bind:edges
				{nodeTypes}
				fitView
				minZoom={0.1}
				maxZoom={4}
				nodesConnectable={false}
				nodesDraggable={false}
				elementsSelectable={true}
				proOptions={{ hideAttribution: true }}
				onnodeclick={onNodeClick}
				onpaneclick={onPaneClick}
				onmovestart={onMoveStart}
			>
				<Background
					bgColor="var(--color-background)"
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
				/>
				<Controls position="bottom-right" showLock={false} />
				<div class="hidden sm:contents">
					<MiniMap position="bottom-left" />
				</div>
			</SvelteFlow>
		</div>

		{#if selectedData && tooltipPos}
			{@const label = statusLabel(selectedData.id)}
			<div
				class="border-border bg-card fixed z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border p-4 shadow-lg"
				style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;"
			>
				<div class="mb-3 flex items-start justify-between gap-3">
					<div class="flex min-w-0 flex-col gap-1">
						<h3 class="text-foreground text-sm font-semibold">{selectedData.title}</h3>
						<span
							class={cn(
								'inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium',
								label === 'Review' && 'bg-emerald-100 text-emerald-700',
								label === 'Learning' && 'bg-amber-100 text-amber-700',
								label === 'Relearning' && 'bg-orange-100 text-orange-700',
								label === 'New' && 'bg-muted text-muted-foreground'
							)}
						>
							<span
								class={cn(
									'size-3',
									label === 'Review' && 'icon-[mingcute--check-fill]',
									label === 'Learning' && 'icon-[mingcute--book-2-fill]',
									label === 'Relearning' && 'icon-[mingcute--refresh-2-fill]',
									label === 'New' && 'icon-[mingcute--time-fill]'
								)}
							></span>
							{label}
						</span>
					</div>
					<button
						type="button"
						class="border-border text-muted-foreground hover:bg-muted mt-0.5 flex shrink-0 items-center justify-center rounded-md border p-1 transition-colors"
						onclick={onPaneClick}
						aria-label="Close topic details"
					>
						<span class="icon-[mingcute--close-line] size-3.5"></span>
					</button>
				</div>

				{#if selectedState}
					<div class="border-border bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-3">
						<div>
							<p
								class="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase"
							>
								Stability
							</p>
							<p class="text-foreground text-sm font-semibold">
								{selectedState.stability.toFixed(1)}d
							</p>
						</div>
						<div>
							<p
								class="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase"
							>
								Difficulty
							</p>
							<p class="text-foreground text-sm font-semibold">
								{selectedState.difficulty.toFixed(2)}
							</p>
						</div>
						<div class="col-span-2">
							<p
								class="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-wide uppercase"
							>
								Next Review
							</p>
							<p
								class={cn(
									'text-sm font-semibold',
									new Date(selectedState.due_date) <= new Date()
										? 'text-amber-600'
										: 'text-foreground'
								)}
							>
								{formatDue(selectedState.due_date)}
							</p>
						</div>
					</div>
				{:else}
					<div class="border-border bg-muted/40 rounded-lg border p-3 text-center">
						<p class="text-muted-foreground text-xs">Not yet started</p>
					</div>
				{/if}

				<div class="text-muted-foreground mt-3 flex items-center gap-1.5 text-[10px]">
					<span class="icon-[mingcute--list-ordered-line] size-3"></span>
					<span>Depth {selectedData.depth}</span>
					{#if selectedData.isMilestone}
						<span>·</span>
						<span class="icon-[mingcute--star-fill] size-3 text-orange-400"></span>
						<span>Milestone</span>
					{/if}
				</div>
			</div>
		{/if}

		{#if data.user.isAnonymous}
			<div
				class="border-border bg-card/95 absolute bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border px-6 py-5 shadow-xs backdrop-blur-sm"
			>
				<div class="flex w-full flex-col items-center gap-4">
					<p class="text-foreground text-sm font-medium">
						You're not signed in. Sign in to keep your progress.
					</p>
					<div class="flex w-full flex-col gap-2">
						<Button
							size="lg"
							class="w-full"
							onclick={() =>
								authClient.signIn.social({ provider: 'google', callbackURL: '/learn' })}
						>
							<span class="icon-[mingcute--google-fill] mr-2 size-5"></span>
							Continue with Google
						</Button>
						<Button
							variant="secondary"
							size="lg"
							class="w-full"
							onclick={() =>
								authClient.signIn.social({ provider: 'github', callbackURL: '/learn' })}
						>
							<span class="icon-[mingcute--github-line] mr-2 size-5"></span>
							Continue with GitHub
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	:global(.svelte-flow__controls) {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 4px;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.07),
			0 1px 2px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	:global(.svelte-flow__controls-button) {
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--muted-foreground);
		transition:
			background 0.15s,
			color 0.15s;
	}

	:global(.svelte-flow__controls-button:hover) {
		background: var(--muted);
		color: var(--foreground);
	}

	:global(.svelte-flow__controls-button svg) {
		width: 16px;
		height: 16px;
	}

	:global(.svelte-flow__minimap) {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
	}
</style>
