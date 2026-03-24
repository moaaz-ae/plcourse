/**
 * Test data helpers – pure functions that take a Pool and set up / query DB state.
 */
import type { Pool } from 'pg';
import { State } from '../../src/lib/types';

// ── User lifecycle ───────────────────────────────────────────────────────────

export async function cleanupTestUser(db: Pool, userId: string): Promise<void> {
	await db.query(`DELETE FROM learning_log WHERE user_id = $1`, [userId]);
	await db.query(`DELETE FROM topic_state WHERE user_id = $1`, [userId]);
	await db.query(`DELETE FROM session WHERE "userId" = $1`, [userId]);
	await db.query(`DELETE FROM account WHERE "userId" = $1`, [userId]);
	await db.query(`DELETE FROM "user" WHERE id = $1`, [userId]);
}

// ── Topic state setup ────────────────────────────────────────────────────────

export async function setupNewTopic(db: Pool, userId: string, topicId: string): Promise<void> {
	// ts-fsrs requires stability=0 AND difficulty=0 for State.New cards
	await db.query(
		`INSERT INTO topic_state (user_id, topic_id, stability, difficulty, last_review, due_date, state, reps, lapses, scheduled_days, learning_steps)
		 VALUES ($1, $2, 0, 0, NOW(), NOW(), $3, 0, 0, 0, 0)
		 ON CONFLICT (user_id, topic_id) DO UPDATE SET
		 stability = 0, difficulty = 0, last_review = NOW(), due_date = NOW(), state = $3, reps = 0, lapses = 0, scheduled_days = 0, learning_steps = 0`,
		[userId, topicId, State.New]
	);
}

export async function setupReviewableTopicState(
	db: Pool,
	userId: string,
	topicId: string,
	options: { stability?: number; difficulty?: number } = {}
): Promise<void> {
	const { stability = 10, difficulty = 5 } = options;
	await db.query(
		`INSERT INTO topic_state (user_id, topic_id, stability, difficulty, last_review, due_date, state, reps, lapses, scheduled_days, learning_steps)
		 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 hour', 2, 1, 0, 10, 0)
		 ON CONFLICT (user_id, topic_id) DO UPDATE SET
		 stability = EXCLUDED.stability,
		 difficulty = EXCLUDED.difficulty,
		 last_review = EXCLUDED.last_review,
		 due_date = EXCLUDED.due_date,
		 state = EXCLUDED.state,
		 reps = EXCLUDED.reps,
		 lapses = EXCLUDED.lapses,
		 scheduled_days = EXCLUDED.scheduled_days,
		 learning_steps = EXCLUDED.learning_steps`,
		[userId, topicId, stability, difficulty]
	);
}

export async function setupRelearningTopicState(
	db: Pool,
	userId: string,
	topicId: string
): Promise<void> {
	await db.query(
		`INSERT INTO topic_state (user_id, topic_id, stability, difficulty, last_review, due_date, state, reps, lapses, scheduled_days, learning_steps)
		 VALUES ($1, $2, 1, 5, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 hour', 3, 2, 1, 0, 0)
		 ON CONFLICT (user_id, topic_id) DO UPDATE SET
		 stability = 1,
		 difficulty = 5,
		 last_review = EXCLUDED.last_review,
		 due_date = EXCLUDED.due_date,
		 state = 3,
		 reps = EXCLUDED.reps,
		 lapses = EXCLUDED.lapses,
		 scheduled_days = EXCLUDED.scheduled_days,
		 learning_steps = EXCLUDED.learning_steps`,
		[userId, topicId]
	);
}

export async function clearUserTopics(db: Pool, userId: string): Promise<void> {
	await db.query(`DELETE FROM topic_state WHERE user_id = $1`, [userId]);
	await db.query(`DELETE FROM learning_log WHERE user_id = $1`, [userId]);
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getTopicState(
	db: Pool,
	userId: string,
	topicId: string
): Promise<{ state: number; stability: number; difficulty: number } | null> {
	const result = await db.query(
		`SELECT state, stability, difficulty FROM topic_state WHERE user_id = $1 AND topic_id = $2`,
		[userId, topicId]
	);
	return result.rows[0] ?? null;
}

export async function getExistingTopicIds(db: Pool, limit: number): Promise<string[]> {
	const result = await db.query(`SELECT id FROM topic ORDER BY id ASC LIMIT $1`, [limit]);
	return result.rows.map((r: { id: string }) => r.id);
}

export async function insertCompletionLogs(
	db: Pool,
	userId: string,
	topicIds: string[]
): Promise<void> {
	for (const topicId of topicIds) {
		const id = `log-${userId}-${topicId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		await db.query(
			`INSERT INTO learning_log (id, user_id, topic_id, grade, elapsed_days, scheduled_days, state, created_at)
			 VALUES ($1, $2, $3, 3, 0, 1, 2, NOW() + INTERVAL '1 hour')`,
			[id, userId, topicId]
		);
	}
}

export async function getSessionStart(db: Pool, userId: string): Promise<Date | null> {
	const result = await db.query(`SELECT learn_session_started_at FROM "user" WHERE id = $1`, [
		userId
	]);
	const value = result.rows[0]?.learn_session_started_at;
	return value ? new Date(value) : null;
}
