import { test, expect } from './fixtures/test-utils';
import { DIAGNOSTIC_SAFETY_LIMIT } from './page-objects/diagnostic.page';

type DiagnosticCase = {
	name: string;
	run: (diagnosticPage: import('./page-objects/diagnostic.page').DiagnosticPage) => Promise<number>;
	minAnswered: number;
};

const completionCases: DiagnosticCase[] = [
	{
		name: 'novice progression (all wrong)',
		run: (dp) => dp.completeDiagnostic(false),
		minAnswered: 1
	},
	{
		name: 'expert progression (all correct)',
		run: (dp) => dp.completeDiagnostic(true),
		minAnswered: 1
	},
	{
		name: 'mixed progression',
		run: (dp) => dp.completeDiagnosticMixed(3),
		minAnswered: 4
	}
];

test.describe('Diagnostic Flow', () => {
	test('Fresh user is redirected to /diagnostic @smoke', async ({
		page,
		testUser: _u,
		diagnosticPage
	}) => {
		await page.goto('/learn');
		await expect(page).toHaveURL('/diagnostic');
		await diagnosticPage.waitForDiagnostic();
	});

	test('Diagnostic page renders with all required elements @smoke', async ({
		page,
		diagnosticPage
	}) => {
		await diagnosticPage.goto();
		await diagnosticPage.waitForDiagnostic();

		// Header with title
		await expect(diagnosticPage.diagnosticHeader).toBeVisible();
		await expect(diagnosticPage.diagnosticHeader).toContainText('Diagnostic Assessment');

		// Question area with form
		await expect(diagnosticPage.diagnosticQuestion).toBeVisible();
		await expect(diagnosticPage.questionNumber).toBeVisible();
		await expect(diagnosticPage.problem.problemForm).toBeVisible();

		// Topic info is visible
		const topicId = await diagnosticPage.diagnosticQuestion.getAttribute('data-topic-id');
		expect(topicId).toBeTruthy();
		const topicTitle = page.getByTestId('diagnostic-topic-title');
		await expect(topicTitle).toBeVisible();
		await expect(topicTitle).not.toBeEmpty();

		// Correct answer data attribute exists
		const correctAnswer =
			await diagnosticPage.problem.problemForm.getAttribute('data-correct-answer');
		expect(correctAnswer).toBeTruthy();

		// "I Don't Know" button is visible
		await expect(diagnosticPage.iDontKnowButton).toBeVisible();
	});

	for (const { name, run, minAnswered } of completionCases) {
		test(`Diagnostic completes and redirects: ${name} @smoke`, async ({ page, diagnosticPage }) => {
			await diagnosticPage.goto();
			await diagnosticPage.waitForDiagnostic();

			const questionsAnswered = await run(diagnosticPage);
			expect(questionsAnswered).toBeGreaterThanOrEqual(minAnswered);
			expect(questionsAnswered).toBeLessThanOrEqual(DIAGNOSTIC_SAFETY_LIMIT);
			await expect(page).toHaveURL(/\/(learn|visual)$/);
		});
	}

	test('Topic state persists after diagnostic completion @smoke', async ({
		page,
		testUser,
		db,
		diagnosticPage
	}) => {
		test.slow(); // Diagnostic completion involves multiple questions

		await diagnosticPage.goto();
		await diagnosticPage.waitForDiagnostic();

		await diagnosticPage.completeDiagnostic(true);

		await expect(page).toHaveURL(/\/(learn|visual)$/);

		// Navigate away and back
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');
		await page.goto('/learn');

		// Verify we are NOT redirected back to diagnostic
		await expect(page).not.toHaveURL(/\/diagnostic/);

		// Verify DB has topic state entries
		const result = await db.query(`SELECT COUNT(*) FROM topic_state WHERE user_id = $1`, [
			testUser.userId
		]);
		expect(parseInt(result.rows[0].count)).toBeGreaterThan(0);
	});

	test('Question progression and "I Don\'t Know" button @smoke', async ({
		page,
		diagnosticPage
	}) => {
		await diagnosticPage.goto();
		await diagnosticPage.waitForDiagnostic();

		const initialNum = await diagnosticPage.questionNumber.getAttribute('data-question-number');
		expect(initialNum).toBeTruthy();

		// Submit a correct answer and verify question advances
		await diagnosticPage.problem.submitDiagnosticCorrectAnswer();

		if (page.url().includes('/diagnostic')) {
			const afterAnswerNum =
				await diagnosticPage.questionNumber.getAttribute('data-question-number');
			expect(afterAnswerNum).not.toBe(initialNum);

			// Now test "I Don't Know" button
			const beforeSkipNum =
				await diagnosticPage.questionNumber.getAttribute('data-question-number');
			await diagnosticPage.iDontKnowButton.click();

			// Wait for either navigation or question change
			await expect(async () => {
				const onDiagnostic = page.url().includes('/diagnostic');
				if (!onDiagnostic) return;
				const afterSkipNum =
					await diagnosticPage.questionNumber.getAttribute('data-question-number');
				expect(afterSkipNum).not.toBe(beforeSkipNum);
			}).toPass({ timeout: 10000 });
		}
	});
});
