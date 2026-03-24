/**
 * Central test fixture – composes DB, auth, and page-object fixtures.
 */
import { test as base, expect } from '@playwright/test';
import { Pool } from 'pg';
import { createTestUserAndGetCookie } from './auth-helper';
import { cleanupTestUser } from '../helpers/test-data';
import { LessonPage } from '../page-objects/lesson.page';
import { DiagnosticPage } from '../page-objects/diagnostic.page';

function getRequired(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} environment variable is not set`);
	return value;
}

function getTestDatabaseUrl(): string {
	const host = getRequired('POSTGRES_HOST');
	const port = getRequired('POSTGRES_PORT');
	const user = getRequired('POSTGRES_USER');
	const password = getRequired('POSTGRES_PASSWORD');
	const database = getRequired('POSTGRES_DB');
	return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}

type WorkerFixtures = {
	db: Pool;
};

type TestFixtures = {
	testUser: { userId: string; email: string };
	lessonPage: LessonPage;
	diagnosticPage: DiagnosticPage;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
	db: [
		async ({}, use) => {
			const pool = new Pool({ connectionString: getTestDatabaseUrl() });
			await use(pool);
			await pool.end();
		},
		{ scope: 'worker' }
	],

	testUser: async ({ page, db }, use) => {
		const timestamp = Date.now();
		const random = Math.random().toString(36).slice(2, 8);
		const email = `test-${timestamp}-${random}@test.local`;

		const cookie = await createTestUserAndGetCookie(email, 'test1234', 'E2E Test User');
		await page.context().addCookies([cookie]);

		const result = await db.query(`SELECT id FROM "user" WHERE email = $1`, [email]);
		const userId = result.rows[0]?.id;
		if (!userId) throw new Error('User created but not found in database');

		await use({ userId, email });
		await cleanupTestUser(db, userId);
	},

	lessonPage: async ({ page }, use) => {
		await use(new LessonPage(page));
	},

	diagnosticPage: async ({ page }, use) => {
		await use(new DiagnosticPage(page));
	}
});

export { expect };
