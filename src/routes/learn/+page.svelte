<script lang="ts">
	import type { PageData } from './$types';
	import LearnStatsSidebar from '$lib/components/learn-stats-sidebar.svelte';
	import LearnTaskList from '$lib/components/learn-task-list.svelte';
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Learn Dashboard | Introduction to Propositional Logic</title>
	<meta
		name="description"
		content="Your personalized learning dashboard for propositional logic practice and spaced repetition."
	/>
</svelte:head>

<div class="flex flex-col">
	<DashboardHeader
		user={data.user}
		actionHref={resolve('/visual')}
		actionLabel="Progress Map"
		actionIconClass="icon-[mingcute--department-line]"
	/>

	<main class="py-6 sm:py-10 lg:py-12">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h1 class="sr-only">Learn Dashboard</h1>
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<LearnStatsSidebar
					today={data.stats.today}
					progressPct={data.stats.progressPct}
					weeklyActivity={data.stats.weeklyActivity}
				/>

				<LearnTaskList
					userName={data.user?.name ?? null}
					tasks={data.tasks}
					isSessionComplete={data.session.isComplete}
				/>
			</div>
		</div>
	</main>
</div>
