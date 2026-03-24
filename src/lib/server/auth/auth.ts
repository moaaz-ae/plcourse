import { betterAuth } from 'better-auth';
import 'pg';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { anonymous } from 'better-auth/plugins';
import { db, sharedPool } from '$lib/server/db';
import { sql } from 'kysely';

const baseURL = (env.APP_URL ?? (building ? 'http://localhost:3000' : undefined))?.replace(
	/\/+$/,
	''
);

if (!baseURL) {
	throw new Error('APP_URL must be set.');
}

const authSecret =
	env.BETTER_AUTH_SECRET ?? (building ? 'build-time-better-auth-secret' : undefined);

if (!authSecret) {
	throw new Error('BETTER_AUTH_SECRET must be set.');
}

export const auth = betterAuth({
	database: sharedPool,
	secret: authSecret,
	baseURL,
	user: {
		additionalFields: {
			learn_session_started_at: {
				type: 'date',
				required: false,
				input: false
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 4
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			accessType: 'offline',
			prompt: 'select_account consent'
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent),
		anonymous({
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				const anonId = anonymousUser.user.id;
				const realId = newUser.user.id;

				await db.transaction().execute(async (trx) => {
					await trx
						.updateTable('learning_log')
						.set({ user_id: realId })
						.where('user_id', '=', anonId)
						.execute();

					const anonStates = await trx
						.selectFrom('topic_state')
						.selectAll()
						.where('user_id', '=', anonId)
						.execute();

					if (anonStates.length > 0) {
						await trx
							.insertInto('topic_state')
							.values(anonStates.map((state) => ({ ...state, user_id: realId })))
							.onConflict((oc) =>
								oc.columns(['user_id', 'topic_id']).doUpdateSet({
									stability: sql<number>`GREATEST(topic_state.stability, excluded.stability)`,
									difficulty: sql<number>`LEAST(topic_state.difficulty, excluded.difficulty)`,
									last_review: sql<Date>`GREATEST(topic_state.last_review, excluded.last_review)`,
									due_date: sql<Date>`LEAST(topic_state.due_date, excluded.due_date)`,
									state: sql<number>`GREATEST(topic_state.state, excluded.state)`
								})
							)
							.execute();
					}

					await trx.deleteFrom('topic_state').where('user_id', '=', anonId).execute();
				});
			}
		})
	]
});
