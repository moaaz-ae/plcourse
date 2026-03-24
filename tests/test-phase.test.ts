import { test, expect } from './fixtures/test-utils';
import { setupReviewableTopicState } from './helpers/test-data';
import { State } from '../src/lib/types';

async function setupForLearnMode(db: import('pg').Pool, userId: string): Promise<void> {
	// ts-fsrs requires stability=0 AND difficulty=0 for State.New cards
	await db.query(
		`INSERT INTO topic_state (user_id, topic_id, stability, difficulty, last_review, due_date, state, reps, lapses, scheduled_days, learning_steps)
		 VALUES ($1, 'sentences', 0, 0, NOW(), NOW(), $2, 0, 0, 0, 0)
		 ON CONFLICT (user_id, topic_id) DO UPDATE SET
		 stability = 0, difficulty = 0, last_review = NOW(), due_date = NOW(), state = $2, reps = 0, lapses = 0, scheduled_days = 0, learning_steps = 0`,
		[userId, State.New]
	);
}

test.describe('Test Phase - Learn Mode', () => {
	test.beforeEach(async ({ testUser, db }) => {
		await setupForLearnMode(db, testUser.userId);
	});

	test('Mercy rule: 3 perfect answers ends test early @smoke', async ({
		page: _page,
		lessonPage
	}) => {
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		// Three correct answers in a row should trigger mercy rule
		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
	});

	test('Mistake disables mercy rule, requires 5 questions @smoke', async ({
		page: _page,
		lessonPage
	}) => {
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		// First answer wrong
		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();

		// Then get correct answers - should need 5 total
		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();

		// After 3 questions, finish should NOT be visible
		await expect(lessonPage.finishButton).not.toBeVisible();

		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();

		// After 5 questions, finish should be visible
		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
	});

	test('Grading based on mistakes: Easy, Good, Hard, Again @smoke', async ({
		page,
		lessonPage
	}) => {
		// Test Easy grade (0 mistakes with mercy rule)
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '4');
	});
});

test.describe('Test Phase - Learn Mode Grading', () => {
	test.beforeEach(async ({ testUser, db }) => {
		await setupForLearnMode(db, testUser.userId);
	});

	test('One mistake results in Good grade (value=3)', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();

		for (let i = 0; i < 4; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 3) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '3');
	});

	test('Two mistakes results in Hard grade (value=2)', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();

		for (let i = 0; i < 3; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 2) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '2');
	});

	test('Three+ mistakes results in Again grade (value=1)', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences', { skipPractice: true });
		await lessonPage.waitForTestPhase();

		for (let i = 0; i < 3; i++) {
			await lessonPage.problem.submitWrongAnswer();
			await lessonPage.clickNext();
		}

		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '1');
	});
});

test.describe('Test Phase - Review Mode', () => {
	test.beforeEach(async ({ testUser, db }) => {
		await setupReviewableTopicState(db, testUser.userId, 'sentences', {
			stability: 10,
			difficulty: 5
		});
	});

	test('No mercy rule in review mode, always requires 5 questions @smoke', async ({
		page: _page,
		lessonPage
	}) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		// Even with 3 perfect answers, finish should not appear
		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();

		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).not.toBeVisible();

		// Need 2 more for 5 total
		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).not.toBeVisible();

		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
	});

	test('Review grading: Easy (0), Good (1), Hard (2), Again (3+) @smoke', async ({
		page,
		lessonPage
	}) => {
		// Test Easy grade (0 mistakes)
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		for (let i = 0; i < 5; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 4) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible();
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '4');
	});

	test('Review with one mistake results in Good grade', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();

		for (let i = 0; i < 4; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 3) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '3');
	});

	test('Review with two mistakes results in Hard grade', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitWrongAnswer();
		await lessonPage.clickNext();

		for (let i = 0; i < 3; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 2) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '2');
	});

	test('Review with three+ mistakes results in Again grade', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		for (let i = 0; i < 3; i++) {
			await lessonPage.problem.submitWrongAnswer();
			await lessonPage.clickNext();
		}

		await lessonPage.problem.submitCorrectAnswer();
		await lessonPage.clickNext();
		await lessonPage.problem.submitCorrectAnswer();

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await expect(page.getByTestId('grade-input')).toHaveAttribute('value', '1');
	});

	test('Finish action is resilient to rapid double submit @smoke', async ({
		page,
		testUser,
		db,
		lessonPage
	}) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForReviewPhase();

		for (let i = 0; i < 5; i++) {
			await lessonPage.problem.submitCorrectAnswer();
			if (i < 4) await lessonPage.clickNext();
		}

		await expect(lessonPage.finishButton).toBeVisible({ timeout: 5000 });
		await lessonPage.finishButton.dblclick();
		await expect(page).toHaveURL('/learn', { timeout: 10000 });

		// Verify only one learning log entry was created
		const logs = await db.query(
			`SELECT COUNT(*)::int AS count FROM learning_log WHERE user_id = $1 AND topic_id = $2`,
			[testUser.userId, 'sentences']
		);
		expect(logs.rows[0]?.count).toBe(1);
	});
});
