import * as learningLogQ from '../queries/learning-log.queries';
import * as topicStateQ from '../queries/topic-state.queries';
import { getKnowledgeGraph } from './curriculum.service';
import { State, Rating } from '$lib/types';
import type { TopicState } from '../db/types';
import type { KnowledgeGraph } from '$lib/types';
import { DIAGNOSTIC_KNOWN_STABILITY_DAYS } from '$lib/constants';
import { scheduler, createEmptyCard, type FSRSHistory } from '../fsrs';

export class DiagnosticService {
	async getNextTopic(userId: string): Promise<{ topicId: string | null; questionNumber: number }> {
		const existingStates = await topicStateQ.getAllStates(userId);
		if (existingStates.length > 0) {
			return { topicId: null, questionNumber: 0 };
		}

		const knowledgeGraph = await getKnowledgeGraph();
		const history = await learningLogQ.getAllHistory(userId);
		const questionNumber = history.length + 1;

		const results = new Map<string, 'pass' | 'fail'>();
		for (const log of history) {
			results.set(log.topic_id, log.grade >= Rating.Good ? 'pass' : 'fail');
		}

		if (results.size === 0) {
			const midIndex = Math.floor(knowledgeGraph.milestones.length / 2);
			return { topicId: knowledgeGraph.milestones[midIndex], questionNumber };
		}

		const sortedTopics = knowledgeGraph.topologicalOrder;
		let maxPassIndex = -1;
		let minFailIndex = sortedTopics.length;

		for (let i = 0; i < sortedTopics.length; i++) {
			const id = sortedTopics[i];
			const status = results.get(id);
			if (status === 'pass') {
				maxPassIndex = Math.max(maxPassIndex, i);
			} else if (status === 'fail') {
				minFailIndex = Math.min(minFailIndex, i);
			}
		}

		if (minFailIndex - maxPassIndex <= 1) {
			await this.finalizeDiagnostic(userId, results, knowledgeGraph);
			return { topicId: null, questionNumber };
		}

		const validMilestones = knowledgeGraph.milestones.filter((m) => {
			const idx = sortedTopics.indexOf(m);
			return idx > maxPassIndex && idx < minFailIndex;
		});

		if (validMilestones.length > 0) {
			const mid = Math.floor(validMilestones.length / 2);
			return { topicId: validMilestones[mid], questionNumber };
		}

		const midIndex = Math.floor((maxPassIndex + minFailIndex) / 2);

		const candidate = sortedTopics[midIndex];
		if (results.has(candidate)) {
			const found = sortedTopics.slice(maxPassIndex + 1, minFailIndex).find((t) => !results.has(t));
			if (found) return { topicId: found, questionNumber };

			await this.finalizeDiagnostic(userId, results, knowledgeGraph);
			return { topicId: null, questionNumber };
		}

		return { topicId: candidate, questionNumber };
	}

	private async finalizeDiagnostic(
		userId: string,
		results: Map<string, 'pass' | 'fail'>,
		knowledgeGraph: KnowledgeGraph
	): Promise<void> {
		const allTopics = knowledgeGraph.topologicalOrder;
		const states: TopicState[] = [];
		const now = new Date();

		let frontierIndex = -1;
		for (let i = 0; i < allTopics.length; i++) {
			if (results.get(allTopics[i]) === 'pass') {
				frontierIndex = i;
			}
		}

		for (let i = 0; i < allTopics.length; i++) {
			const topicId = allTopics[i];
			const isKnown = i <= frontierIndex;

			if (isKnown) {
				const dueDate = new Date(
					now.getTime() + DIAGNOSTIC_KNOWN_STABILITY_DAYS * 24 * 60 * 60 * 1000
				);
				const manualReview: FSRSHistory = {
					rating: Rating.Manual,
					state: State.Review,
					review: now,
					due: dueDate,
					stability: DIAGNOSTIC_KNOWN_STABILITY_DAYS,
					difficulty: 5
				};

				const { collections } = scheduler.reschedule(createEmptyCard(now), [manualReview], {
					skipManual: false
				});

				const manualCard = collections[0]?.card;
				if (manualCard) {
					states.push({
						user_id: userId,
						topic_id: topicId,
						stability: manualCard.stability,
						difficulty: manualCard.difficulty,
						last_review: manualCard.last_review ?? now,
						due_date: manualCard.due,
						state: manualCard.state,
						reps: manualCard.reps,
						lapses: manualCard.lapses,
						scheduled_days: manualCard.scheduled_days,
						learning_steps: manualCard.learning_steps
					});
				}
			}
		}

		if (states.length === 0 && allTopics.length > 0) {
			const emptyCard = createEmptyCard(now);
			states.push({
				user_id: userId,
				topic_id: allTopics[0],
				stability: emptyCard.stability,
				difficulty: emptyCard.difficulty,
				last_review: now,
				due_date: now,
				state: State.New,
				reps: emptyCard.reps,
				lapses: emptyCard.lapses,
				scheduled_days: emptyCard.scheduled_days,
				learning_steps: emptyCard.learning_steps
			});
		}

		await topicStateQ.bulkUpsertStates(states);
	}
}
