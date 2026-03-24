import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('topic')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('title', 'text', (col) => col.notNull())
		.addColumn('problems', 'jsonb', (col) => col.notNull().defaultTo('[]'))
		.addColumn('rendered_problems', 'jsonb', (col) => col.notNull().defaultTo('[]'))
		.addColumn('depth', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('topological_rank', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('is_milestone', 'boolean', (col) => col.notNull().defaultTo(false))
		.addColumn('lesson_markdown', 'text')
		.addColumn('lesson_slides', 'jsonb', (col) => col.notNull().defaultTo('[]'))
		.addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
		.execute();

	await db.schema
		.createTable('topic_prerequisite')
		.addColumn('from_topic_id', 'text', (col) =>
			col.notNull().references('topic.id').onDelete('cascade')
		)
		.addColumn('to_topic_id', 'text', (col) =>
			col.notNull().references('topic.id').onDelete('cascade')
		)
		.addColumn('weight', 'real', (col) => col.notNull().defaultTo(0))
		.addPrimaryKeyConstraint('topic_prerequisite_pk', ['from_topic_id', 'to_topic_id'])
		.execute();

	await db.schema
		.createIndex('topic_prerequisite_to_idx')
		.on('topic_prerequisite')
		.column('to_topic_id')
		.execute();

	await db.schema
		.createIndex('topic_prerequisite_from_idx')
		.on('topic_prerequisite')
		.column('from_topic_id')
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('topic_prerequisite_from_idx').ifExists().execute();
	await db.schema.dropIndex('topic_prerequisite_to_idx').ifExists().execute();

	await db.schema.dropTable('topic_prerequisite').ifExists().execute();
	await db.schema.dropTable('topic').ifExists().execute();
}
