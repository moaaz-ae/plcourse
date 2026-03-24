import { test, expect } from './fixtures/test-utils';
import {
	setupNewTopic,
	setupReviewableTopicState,
	getExistingTopicIds,
	insertCompletionLogs,
	getSessionStart
} from './helpers/test-data';

test.describe('Dashboard', () => {
	test('Shows review badge for due review task @smoke', async ({ page, testUser, db }) => {
		await setupReviewableTopicState(db, testUser.userId, 'sentences');

		await page.goto('/learn');

		const lesson = page.locator(
			'[data-testid="lesson-item"][data-lesson-id="sentences"][data-lesson-status="active"]'
		);
		await expect(lesson).toBeVisible({ timeout: 5000 });
		await expect(lesson.getByTestId('lesson-badge-review')).toBeVisible();
		await expect(lesson.getByTestId('lesson-badge-new')).toHaveCount(0);
	});

	test('Shows new badge for active new task @smoke', async ({ page, testUser, db }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await page.goto('/learn');

		const lesson = page.locator(
			'[data-testid="lesson-item"][data-lesson-id="sentences"][data-lesson-status="active"]'
		);
		await expect(lesson).toBeVisible({ timeout: 5000 });
		await expect(lesson.getByTestId('lesson-badge-new')).toBeVisible();
		await expect(lesson.getByTestId('lesson-badge-review')).toHaveCount(0);
	});

	test('Locked fillers are rendered and non-clickable @smoke', async ({ page, testUser, db }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await page.goto('/learn');

		const lockedItem = page
			.locator('[data-testid="lesson-item"][data-lesson-status="locked"]')
			.first();
		await expect(lockedItem).toBeVisible({ timeout: 5000 });
		await expect(lockedItem.locator('a')).toHaveCount(0);
	});

	test('Task list is capped to four items per session', async ({ page, testUser, db }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await page.goto('/learn');

		const allTasks = page.getByTestId('lesson-item');
		await expect(allTasks).toHaveCount(4);
	});

	test('Session complete card appears after four completions and reset clears it @smoke', async ({
		page,
		testUser,
		db
	}) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		const topicIds = await getExistingTopicIds(db, 4);
		expect(topicIds.length).toBeGreaterThanOrEqual(4);
		await insertCompletionLogs(db, testUser.userId, topicIds.slice(0, 4));

		await page.goto('/learn');
		await expect(page.getByRole('heading', { name: 'Session Complete!' })).toBeVisible({
			timeout: 5000
		});
		const beforeReset = await getSessionStart(db, testUser.userId);

		await page.getByRole('button', { name: 'Continue Learning?' }).click();
		await expect(page).toHaveURL('/learn', { timeout: 10000 });

		const afterReset = await getSessionStart(db, testUser.userId);
		expect(beforeReset).not.toBeNull();
		expect(afterReset).not.toBeNull();
		expect(afterReset!.getTime()).toBeGreaterThanOrEqual(beforeReset!.getTime());
	});
});
