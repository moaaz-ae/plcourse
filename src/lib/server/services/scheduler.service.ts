import * as topicStateQ from '../queries/topic-state.queries';
import * as learningLogQ from '../queries/learning-log.queries';
import { scheduler, createEmptyCard, State, Rating, type Grade, type Card } from '../fsrs';
import { db } from '../db';
import type { TopicState } from '../db/types';
import type { KnowledgeGraph } from '$lib/types';
import { SESSION_DURATION_HOURS } from '$lib/constants';

export class SchedulerService {
	async getDailyTasks(
		allStates: TopicState[],
		knowledgeGraph: KnowledgeGraph
	): Promise<{ reviews: string[]; newTopics: string[] }> {
		const now = new Date();
		const dueStates = allStates.filter((s) => s.due_date <= now);
		const stateMap = new Map(allStates.map((s) => [s.topic_id, s]));
		const eligibleDueStates = dueStates.filter((state) => {
			if (state.state === State.New) return false;
			const prereqs = knowledgeGraph.topics[state.topic_id]?.prerequisites || [];
			return !prereqs.some((p) => {
				const prereqState = stateMap.get(p.id);
				return prereqState?.state === State.Relearning;
			});
		});

		const visibleReviews: string[] = [];

		for (const state of eligibleDueStates) {
			const topicId = state.topic_id;

			const isCompressed = eligibleDueStates.some((otherState) => {
				if (otherState.topic_id === topicId) return false;
				const otherPrereqs = knowledgeGraph.topics[otherState.topic_id]?.prerequisites || [];
				return otherPrereqs.some((p) => p.id === topicId && p.weight > 0);
			});

			if (!isCompressed) {
				visibleReviews.push(topicId);
			}
		}

		const newTopics: string[] = [];
		const sorted = knowledgeGraph.topologicalOrder;

		for (const topicId of sorted) {
			const state = stateMap.get(topicId);

			const isNew = !state || state.state === State.New;
			if (isNew) {
				const prereqs = knowledgeGraph.topics[topicId]?.prerequisites || [];

				const allPrereqsReady = prereqs.every((p) => {
					const pState = stateMap.get(p.id);
					return pState && pState.state === State.Review;
				});

				if (allPrereqsReady) {
					newTopics.push(topicId);
				}
			}
		}

		return {
			reviews: visibleReviews,
			newTopics
		};
	}

	async processReview(
		userId: string,
		topicId: string,
		grade: Grade,
		knowledgeGraph: KnowledgeGraph
	): Promise<void> {
		await db.transaction().execute(async (trx) => {
			const currentStateRecord = await topicStateQ.getState(userId, topicId, trx);
			const now = new Date();

			const isNew = !currentStateRecord || currentStateRecord.state === State.New;
			const card: Card = isNew
				? createEmptyCard(now)
				: {
						due: new Date(currentStateRecord.due_date),
						stability: currentStateRecord.stability,
						difficulty: currentStateRecord.difficulty,
						elapsed_days: 0,
						scheduled_days: currentStateRecord.scheduled_days,
						reps: currentStateRecord.reps,
						lapses: currentStateRecord.lapses,
						learning_steps: currentStateRecord.learning_steps,
						state: currentStateRecord.state,
						last_review: new Date(currentStateRecord.last_review)
					};

			const result = scheduler.next(card, now, grade);
			const newCard = result.card;

			const newState: TopicState = {
				user_id: userId,
				topic_id: topicId,
				stability: newCard.stability,
				difficulty: newCard.difficulty,
				last_review: now,
				due_date: newCard.due,
				state: newCard.state,
				reps: newCard.reps,
				lapses: newCard.lapses,
				scheduled_days: newCard.scheduled_days,
				learning_steps: newCard.learning_steps
			};

			await topicStateQ.upsertState(newState, trx);
			await learningLogQ.logInteraction(
				{
					user_id: userId,
					topic_id: topicId,
					grade,
					elapsed_days: card.elapsed_days,
					scheduled_days: newCard.scheduled_days,
					state: newCard.state
				},
				trx
			);

			const boosts = this.computeFireBoosts(topicId, grade, knowledgeGraph);
			await topicStateQ.applyFireBoosts(userId, boosts, trx);
		});
	}

	computeFireBoosts(
		childId: string,
		grade: Grade,
		knowledgeGraph: KnowledgeGraph
	): Array<{ topicId: string; boost: number }> {
		if (grade < Rating.Good) return [];

		const ratingMultiplier = grade === Rating.Easy ? 1.0 : 0.5;
		const bestChainByTopic = new Map<string, number>();
		const stack: Array<{ nodeId: string; chainWeight: number }> = [
			{ nodeId: childId, chainWeight: 1.0 }
		];

		while (stack.length > 0) {
			const current = stack.pop();
			if (!current || current.chainWeight < 0.001) continue;

			const prereqs = knowledgeGraph.topics[current.nodeId]?.prerequisites || [];
			for (const prereq of prereqs) {
				if (prereq.weight <= 0) continue;

				const chainWeight = current.chainWeight * prereq.weight;
				if (chainWeight < 0.001) continue;

				const previousBest = bestChainByTopic.get(prereq.id) ?? 0;
				if (chainWeight <= previousBest) continue;

				bestChainByTopic.set(prereq.id, chainWeight);
				stack.push({ nodeId: prereq.id, chainWeight });
			}
		}

		return Array.from(bestChainByTopic.entries()).map(([topicId, chainWeight]) => ({
			topicId,
			boost: chainWeight * ratingMultiplier
		}));
	}

	async getOrCreateSession(userId: string): Promise<Date> {
		const user = await db
			.selectFrom('user')
			.select('learn_session_started_at')
			.where('id', '=', userId)
			.executeTakeFirst();
		const currentSessionStart = user?.learn_session_started_at ?? null;

		const now = new Date();

		const sessionExpired =
			!currentSessionStart ||
			now.getTime() - new Date(currentSessionStart).getTime() >
				SESSION_DURATION_HOURS * 60 * 60 * 1000;

		if (sessionExpired) {
			await db
				.updateTable('user')
				.set({ learn_session_started_at: now })
				.where('id', '=', userId)
				.execute();
			return now;
		}

		return currentSessionStart instanceof Date
			? currentSessionStart
			: new Date(currentSessionStart);
	}

	async resetSession(userId: string): Promise<void> {
		await db
			.updateTable('user')
			.set({ learn_session_started_at: new Date() })
			.where('id', '=', userId)
			.execute();
	}
}
