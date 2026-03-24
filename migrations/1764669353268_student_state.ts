import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('learning_log')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('user_id', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		.addColumn('topic_id', 'text', (col) => col.notNull())
		.addColumn('grade', 'integer', (col) => col.notNull())
		.addColumn('elapsed_days', 'real', (col) => col.notNull())
		.addColumn('scheduled_days', 'real', (col) => col.notNull())
		.addColumn('state', 'integer', (col) => col.notNull())
		.addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.execute();

	await db.schema
		.createTable('topic_state')
		.addColumn('user_id', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
		.addColumn('topic_id', 'text', (col) => col.notNull())
		.addColumn('stability', 'real', (col) => col.notNull())
		.addColumn('difficulty', 'real', (col) => col.notNull())
		.addColumn('last_review', 'timestamptz', (col) => col.notNull())
		.addColumn('due_date', 'timestamptz', (col) => col.notNull())
		.addColumn('state', 'integer', (col) => col.notNull())
		.addColumn('reps', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('lapses', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('scheduled_days', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('learning_steps', 'integer', (col) => col.notNull().defaultTo(0))
		.addPrimaryKeyConstraint('topic_state_pk', ['user_id', 'topic_id'])
		.execute();

	await db.schema
		.createIndex('learning_log_user_topic_idx')
		.on('learning_log')
		.columns(['user_id', 'topic_id'])
		.execute();

	await db.schema
		.createIndex('learning_log_user_created_at_idx')
		.on('learning_log')
		.columns(['user_id', 'created_at'])
		.execute();

	await db.schema
		.createIndex('learning_log_user_topic_created_at_idx')
		.on('learning_log')
		.columns(['user_id', 'topic_id', 'created_at'])
		.execute();

	await db.schema
		.createIndex('topic_state_due_date_idx')
		.on('topic_state')
		.column('due_date')
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('topic_state_due_date_idx').execute();
	await db.schema.dropIndex('learning_log_user_topic_created_at_idx').execute();
	await db.schema.dropIndex('learning_log_user_created_at_idx').execute();
	await db.schema.dropIndex('learning_log_user_topic_idx').execute();

	await db.schema.dropTable('topic_state').execute();
	await db.schema.dropTable('learning_log').execute();
}
