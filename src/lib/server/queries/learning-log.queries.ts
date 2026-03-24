import { db } from '../db';
import type { LearningLog } from '../db/types';
import { nanoid } from 'nanoid';
import { sql } from 'kysely';
import type { Database } from '../db/types';
import type { Kysely, Transaction } from 'kysely';

type QueryExecutor = Kysely<Database> | Transaction<Database>;

export async function logInteraction(
	data: Omit<LearningLog, 'id' | 'created_at'>,
	executor: QueryExecutor = db
): Promise<void> {
	await executor
		.insertInto('learning_log')
		.values({
			id: nanoid(),
			...data,
			created_at: new Date()
		})
		.execute();
}

export async function getAllHistory(
	userId: string,
	executor: QueryExecutor = db
): Promise<LearningLog[]> {
	return await executor
		.selectFrom('learning_log')
		.selectAll()
		.where('user_id', '=', userId)
		.orderBy('created_at', 'asc')
		.execute();
}

export async function getWeeklyActivity(
	userId: string,
	executor: QueryExecutor = db
): Promise<{ day: Date; count: number }[]> {
	const result = await executor
		.selectFrom('learning_log')
		.select([
			sql<Date>`date_trunc('day', created_at)`.as('day'),
			sql<number>`count(*)::int`.as('count')
		])
		.where('user_id', '=', userId)
		.where('created_at', '>', sql<Date>`NOW() - INTERVAL '7 days'`)
		.groupBy('day')
		.orderBy('day', 'asc')
		.execute();

	return result.map((r) => ({
		day: r.day,
		count: r.count
	}));
}

export async function getCompletedTasksSince(
	userId: string,
	since: Date,
	executor: QueryExecutor = db
): Promise<Array<{ topicId: string; type: 'review' | 'new' }>> {
	const result = await sql<{
		topic_id: string;
		task_type: 'review' | 'new';
		completed_at: Date;
	}>`
		WITH since_topics AS (
			SELECT
				ll.topic_id,
				MIN(ll.created_at) AS completed_at
			FROM learning_log ll
			WHERE ll.user_id = ${userId}
			  AND ll.created_at >= ${since}
			GROUP BY ll.topic_id
		),
		before_topics AS (
			SELECT DISTINCT ll.topic_id
			FROM learning_log ll
			WHERE ll.user_id = ${userId}
			  AND ll.created_at < ${since}
		)
		SELECT
			st.topic_id,
			CASE
				WHEN bt.topic_id IS NULL THEN 'new'
				ELSE 'review'
			END AS task_type,
			st.completed_at
		FROM since_topics st
		LEFT JOIN before_topics bt ON bt.topic_id = st.topic_id
		ORDER BY st.completed_at ASC, st.topic_id ASC
	`.execute(executor);

	return result.rows.map((row) => ({
		topicId: row.topic_id,
		type: row.task_type
	}));
}
