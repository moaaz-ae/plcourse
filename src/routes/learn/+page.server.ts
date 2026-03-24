import type { PageServerLoad, Actions } from './$types';
import { SchedulerService } from '$lib/server/services/scheduler.service';
import * as topicStateQ from '$lib/server/queries/topic-state.queries';
import * as learningLogQ from '$lib/server/queries/learning-log.queries';
import { getKnowledgeGraph } from '$lib/server/services/curriculum.service';
import { redirect } from '@sveltejs/kit';
import { State } from '$lib/types';
import { TASKS_PER_SESSION } from '$lib/constants';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MAX_CHART_ITEMS = 20;

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/auth');
	}

	const scheduler = new SchedulerService();

	const [topicStates, knowledgeGraph] = await Promise.all([
		topicStateQ.getAllStates(user.id),
		getKnowledgeGraph()
	]);

	if (topicStates.length === 0) {
		redirect(302, '/diagnostic');
	}

	const sessionStart = await scheduler.getOrCreateSession(user.id);

	const [dailyTasks, completedTasks, weeklyRaw] = await Promise.all([
		scheduler.getDailyTasks(topicStates, knowledgeGraph),
		learningLogQ.getCompletedTasksSince(user.id, sessionStart),
		learningLogQ.getWeeklyActivity(user.id)
	]);

	const { reviews, newTopics } = dailyTasks;
	const available: AvailableTask[] = [
		...reviews.map((id) => ({ id, type: 'review' as const })),
		...newTopics.map((id) => ({ id, type: 'new' as const }))
	];
	const completedTaskItems: CompletedTask[] = completedTasks.map((task) => ({
		id: task.topicId,
		type: task.type
	}));

	const weeklyActivity = buildWeeklyActivity(weeklyRaw);

	const tasks = buildSessionTasks(completedTaskItems, available, knowledgeGraph, topicStates);

	const masteredCount = topicStates.filter((s) => s.state === State.Review).length;
	const totalTopics = knowledgeGraph.topologicalOrder.length;

	const completedCount = Math.min(completedTaskItems.length, TASKS_PER_SESSION);
	const isSessionComplete = completedCount >= TASKS_PER_SESSION;

	return {
		tasks,
		stats: {
			progressPct: Math.round((masteredCount / totalTopics) * 100),
			today: {
				completed: completedCount,
				total: TASKS_PER_SESSION,
				pct: Math.round((completedCount / TASKS_PER_SESSION) * 100)
			},
			weeklyActivity
		},
		session: {
			isComplete: isSessionComplete
		},
		user: {
			name: user.name,
			email: user.email,
			image: user.image
		}
	};
};

export const actions: Actions = {
	newSession: async ({ locals }) => {
		if (!locals.user) {
			redirect(302, '/auth');
		}

		const scheduler = new SchedulerService();
		await scheduler.resetSession(locals.user.id);

		redirect(303, '/learn');
	}
};

interface SessionTask {
	id: string;
	title: string;
	type: 'review' | 'new' | 'locked';
	status: 'completed' | 'active' | 'locked';
}

interface AvailableTask {
	id: string;
	type: 'review' | 'new';
}

interface CompletedTask {
	id: string;
	type: 'review' | 'new';
}

function buildSessionTasks(
	completedTasks: CompletedTask[],
	available: AvailableTask[],
	knowledgeGraph: Awaited<ReturnType<typeof getKnowledgeGraph>>,
	allStates: { topic_id: string; state: State }[]
): SessionTask[] {
	const tasks: SessionTask[] = [];
	const usedIds = new Set<string>();
	const stateMap = new Map(allStates.map((s) => [s.topic_id, s.state]));

	const completedToShow = completedTasks.slice(0, TASKS_PER_SESSION);
	for (const completed of completedToShow) {
		const topic = knowledgeGraph.topics[completed.id];
		usedIds.add(completed.id);
		tasks.push({
			id: completed.id,
			title: topic?.title || 'Unknown Topic',
			type: completed.type,
			status: 'completed'
		});
	}

	if (tasks.length >= TASKS_PER_SESSION) {
		return tasks;
	}

	const remainingSlots = TASKS_PER_SESSION - tasks.length;
	let activeAdded = 0;
	for (const availableTask of available) {
		if (activeAdded >= remainingSlots) break;
		const topicId = availableTask.id;
		if (usedIds.has(topicId)) continue;

		const topic = knowledgeGraph.topics[topicId];
		usedIds.add(topicId);
		tasks.push({
			id: topicId,
			title: topic?.title || 'Unknown Topic',
			type: availableTask.type,
			status: 'active'
		});
		activeAdded++;
	}

	const slotsStillNeeded = TASKS_PER_SESSION - tasks.length;
	if (slotsStillNeeded > 0) {
		const fillerTopics = getLockedFillers(knowledgeGraph, usedIds, slotsStillNeeded, stateMap);
		for (const topicId of fillerTopics) {
			const topic = knowledgeGraph.topics[topicId];
			tasks.push({
				id: topicId,
				title: topic?.title || 'Unknown Topic',
				type: 'locked',
				status: 'locked'
			});
		}
	}

	return tasks;
}

function getLockedFillers(
	knowledgeGraph: Awaited<ReturnType<typeof getKnowledgeGraph>>,
	excludeIds: Set<string>,
	count: number,
	stateMap: Map<string, State>
): string[] {
	const fillers: string[] = [];

	for (const topicId of knowledgeGraph.topologicalOrder) {
		if (excludeIds.has(topicId)) continue;
		const state = stateMap.get(topicId);
		if (state) continue;
		fillers.push(topicId);
		if (fillers.length >= count) break;
	}

	return fillers;
}

function buildWeeklyActivity(weeklyRaw: { day: Date; count: number }[]) {
	const today = new Date();
	const activity = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		const found = weeklyRaw.find((r) => r.day.toISOString().split('T')[0] === dateStr);
		const count = found?.count ?? 0;

		activity.push({
			day: DAY_LABELS[date.getDay()],
			count,
			heightPct: Math.min(100, (count / MAX_CHART_ITEMS) * 100)
		});
	}

	return activity;
}
