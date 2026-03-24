import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getTopic, getKnowledgeGraph } from '$lib/server/services/curriculum.service';
import * as topicStateQ from '$lib/server/queries/topic-state.queries';
import { SchedulerService } from '$lib/server/services/scheduler.service';
import { State, Rating, type Grade, type KnowledgeGraph, type Topic } from '$lib/types';
import type { TopicState } from '$lib/server/db/types';

function isValidGrade(value: number): value is Grade {
	return Number.isInteger(value) && value >= Rating.Again && value <= Rating.Easy;
}

function getPositiveWeightDependents(topicId: string, graph: KnowledgeGraph): string[] {
	const dependents: string[] = [];

	for (const candidateId of graph.topologicalOrder) {
		const prereqs = graph.topics[candidateId]?.prerequisites ?? [];
		if (prereqs.some((prereq) => prereq.id === topicId && prereq.weight > 0)) {
			dependents.push(candidateId);
		}
	}

	return dependents;
}

function isTopicActiveForCompletion(
	topicId: string,
	topic: Topic,
	graph: KnowledgeGraph,
	stateMap: Map<string, TopicState>,
	now: Date
): boolean {
	const currentState = stateMap.get(topicId);

	const isDueForReview =
		!!currentState && currentState.state !== State.New && new Date(currentState.due_date) <= now;
	if (isDueForReview) {
		const prereqBlocked = topic.prerequisites.some((prereq) => {
			const prereqState = stateMap.get(prereq.id);
			return prereqState?.state === State.Relearning;
		});
		if (prereqBlocked) {
			return false;
		}

		const dependentIds = getPositiveWeightDependents(topicId, graph);
		const hasDueDependent = dependentIds.some((dependentId) => {
			const dependentTopic = graph.topics[dependentId];
			const dependentState = stateMap.get(dependentId);
			if (!dependentTopic || !dependentState) return false;
			if (dependentState.state === State.New) return false;
			if (new Date(dependentState.due_date) > now) return false;

			return !dependentTopic.prerequisites.some((prereq) => {
				const prereqState = stateMap.get(prereq.id);
				return prereqState?.state === State.Relearning;
			});
		});

		return !hasDueDependent;
	}

	const isNew = !currentState || currentState.state === State.New;
	if (!isNew) return false;

	return topic.prerequisites.every((prereq) => {
		const prereqState = stateMap.get(prereq.id);
		return prereqState?.state === State.Review;
	});
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/auth');
	}

	const topicId = params.slug;
	const topic = await getTopic(topicId);

	if (!topic) {
		error(404, 'Topic not found');
	}

	const neededIds = [...topic.prerequisites.map((p) => p.id), topicId];
	const states = await topicStateQ.getStatesByTopicIds(user.id, neededIds);
	const stateMap = new Map(states.map((s) => [s.topic_id, s]));

	if (topic.prerequisites.length > 0) {
		const locked = topic.prerequisites.some((p) => {
			const pState = stateMap.get(p.id);
			return !pState || pState.state === State.New;
		});

		if (locked) {
			error(403, 'This topic is locked. Complete the prerequisites first.');
		}
	}

	const currentState = stateMap.get(topicId);

	// New/Relearning → full lesson (slides + test), Learning/Review → quiz only
	let sessionType: 'learn' | 'review' = 'learn';
	if (currentState?.state === State.Review || currentState?.state === State.Learning) {
		sessionType = 'review';
	}

	return {
		sessionType,
		topicId,
		topic
	};
};

export const actions: Actions = {
	complete: async ({ request, locals, params }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const grade = parseInt(formData.get('grade')?.toString() ?? '0');
		const topicId = params.slug;

		if (!topicId) {
			return fail(400, { message: 'Missing topic ID' });
		}
		if (!isValidGrade(grade)) {
			return fail(400, { message: 'Invalid grade value' });
		}

		const [topic, knowledgeGraph] = await Promise.all([getTopic(topicId), getKnowledgeGraph()]);
		if (!topic) {
			return fail(404, { message: 'Topic not found' });
		}

		const prereqIds = topic.prerequisites.map((p) => p.id);
		const dependentIds = getPositiveWeightDependents(topicId, knowledgeGraph);

		const neededStateIds = new Set<string>([topicId, ...prereqIds, ...dependentIds]);
		for (const dependentId of dependentIds) {
			const dependentTopic = knowledgeGraph.topics[dependentId];
			for (const prereq of dependentTopic?.prerequisites ?? []) {
				neededStateIds.add(prereq.id);
			}
		}

		const relevantStates = await topicStateQ.getStatesByTopicIds(user.id, [...neededStateIds]);
		const stateMap = new Map(relevantStates.map((state) => [state.topic_id, state]));

		if (prereqIds.length > 0) {
			const locked = topic.prerequisites.some((prereq) => {
				const prereqState = stateMap.get(prereq.id);
				return !prereqState || prereqState.state === State.New;
			});
			if (locked) {
				return fail(403, { message: 'Topic is locked. Complete prerequisites first.' });
			}
		}

		if (!isTopicActiveForCompletion(topicId, topic, knowledgeGraph, stateMap, new Date())) {
			return fail(403, { message: 'Topic is not currently available for completion.' });
		}

		const scheduler = new SchedulerService();
		await scheduler.processReview(user.id, topicId, grade, knowledgeGraph);

		redirect(303, '/learn');
	}
};
