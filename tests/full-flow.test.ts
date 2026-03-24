import { test, expect } from './fixtures/test-utils';
import {
	setupNewTopic,
	setupReviewableTopicState,
	setupRelearningTopicState,
	getTopicState,
	clearUserTopics
} from './helpers/test-data';
import { State } from '../src/lib/types';

test.describe('Full User Flows', () => {
	test('New user completes full journey from diagnostic to lesson completion @smoke', async ({
		page,
		testUser: _u,
		lessonPage,
		diagnosticPage
	}) => {
		test.slow(); // Full E2E journey through diagnostic + practice + test phases

		await page.goto('/learn');
		await expect(page).toHaveURL('/diagnostic');

		await diagnosticPage.completeDiagnostic(false);

		await expect(page).toHaveURL(/\/(learn|visual)$/);

		await page.goto('/learn');

		const lessonLink = page.locator('a[href^="/learn/"]').first();
		await expect(lessonLink).toBeVisible({ timeout: 5000 });
		await lessonLink.click();

		await lessonPage.waitForPracticePhase();
		await lessonPage.completePracticePhase();
		await lessonPage.waitForTestPhase();
		await lessonPage.completeTestPhase();
		await lessonPage.clickFinish();

		await expect(page).toHaveURL('/learn', { timeout: 10000 });
	});

	test('User with due reviews sees and completes review @smoke', async ({
		page,
		testUser,
		db,
		lessonPage
	}) => {
		await setupReviewableTopicState(db, testUser.userId, 'sentences');

		await page.goto('/learn');

		const reviewLink = page.locator('a[href="/learn/sentences"]').first();
		await expect(reviewLink).toBeVisible({ timeout: 5000 });
		await reviewLink.click();

		await lessonPage.waitForReviewPhase();

		for (let i = 0; i < 5; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 4) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await lessonPage.clickFinish();
		await expect(page).toHaveURL('/learn', { timeout: 10000 });
	});

	test('Page refresh during lesson restarts lesson', async ({ page, testUser, db, lessonPage }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();

		const canAdvance =
			(await lessonPage.nextButton.count()) > 0 && (await lessonPage.nextButton.isEnabled());
		if (canAdvance) {
			await lessonPage.nextButton.click();
			await expect(lessonPage.practiceContent).toBeVisible({ timeout: 5000 });
		}

		await page.reload();
		await page.waitForLoadState('domcontentloaded');

		await lessonPage.waitForPracticePhase();
	});

	test('Exit and return restarts lesson', async ({ page, testUser, db, lessonPage }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();

		await lessonPage.clickExit();
		await expect(page).toHaveURL('/learn');

		const lessonLink = page.locator('a[href="/learn/sentences"]').first();
		await expect(lessonLink).toBeVisible({ timeout: 5000 });
		await lessonLink.click();

		await lessonPage.waitForPracticePhase();
	});

	test('Completing lesson updates topic to Review state @smoke', async ({
		page,
		testUser,
		db,
		lessonPage
	}) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();
		await lessonPage.completePracticePhase();
		await lessonPage.waitForTestPhase();
		await lessonPage.completeTestPhase();
		await lessonPage.clickFinish();

		await expect(page).toHaveURL('/learn', { timeout: 10000 });

		const state = await getTopicState(db, testUser.userId, 'sentences');
		expect(state).not.toBeNull();
		expect(state!.state).toBe(State.Review);
		expect(state!.stability).toBeGreaterThan(0);
	});

	test('Failed review transitions topic to Relearning state @smoke', async ({
		page,
		testUser,
		db,
		lessonPage
	}) => {
		await setupReviewableTopicState(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		for (let i = 0; i < 5; i++) {
			await lessonPage.problem.submitWrongAnswer();
			if (i < 4) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await lessonPage.clickFinish();
		await expect(page).toHaveURL('/learn', { timeout: 15000 });

		const state = await getTopicState(db, testUser.userId, 'sentences');
		expect(state).not.toBeNull();
		expect(state!.state).toBe(State.Relearning);
	});

	test('Relearning topic shows Learn Phase @smoke', async ({
		page: _page,
		testUser,
		db,
		lessonPage
	}) => {
		await setupRelearningTopicState(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();
	});
});

test.describe('Edge Case Flows', () => {
	test('Expert user sees state after diagnostic', async ({
		page,
		testUser,
		db,
		diagnosticPage
	}) => {
		await clearUserTopics(db, testUser.userId);

		await diagnosticPage.goto();
		await diagnosticPage.completeDiagnostic(true);

		await expect(page).toHaveURL(/\/(learn|visual)$/);
		await expect(page.locator('main')).toBeVisible();
	});

	test('Can navigate directly to lesson URL', async ({ page: _page, testUser, db, lessonPage }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();
	});

	test('Invalid topic URL shows 404 error @smoke', async ({ page, testUser: _u }) => {
		await page.goto('/learn/invalid_topic_xyz');

		await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
		await expect(page.locator('p')).toContainText('Topic not found');
	});
});
