import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { env } from '$env/dynamic/private';
import type { Database } from './types';
import { dev } from '$app/environment';
import { getDatabaseConnectionString } from './config';

const connectionString = env.POSTGRES_HOST ? getDatabaseConnectionString(env) : undefined;
export const sharedPool = new Pool({
	connectionString,
	max: 4,
	min: 0,
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 2_000
});

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: sharedPool
	}),
	log: (event) => {
		if (dev) {
			if (event.level === 'query') {
				console.log('SQL:', event.query.sql);
				console.log('Parameters:', event.query.parameters);
			}
			if (event.level === 'error') {
				console.error('Kysely DB Error:', event.error);
			}
		}
	}
});
