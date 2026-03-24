import { db } from '../db';
import { sql } from 'kysely';
import type { TopicState } from '../db/types';
import { State } from '$lib/types';
import type { Database } from '../db/types';
import type { Kysely, Transaction } from 'kysely';

type QueryExecutor = Kysely<Database> | Transaction<Database>;

export async function upsertState(data: TopicState, executor: QueryExecutor = db): Promise<void> {
	await executor
		.insertInto('topic_state')
		.values(data)
		.onConflict((oc) =>
			oc.columns(['user_id', 'topic_id']).doUpdateSet({
				stability: data.stability,
				difficulty: data.difficulty,
				last_review: data.last_review,
				due_date: data.due_date,
				state: data.state,
				reps: data.reps,
				lapses: data.lapses,
				scheduled_days: data.scheduled_days,
				learning_steps: data.learning_steps
			})
		)
		.execute();
}

export async function bulkUpsertStates(
	states: TopicState[],
	executor: QueryExecutor = db
): Promise<void> {
	if (states.length === 0) return;

	await executor
		.insertInto('topic_state')
		.values(states)
		.onConflict((oc) =>
			oc.columns(['user_id', 'topic_id']).doUpdateSet((eb) => ({
				stability: eb.ref('excluded.stability'),
				difficulty: eb.ref('excluded.difficulty'),
				last_review: eb.ref('excluded.last_review'),
				due_date: eb.ref('excluded.due_date'),
				state: eb.ref('excluded.state'),
				reps: eb.ref('excluded.reps'),
				lapses: eb.ref('excluded.lapses'),
				scheduled_days: eb.ref('excluded.scheduled_days'),
				learning_steps: eb.ref('excluded.learning_steps')
			}))
		)
		.execute();
}

export async function getState(
	userId: string,
	topicId: string,
	executor: QueryExecutor = db
): Promise<TopicState | undefined> {
	return await executor
		.selectFrom('topic_state')
		.selectAll()
		.where('user_id', '=', userId)
		.where('topic_id', '=', topicId)
		.executeTakeFirst();
}

export async function getAllStates(
	userId: string,
	executor: QueryExecutor = db
): Promise<TopicState[]> {
	return await executor
		.selectFrom('topic_state')
		.selectAll()
		.where('user_id', '=', userId)
		.execute();
}

export async function getStatesByTopicIds(
	userId: string,
	topicIds: string[],
	executor: QueryExecutor = db
): Promise<TopicState[]> {
	if (topicIds.length === 0) return [];
	return await executor
		.selectFrom('topic_state')
		.selectAll()
		.where('user_id', '=', userId)
		.where('topic_id', 'in', topicIds)
		.execute();
}

export async function applyFireBoosts(
	userId: string,
	boosts: Array<{ topicId: string; boost: number }>,
	executor: QueryExecutor = db
): Promise<void> {
	if (boosts.length === 0) return;

	const aggregated = new Map<string, number>();
	for (const { topicId, boost } of boosts) {
		aggregated.set(topicId, (aggregated.get(topicId) || 0) + boost);
	}

	const values = Array.from(aggregated.entries());

	await sql`
		UPDATE topic_state ts
		SET
			stability = ts.stability * (1 + b.boost),
			due_date = ts.last_review + (ts.stability * (1 + b.boost)) * INTERVAL '1 day'
		FROM (VALUES ${sql.join(
			values.map(([tid, boost]) => sql`(${tid}, ${boost}::double precision)`)
		)}) AS b(topic_id, boost)
		WHERE ts.user_id = ${userId}
		  AND ts.topic_id = b.topic_id
		  AND ts.state = ${State.Review}
	`.execute(executor);
}
