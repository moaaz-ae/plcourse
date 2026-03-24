<script lang="ts">
	type LessonStatus = 'completed' | 'active' | 'locked';

	interface Props {
		id?: string;
		title: string;
		status: LessonStatus;
		href: string;
		type?: 'review' | 'new';
	}

	let { id, title, status, href, type }: Props = $props();
</script>

{#if status === 'completed'}
	<div
		class="border-border bg-card rounded-lg border p-4"
		data-testid="lesson-item"
		data-lesson-id={id}
		data-lesson-status="completed"
		data-lesson-type={type}
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 text-white"
				>
					<span class="icon-[mingcute--check-fill] size-3.5"></span>
				</div>
				<h3 class="text-foreground font-medium">{title}</h3>
			</div>
		</div>
	</div>
{:else if status === 'active'}
	<a
		{href}
		class="border-primary bg-card block cursor-pointer overflow-hidden rounded-lg border-2"
		data-testid="lesson-item"
		data-lesson-id={id}
		data-lesson-status="active"
		data-lesson-type={type}
	>
		<div class="p-4">
			<div class="flex items-center justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-4">
						<div class="icon-[mingcute--play-circle-fill] text-primary h-6 w-6 shrink-0"></div>
						<h3 class="text-foreground font-semibold">{title}</h3>
					</div>
					{#if type === 'review'}
						<div
							class="mt-1 ml-10 flex items-center gap-1 text-xs text-blue-600"
							data-testid="lesson-badge-review"
						>
							<span class="icon-[mingcute--refresh-2-line]"></span>
							<span>Review</span>
						</div>
					{:else if type === 'new'}
						<div
							class="mt-1 ml-10 flex items-center gap-1 text-xs text-green-600"
							data-testid="lesson-badge-new"
						>
							<span class="icon-[mingcute--sparkles-2-fill]"></span>
							<span>New Lesson</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="bg-primary/10 px-4 py-2.5 sm:py-3">
			<div class="text-primary flex items-center justify-between text-xs font-semibold sm:text-sm">
				<span>Start Lesson</span>
				<div class="icon-[mingcute--arrow-right-line] size-4"></div>
			</div>
		</div>
	</a>
{:else}
	<div
		class="border-border bg-card rounded-lg border p-4"
		data-testid="lesson-item"
		data-lesson-id={id}
		data-lesson-status="locked"
		data-lesson-type={type}
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div
					class="border-muted-foreground/50 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
				>
					<span class="icon-[mingcute--lock-fill] size-3"></span>
				</div>
				<h3 class="text-muted-foreground font-medium">{title}</h3>
			</div>
		</div>
	</div>
{/if}
