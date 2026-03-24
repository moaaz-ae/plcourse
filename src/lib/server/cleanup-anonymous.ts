import { sql } from 'kysely';
import { db } from './db';

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const MAX_AGE_HOURS = 24;
const CLEANUP_BATCH_SIZE = 500;
const ADVISORY_LOCK_KEY = 2_021_004_083;

async function tryAcquireCleanupLock(): Promise<boolean> {
	const result = await sql<{ locked: boolean }>`
		SELECT pg_try_advisory_lock(${ADVISORY_LOCK_KEY}) AS locked
	`.execute(db);
	return result.rows[0]?.locked === true;
}

async function releaseCleanupLock(): Promise<void> {
	await sql`SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY})`.execute(db);
}

async function cleanupAnonymousUsersOnce(): Promise<void> {
	const lockAcquired = await tryAcquireCleanupLock();
	if (!lockAcquired) {
		return;
	}

	try {
		const cutoffDate = new Date();
		cutoffDate.setHours(cutoffDate.getHours() - MAX_AGE_HOURS);

		let totalDeleted = 0;

		while (true) {
			const expiredUsers = await db
				.selectFrom('user')
				.select('id')
				.where('isAnonymous', '=', true)
				.where('createdAt', '<', cutoffDate)
				.orderBy('createdAt', 'asc')
				.limit(CLEANUP_BATCH_SIZE)
				.execute();

			if (expiredUsers.length === 0) {
				break;
			}

			const expiredUserIds = expiredUsers.map((user) => user.id);

			await db.deleteFrom('topic_state').where('user_id', 'in', expiredUserIds).execute();
			await db.deleteFrom('learning_log').where('user_id', 'in', expiredUserIds).execute();
			await db.deleteFrom('session').where('userId', 'in', expiredUserIds).execute();
			await db.deleteFrom('account').where('userId', 'in', expiredUserIds).execute();

			const result = await db
				.deleteFrom('user')
				.where('id', 'in', expiredUserIds)
				.executeTakeFirst();
			totalDeleted += Number(result.numDeletedRows);

			if (expiredUsers.length < CLEANUP_BATCH_SIZE) {
				break;
			}
		}

		if (totalDeleted > 0) {
			console.log(`[cleanup] Deleted ${totalDeleted} anonymous user(s)`);
		}
	} catch (err) {
		console.error('[cleanup] Failed to clean anonymous users:', err);
	} finally {
		await releaseCleanupLock();
	}
}

export function startAnonymousCleanup() {
	void cleanupAnonymousUsersOnce();
	const timer = setInterval(() => {
		void cleanupAnonymousUsersOnce();
	}, CLEANUP_INTERVAL_MS);
	timer.unref();
}
