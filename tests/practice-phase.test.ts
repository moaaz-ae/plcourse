import { test, expect } from './fixtures/test-utils';
import { setupNewTopic } from './helpers/test-data';

test.describe('Learn Phase', () => {
	test.beforeEach(async ({ testUser, db }) => {
		await setupNewTopic(db, testUser.userId, 'sentences');
	});

	test('Content slide navigation and controls @smoke', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();

		// Back button should be disabled on first slide
		await expect(lessonPage.prevButton).toBeDisabled();

		// Slide indicators should be visible
		await expect(lessonPage.slideIndicators).toBeVisible();
		await expect(page.getByTestId('slide-indicator-progress')).toBeVisible();

		// If on content slide, Continue should be enabled immediately
		if (await lessonPage.isContentSlide()) {
			await expect(lessonPage.nextButton).toBeEnabled({ timeout: 5000 });

			// Navigate forward
			await lessonPage.clickNext();
			await expect(lessonPage.prevButton).toBeEnabled({ timeout: 5000 });

			// Navigate back
			await lessonPage.clickBack();
			await expect(lessonPage.prevButton).toBeDisabled({ timeout: 5000 });
			await expect(lessonPage.practiceContent).toBeVisible();
		} else {
			// On problem slide, next should be disabled until answer
			await expect(lessonPage.nextButton).toBeDisabled();
		}
	});

	test('Correct answer progression and scoring @smoke', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();
		await lessonPage.navigateToProblem();

		// Submit button should be disabled initially
		await expect(lessonPage.problem.submitButton).toBeDisabled();

		// Score indicator should be visible with empty dots
		await expect(lessonPage.scoreIndicator).toBeVisible();
		const dot0 = page.getByTestId('score-dot-0');
		const dot1 = page.getByTestId('score-dot-1');
		await expect(dot0).toHaveAttribute('data-filled', 'false');
		await expect(dot1).toHaveAttribute('data-filled', 'false');

		// First correct answer
		await lessonPage.problem.submitCorrectAnswer();
		await expect(lessonPage.problem.feedbackCorrect).toBeVisible();
		await expect(lessonPage.problem.submitButton).toBeDisabled();

		// Score should be 1, first dot filled
		const score = await lessonPage.getScore();
		expect(score).toBe(1);
		await expect(dot0).toHaveAttribute('data-filled', 'true');
		await expect(dot1).toHaveAttribute('data-filled', 'false');

		// Next button should show "Next Question"
		await expect(lessonPage.nextButton).toBeEnabled({ timeout: 5000 });
		await expect(lessonPage.nextButton).toContainText(/Next Question/i);

		// Advance to next problem
		await lessonPage.nextButton.click();
		await expect(lessonPage.problemSlide).toBeVisible({ timeout: 5000 });
		await expect(lessonPage.problem.feedbackCorrect).not.toBeVisible();

		// Second correct answer completes directive
		await lessonPage.problem.submitCorrectAnswer();
		await expect(lessonPage.problem.feedbackCorrect).toBeVisible();
		await expect(lessonPage.nextButton).toContainText(/Continue|Start Test/i, { timeout: 5000 });
	});

	test('Wrong answer flow: hint, walkthrough, and score reset @smoke', async ({
		page,
		lessonPage
	}) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();
		await lessonPage.navigateToProblem();

		// First get a correct answer to have score > 0
		await lessonPage.problem.submitCorrectAnswer();
		await expect(lessonPage.problem.feedbackCorrect).toBeVisible();
		let score = await lessonPage.getScore();
		expect(score).toBe(1);

		// Advance to next problem
		await lessonPage.nextButton.click();
		await expect(lessonPage.problemSlide).toBeVisible({ timeout: 5000 });
		await expect(lessonPage.problem.feedbackCorrect).not.toBeVisible({ timeout: 5000 });

		// First wrong answer: shows hint, resets score to 0
		await lessonPage.problem.submitWrongAnswer();
		await expect(lessonPage.problem.feedbackWrong).toBeVisible();
		await expect(lessonPage.hintPanel).toBeVisible();
		await expect(lessonPage.walkthroughPanel).not.toBeVisible();

		score = await lessonPage.getScore();
		expect(score).toBe(0);

		const phase = await lessonPage.getAttemptPhase();
		expect(phase).toBe('showHint');

		// Can retry and get correct (still score 0)
		await lessonPage.problem.submitCorrectAnswer();
		await expect(lessonPage.problem.feedbackCorrect).toBeVisible();
		score = await lessonPage.getScore();
		expect(score).toBe(0);
		await expect(lessonPage.nextButton).toContainText(/Next Question/i);

		// Advance and test second wrong shows walkthrough
		await lessonPage.nextButton.click();
		await expect(lessonPage.problemSlide).toBeVisible({ timeout: 5000 });

		await lessonPage.problem.submitWrongAnswer();
		await expect(lessonPage.hintPanel).toBeVisible();

		await lessonPage.problem.submitWrongAnswer();
		await expect(lessonPage.walkthroughPanel).toBeVisible();

		const walkthroughPhase = await lessonPage.getAttemptPhase();
		expect(walkthroughPhase).toBe('showWalkthrough');

		// Must enter correct answer in walkthrough phase to proceed
		await lessonPage.problem.submitCorrectAnswer();
		await expect(lessonPage.problem.feedbackCorrect).toBeVisible();
		await expect(lessonPage.nextButton).toContainText(/Next Question/i);
	});

	test('Exit returns to dashboard', async ({ page, lessonPage }) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();

		await lessonPage.clickExit();
		await expect(page).toHaveURL('/learn', { timeout: 10000 });
	});

	test('Completing practice phase transitions to test phase @smoke', async ({
		page: _page,
		lessonPage
	}) => {
		await lessonPage.goto('sentences');
		await lessonPage.waitForPracticePhase();

		await lessonPage.completePracticePhase();

		await expect(lessonPage.testContent).toBeVisible({ timeout: 10000 });
	});
});
