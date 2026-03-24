<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LessonItem from './lesson-item.svelte';

	interface Task {
		id: string;
		title: string;
		type: 'review' | 'new' | 'locked';
		status: 'completed' | 'active' | 'locked';
	}

	interface Props {
		userName: string | null;
		tasks: Task[];
		isSessionComplete: boolean;
	}

	let { userName, tasks, isSessionComplete }: Props = $props();

	const firstName = $derived(userName?.split(' ')[0] || 'there');
</script>

<section class="order-1 lg:order-2 lg:col-span-2">
	<h2 class="text-foreground mb-2 text-2xl font-bold">
		Welcome back, {firstName}!
	</h2>
	<p class="text-muted-foreground mb-8 text-lg">Here is your learning path for today.</p>

	<div class="space-y-3">
		{#each tasks as task (task.id)}
			<LessonItem
				id={task.id}
				title={task.title}
				status={task.status}
				href={task.status === 'active' ? `/learn/${task.id}` : ''}
				type={task.type === 'locked' ? undefined : task.type}
			/>
		{/each}

		{#if isSessionComplete}
			<div class="border-border bg-card rounded-xl border p-8 text-center">
				<div class="mb-4 text-6xl">🎉</div>
				<h3 class="text-foreground mb-2 text-2xl font-bold">Session Complete!</h3>
				<p class="text-muted-foreground mb-6">Great work! You've finished your learning session.</p>
				<form method="POST" action="?/newSession">
					<Button type="submit" size="lg" class="gap-2">
						<span class="icon-[mingcute--rocket-line] size-5"></span>
						Continue Learning?
					</Button>
				</form>
			</div>
		{/if}

		{#if tasks.length === 0 && !isSessionComplete}
			<div class="px-4 py-16 text-center">
				<div class="mb-4 text-6xl">🎉</div>
				<h3 class="text-foreground mb-2 text-2xl font-bold">You're all caught up!</h3>
				<p class="text-muted-foreground">No reviews or new lessons due right now. Great work!</p>
			</div>
		{/if}
	</div>
</section>
