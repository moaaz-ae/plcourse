import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulerService } from './scheduler.service';
import { Rating, State } from '$lib/types';
import type { TopicState } from '$lib/server/db/types';

vi.mock('../queries/topic-state.queries', () => ({
	getDueReviews: vi.fn(),
	getAllStates: vi.fn(),
	getState: vi.fn(),
	upsertState: vi.fn(),
	applyFireBoosts: vi.fn()
}));
vi.mock('../queries/learning-log.queries', () => ({
	logInteraction: vi.fn()
}));
vi.mock('../db', () => ({
	db: {
		transaction: () => ({
			execute: async (callback: (trx: object) => Promise<void>) => callback({})
		}),
		selectFrom: vi.fn(),
		updateTable: vi.fn()
	}
}));

import * as topicStateQ from '../queries/topic-state.queries';
import * as learningLogQ from '../queries/learning-log.queries';
import type { KnowledgeGraph } from '$lib/types';

const mockGetState = vi.mocked(topicStateQ.getState);
const mockUpsertState = vi.mocked(topicStateQ.upsertState);
const mockApplyFireBoosts = vi.mocked(topicStateQ.applyFireBoosts);
const mockLogInteraction = vi.mocked(learningLogQ.logInteraction);

// Helper to create TopicState with default values for new fields
function createTopicState(
	partial: Omit<TopicState, 'reps' | 'lapses' | 'scheduled_days' | 'learning_steps'> &
		Partial<Pick<TopicState, 'reps' | 'lapses' | 'scheduled_days' | 'learning_steps'>>
): TopicState {
	return {
		reps: 1,
		lapses: 0,
		scheduled_days: 10,
		learning_steps: 0,
		...partial
	};
}

const knowledgeGraph: KnowledgeGraph = {
	topologicalOrder: ['A', 'B', 'C', 'D'],
	topics: {
		A: { id: 'A', title: 'A', prerequisites: [], problems: [], slides: [] },
		B: {
			id: 'B',
			title: 'B',
			prerequisites: [{ id: 'A', weight: 0 }],
			problems: [],
			slides: []
		},
		C: {
			id: 'C',
			title: 'C',
			prerequisites: [{ id: 'B', weight: 0.5 }],
			problems: [],
			slides: []
		},
		D: {
			id: 'D',
			title: 'D',
			prerequisites: [{ id: 'A', weight: 0.5 }],
			problems: [],
			slides: []
		}
	},
	depthMap: new Map(),
	milestones: []
};

