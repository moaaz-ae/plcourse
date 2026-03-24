import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiagnosticService } from './diagnostic.service';
import { Rating } from '$lib/types';

vi.mock('../queries/topic-state.queries', () => ({
	getAllStates: vi.fn(),
	bulkUpsertStates: vi.fn()
}));
vi.mock('../queries/learning-log.queries', () => ({
	getAllHistory: vi.fn()
}));
vi.mock('./curriculum.service', () => ({
	getKnowledgeGraph: vi.fn().mockResolvedValue({
		topologicalOrder: ['A', 'B', 'C', 'D', 'E'],
		milestones: ['A', 'C', 'E'],
		topics: {
			A: { id: 'A', prerequisites: [] },
			B: { id: 'B', prerequisites: [{ id: 'A', weight: 0.5 }] },
			C: { id: 'C', prerequisites: [{ id: 'B', weight: 0.5 }] },
			D: { id: 'D', prerequisites: [{ id: 'C', weight: 0.5 }] },
			E: { id: 'E', prerequisites: [{ id: 'D', weight: 0.5 }] }
		}
	})
}));

import * as topicStateQ from '../queries/topic-state.queries';
import * as learningLogQ from '../queries/learning-log.queries';

const mockGetAllStates = vi.mocked(topicStateQ.getAllStates);
const mockBulkUpsertStates = vi.mocked(topicStateQ.bulkUpsertStates);
const mockGetAllHistory = vi.mocked(learningLogQ.getAllHistory);

describe('Diagnostic Service', () => {
	let service: DiagnosticService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new DiagnosticService();

		mockGetAllStates.mockResolvedValue([]);
	});

	describe('getNextTopic', () => {
		it('should start at the middle milestone if no history', async () => {
			mockGetAllHistory.mockResolvedValue([]);
			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBe('C');
			expect(result.questionNumber).toBe(1);
		});

		it('should go UP if user passes the middle milestone', async () => {
			mockGetAllHistory.mockResolvedValue([{ topic_id: 'C', grade: Rating.Good }] as any);
			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBe('E');
			expect(result.questionNumber).toBe(2);
		});

		it('should go DOWN if user fails the middle milestone', async () => {
			mockGetAllHistory.mockResolvedValue([{ topic_id: 'C', grade: Rating.Again }] as any);
			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBe('A');
			expect(result.questionNumber).toBe(2);
		});

		it('should find the gap between passed and failed topics', async () => {
			mockGetAllHistory.mockResolvedValue([
				{ topic_id: 'C', grade: Rating.Again },
				{ topic_id: 'A', grade: Rating.Good }
			] as any);

			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBe('B');
			expect(result.questionNumber).toBe(3);
		});

		it('should finalize and return null when frontier is found (Pass B, Fail C)', async () => {
			mockGetAllHistory.mockResolvedValue([
				{ topic_id: 'C', grade: Rating.Again },
				{ topic_id: 'A', grade: Rating.Good },
				{ topic_id: 'B', grade: Rating.Good }
			] as any);

			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBeNull();

			expect(mockBulkUpsertStates).toHaveBeenCalled();

			const callArgs = mockBulkUpsertStates.mock.calls[0][0];
			const knownTopics = callArgs.map((s: any) => s.topic_id);
			expect(knownTopics).toContain('A');
			expect(knownTopics).toContain('B');
			expect(knownTopics).not.toContain('C');
		});

		it('should not force-finalize after 15+ answers when frontier is still unresolved', async () => {
			const longHistory = Array.from({ length: 16 }, (_, i) =>
				i % 2 === 0 ? { topic_id: 'A', grade: Rating.Good } : { topic_id: 'E', grade: Rating.Again }
			);
			mockGetAllHistory.mockResolvedValue(longHistory as any);

			const result = await service.getNextTopic('user1');
			expect(result.topicId).toBe('C');
			expect(result.questionNumber).toBe(17);
			expect(mockBulkUpsertStates).not.toHaveBeenCalled();
		});
	});
});
