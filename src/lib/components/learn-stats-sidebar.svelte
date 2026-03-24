<script lang="ts">
	interface Props {
		today: {
			completed: number;
			total: number;
			pct: number;
		};
		progressPct: number;
		weeklyActivity: Array<{
			day: string;
			count: number;
			heightPct: number;
		}>;
	}

	let { today, progressPct, weeklyActivity }: Props = $props();
</script>

<aside class="order-2 space-y-6 lg:order-1 lg:col-span-1">
	<div class="border-border bg-card rounded-xl border p-6">
		<p class="text-foreground text-lg font-semibold">Today's Progress</p>
		<p class="text-muted-foreground mt-1 text-sm">
			{#if today.pct === 100}
				All caught up!
			{:else}
				Keep up the great work!
			{/if}
		</p>
		<div class="bg-muted mt-4 flex h-2 items-center gap-2 overflow-hidden rounded-full">
			<div class="bg-primary h-full transition-all duration-500" style="width: {today.pct}%"></div>
		</div>
		<p class="text-muted-foreground mt-3 text-right text-sm font-medium">
			{today.completed} / {today.total} completed
		</p>
	</div>

	<div class="border-border bg-card rounded-xl border p-6">
		<p class="text-foreground text-lg font-semibold">Introduction to Propositional Logic</p>

		<div class="mt-4">
			<div class="mb-2 flex items-baseline justify-between">
				<p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Overall Progress
				</p>
				<p class="text-muted-foreground text-sm font-semibold">{progressPct}%</p>
			</div>
			<div class="bg-muted h-2 w-full rounded-full">
				<div
					class="bg-primary h-2 rounded-full transition-all duration-500"
					style="width: {progressPct}%"
				></div>
			</div>
		</div>

		<hr class="border-border my-6" />

		<div>
			<p class="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
				Weekly Activity
			</p>
			<div
				class="text-muted-foreground flex h-16 items-end justify-between gap-2 text-center text-xs sm:h-20"
			>
				{#each weeklyActivity as day, i (i)}
					<div class="flex h-full w-full flex-col items-center justify-end gap-1.5">
						<div class="group relative h-full w-full">
							<div
								class="bg-primary group-hover:bg-primary/80 absolute bottom-0 w-full rounded-t-md transition-all duration-300"
								style="height: {day.heightPct}%;"
								title="{day.count} items"
							></div>
						</div>
						<span>{day.day}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</aside>
