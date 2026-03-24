import { getKnowledgeGraph } from '$lib/server/services/curriculum.service';
import * as topicStateQ from '$lib/server/queries/topic-state.queries';
import type { PageServerLoad } from './$types';
import type { TopicState } from '$lib/server/db/types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/');
	}

	const knowledgeGraph = await getKnowledgeGraph();

	const nodes = knowledgeGraph.topologicalOrder.map((topicId) => {
		const topic = knowledgeGraph.topics[topicId];
		const depth = knowledgeGraph.depthMap.get(topicId) || 0;
		const isMilestone = knowledgeGraph.milestones.includes(topicId);

		return {
			id: topicId,
			title: topic.title,
			depth,
			isMilestone
		};
	});

	const edges: Array<{ source: string; target: string }> = [];
	for (const node of nodes) {
		const prereqs = knowledgeGraph.topics[node.id]?.prerequisites ?? [];
		for (const prereq of prereqs) {
			edges.push({ source: prereq.id, target: node.id });
		}
	}

	const states = await topicStateQ.getAllStates(user.id);
	const topicStates: Record<string, TopicState> = Object.fromEntries(
		states.map((s) => [s.topic_id, s])
	);
	const depthValues = Array.from(knowledgeGraph.depthMap.values());
	const maxDepth = depthValues.length > 0 ? Math.max(...depthValues) : 0;

	return {
		graph: {
			nodes,
			edges
		},
		topicStates,
		stats: {
			totalTopics: nodes.length,
			maxDepth
		},
		user: {
			name: user.name,
			email: user.email,
			image: user.image,
			isAnonymous: user.isAnonymous === true
		}
	};
};
