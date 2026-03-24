import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('user')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('email', 'text', (col) => col.notNull().unique())
		.addColumn('emailVerified', 'boolean', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('isAnonymous', 'boolean', (col) => col.defaultTo(false))
		.addColumn('learn_session_started_at', 'timestamptz')
		.execute();

	await db.schema
		.createTable('session')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
		.addColumn('token', 'text', (col) => col.notNull().unique())
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('ipAddress', 'text')
		.addColumn('userAgent', 'text')
		.addColumn('userId', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		.execute();

	await db.schema
		.createTable('account')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('accountId', 'text', (col) => col.notNull())
		.addColumn('providerId', 'text', (col) => col.notNull())
		.addColumn('userId', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		.addColumn('accessToken', 'text')
		.addColumn('refreshToken', 'text')
		.addColumn('idToken', 'text')
		.addColumn('accessTokenExpiresAt', 'timestamptz')
		.addColumn('refreshTokenExpiresAt', 'timestamptz')
		.addColumn('scope', 'text')
		.addColumn('password', 'text')
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute();

	await db.schema
		.createTable('verification')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('identifier', 'text', (col) => col.notNull())
		.addColumn('value', 'text', (col) => col.notNull())
		.addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
		.addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute();

	await db.schema.createIndex('session_userId_idx').on('session').column('userId').execute();

	await db.schema.createIndex('account_userId_idx').on('account').column('userId').execute();

	await db.schema
		.createIndex('verification_identifier_idx')
		.on('verification')
		.column('identifier')
		.execute();

	await sql`
		CREATE INDEX user_anonymous_created_at_idx
		ON "user" ("createdAt")
		WHERE "isAnonymous" = true
	`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	await sql`DROP INDEX IF EXISTS user_anonymous_created_at_idx`.execute(db);
	await db.schema.dropIndex('verification_identifier_idx').execute();
	await db.schema.dropIndex('account_userId_idx').execute();
	await db.schema.dropIndex('session_userId_idx').execute();

	await db.schema.dropTable('verification').execute();
	await db.schema.dropTable('account').execute();
	await db.schema.dropTable('session').execute();
	await db.schema.dropTable('user').execute();
}