describe('Scheduler Service', () => {
	let scheduler: SchedulerService;

	beforeEach(() => {
		vi.clearAllMocks();
		scheduler = new SchedulerService();
	});

	describe('getDailyTasks', () => {
		it('should return due reviews', async () => {
			const userId = 'user1';
			const dueState = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([dueState], knowledgeGraph);

			expect(result.reviews).toContain('A');
		});

		it('should block reviews if prerequisite is in Relearning state', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 1,
				difficulty: 8,
				last_review: new Date(),
				due_date: new Date(),
				state: State.Relearning
			});
			const stateB = createTopicState({
				user_id: userId,
				topic_id: 'B',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([stateA, stateB], knowledgeGraph);

			expect(result.reviews).not.toContain('B');
		});

		it('should apply Repetition Compression (hide weighted prereq if parent is due)', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});
			const stateD = createTopicState({
				user_id: userId,
				topic_id: 'D',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([stateA, stateD], knowledgeGraph);

			expect(result.reviews).toContain('D');
			expect(result.reviews).not.toContain('A');
		});

		it('should NOT compress if parent is NOT due', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});
			const stateD = createTopicState({
				user_id: userId,
				topic_id: 'D',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() + 10000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([stateA, stateD], knowledgeGraph);

			expect(result.reviews).toContain('A');
		});

		it('should NOT compress if prerequisite is strict (weight = 0)', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});
			const stateB = createTopicState({
				user_id: userId,
				topic_id: 'B',
				stability: 10,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() - 10000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([stateA, stateB], knowledgeGraph);

			expect(result.reviews).toContain('A');
			expect(result.reviews).toContain('B');
		});

		it('should suggest New topics if prerequisites are in State.Review', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 50,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(Date.now() + 100000),
				state: State.Review
			});

			const result = await scheduler.getDailyTasks([stateA], knowledgeGraph);

			expect(result.newTopics).toContain('B');
			expect(result.newTopics).not.toContain('A');
		});

		it('should NOT suggest New topics if prerequisites are NOT in Review (e.g. Learning)', async () => {
			const userId = 'user1';
			const stateA = createTopicState({
				user_id: userId,
				topic_id: 'A',
				stability: 5,
				difficulty: 5,
				last_review: new Date(),
				due_date: new Date(),
				state: State.Learning
			});

			const result = await scheduler.getDailyTasks([stateA], knowledgeGraph);

			expect(result.newTopics).not.toContain('B');
		});
	});

	describe('computeFireBoosts', () => {
		it('should compute boost for weighted ancestor (Good rating)', () => {
			const boosts = scheduler.computeFireBoosts('C', Rating.Good, knowledgeGraph);

			expect(boosts).toEqual([{ topicId: 'B', boost: 0.25 }]);
		});

		it('should compute full weight boost for Easy rating', () => {
			const boosts = scheduler.computeFireBoosts('C', Rating.Easy, knowledgeGraph);

			expect(boosts).toEqual([{ topicId: 'B', boost: 0.5 }]);
		});

		it('should NOT produce boosts for strict prerequisites (weight = 0)', () => {
			const boosts = scheduler.computeFireBoosts('B', Rating.Good, knowledgeGraph);

			expect(boosts).toEqual([]);
		});

		it('should NOT produce boosts for Again/Hard ratings', () => {
			const boosts = scheduler.computeFireBoosts('C', Rating.Again, knowledgeGraph);
			expect(boosts).toEqual([]);

			const boosts2 = scheduler.computeFireBoosts('C', Rating.Hard, knowledgeGraph);
			expect(boosts2).toEqual([]);
		});

		it('should choose strongest boost when multiple paths reach the same ancestor', () => {
			const multiPathGraph: KnowledgeGraph = {
				topologicalOrder: ['A', 'B', 'D', 'C'],
				topics: {
					A: { id: 'A', title: 'A', prerequisites: [], problems: [], slides: [] },
					B: {
						id: 'B',
						title: 'B',
						prerequisites: [{ id: 'A', weight: 0.9 }],
						problems: [],
						slides: []
					},
					D: {
						id: 'D',
						title: 'D',
						prerequisites: [{ id: 'A', weight: 0.3 }],
						problems: [],
						slides: []
					},
					C: {
						id: 'C',
						title: 'C',
						prerequisites: [
							{ id: 'D', weight: 0.9 },
							{ id: 'B', weight: 0.4 }
						],
						problems: [],
						slides: []
					}
				},
				depthMap: new Map(),
				milestones: []
			};

			const boosts = scheduler.computeFireBoosts('C', Rating.Good, multiPathGraph);
			const boostMap = Object.fromEntries(boosts.map(({ topicId, boost }) => [topicId, boost]));

			expect(boostMap.D).toBeCloseTo(0.45, 5);
			expect(boostMap.B).toBeCloseTo(0.2, 5);
			expect(boostMap.A).toBeCloseTo(0.18, 5);
		});
	});

	describe('processReview', () => {
		it('should upsert state, log interaction, and call applyFireBoosts', async () => {
			const userId = 'user1';
			const topicId = 'C';

			mockGetState.mockResolvedValue(undefined);
			mockUpsertState.mockResolvedValue(undefined);
			mockLogInteraction.mockResolvedValue(undefined);
			mockApplyFireBoosts.mockResolvedValue(undefined);

			await scheduler.processReview(userId, topicId, Rating.Good, knowledgeGraph);

			expect(mockUpsertState).toHaveBeenCalledWith(
				expect.objectContaining({ topic_id: 'C' }),
				expect.anything()
			);

			expect(mockLogInteraction).toHaveBeenCalledWith(
				expect.objectContaining({ topic_id: 'C' }),
				expect.anything()
			);

			expect(mockApplyFireBoosts).toHaveBeenCalledWith(
				userId,
				[{ topicId: 'B', boost: 0.25 }],
				expect.anything()
			);
		});

		it('should NOT call applyFireBoosts for strict prerequisites (weight = 0)', async () => {
			const userId = 'user1';
			const topicId = 'B';

			mockGetState.mockResolvedValue(undefined);
			mockUpsertState.mockResolvedValue(undefined);
			mockLogInteraction.mockResolvedValue(undefined);
			mockApplyFireBoosts.mockResolvedValue(undefined);

			await scheduler.processReview(userId, topicId, Rating.Good, knowledgeGraph);

			expect(mockApplyFireBoosts).toHaveBeenCalledWith(userId, [], expect.anything());
		});
	});
});
