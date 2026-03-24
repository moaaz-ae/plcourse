/**
 * LessonPage – lesson navigation and phase management.
 */
import { type Page, type Locator, expect } from '@playwright/test';
import { ProblemPage } from './problem.page';

export class LessonPage {
	readonly page: Page;
	readonly problem: ProblemPage;
	readonly lessonPage: Locator;
	readonly practiceContent: Locator;
	readonly testContent: Locator;
	readonly contentSlide: Locator;
	readonly problemSlide: Locator;
	readonly nextButton: Locator;
	readonly prevButton: Locator;
	readonly exitButton: Locator;
	readonly finishButton: Locator;
	readonly hintPanel: Locator;
	readonly walkthroughPanel: Locator;
	readonly scoreIndicator: Locator;
	readonly slideIndicators: Locator;
	readonly loadingProblem: Locator;

	constructor(page: Page) {
		this.page = page;
		this.problem = new ProblemPage(page);
		this.lessonPage = page.getByTestId('lesson-page');
		this.practiceContent = page.getByTestId('practice-content');
		this.testContent = page.getByTestId('test-content');
		this.contentSlide = page.getByTestId('content-slide');
		this.problemSlide = page.getByTestId('problem-slide');
		this.nextButton = page.getByTestId('next-button');
		this.prevButton = page.getByTestId('prev-button');
		this.exitButton = page.getByTestId('exit-button');
		this.finishButton = page.getByTestId('finish-button');
		this.hintPanel = page.getByTestId('hint-panel');
		this.walkthroughPanel = page.getByTestId('walkthrough-panel-forced');
		this.scoreIndicator = page.getByTestId('score-indicator');
		this.slideIndicators = page.getByTestId('slide-indicators');
		this.loadingProblem = page.getByTestId('loading-problem');
	}

	// ── Navigation actions ───────────────────────────────────────────────────

	async goto(topicId: string, options?: { skipPractice?: boolean }) {
		const url = options?.skipPractice ? `/learn/${topicId}?skipPractice=1` : `/learn/${topicId}`;
		await this.page.goto(url);
	}

	async clickNext(): Promise<void> {
		await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
		await this.nextButton.click();
	}

	async clickBack(): Promise<void> {
		await this.prevButton.click();
	}

	async clickExit(): Promise<void> {
		await this.exitButton.click();
	}

	async clickFinish(): Promise<void> {
		await expect(this.finishButton).toBeEnabled({ timeout: 5000 });
		await this.finishButton.click();
	}

	// ── Phase waits ──────────────────────────────────────────────────────────

	async waitForPracticePhase(): Promise<void> {
		await expect(
			this.page.locator('[data-testid="lesson-page"][data-phase="practice"]')
		).toBeVisible({ timeout: 15000 });
		await expect(this.practiceContent).toBeVisible({ timeout: 5000 });
	}

	async waitForTestPhase(): Promise<void> {
		await expect(this.testContent).toBeVisible({ timeout: 15000 });
	}

	async waitForReviewPhase(): Promise<void> {
		await expect(this.testContent).toBeVisible({ timeout: 15000 });
	}

	// ── State reading ────────────────────────────────────────────────────────

	async getScore(): Promise<number> {
		const scoreAttr = await this.practiceContent.getAttribute('data-score');
		return parseInt(scoreAttr ?? '0', 10);
	}

	async getAttemptPhase(): Promise<string> {
		return (await this.practiceContent.getAttribute('data-attempt-phase')) ?? 'answering';
	}

	// ── Slide detection ──────────────────────────────────────────────────────

	async isProblemSlide(): Promise<boolean> {
		return (await this.problemSlide.count()) > 0;
	}

	async isContentSlide(): Promise<boolean> {
		return (await this.contentSlide.count()) > 0;
	}

	async navigateToProblem(): Promise<boolean> {
		for (let i = 0; i < 20; i++) {
			if (await this.isProblemSlide()) return true;
			const buttonCount = await this.nextButton.count();
			if (buttonCount === 0 || !(await this.nextButton.isEnabled())) return false;

			await this.nextButton.click();
			await expect(this.problemSlide.or(this.contentSlide)).toBeVisible({ timeout: 5000 });
		}
		return await this.isProblemSlide();
	}

	// ── Phase completion ─────────────────────────────────────────────────────

	async completePracticePhase(): Promise<void> {
		await this.waitForPracticePhase();

		for (let step = 0; step < 200; step++) {
			const phase = await this.lessonPage.getAttribute('data-phase');
			if (phase === 'test') return;

			if (await this.testContent.isVisible()) return;

			if (await this.loadingProblem.isVisible()) {
				await expect(this.loadingProblem).toBeHidden({ timeout: 5000 });
			}

			await expect(
				this.contentSlide
					.or(this.problemSlide)
					.or(this.testContent)
					.or(this.page.getByTestId('test-header'))
			).toBeVisible({ timeout: 10000 });

			if (await this.testContent.isVisible()) return;
			if (await this.page.getByTestId('test-header').isVisible()) return;

			if (await this.nextButton.isVisible()) {
				const buttonText = await this.nextButton.textContent();
				if (buttonText?.includes('Start Test') && (await this.nextButton.isEnabled())) {
					await this.nextButton.click();
					await this.waitForTestPhase();
					return;
				}
			}

			if (await this.problem.feedbackCorrect.isVisible()) {
				await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
				await this.nextButton.click();
				await expect(this.problem.feedbackCorrect).toBeHidden({ timeout: 3000 });
				continue;
			}

			if (await this.problem.feedbackWrong.isVisible()) {
				await this.problem.submitCorrectAnswer();
				await expect(this.problem.feedbackCorrect).toBeVisible({ timeout: 5000 });
				continue;
			}

			if (await this.isContentSlide()) {
				await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
				await this.nextButton.click();
				continue;
			}

			if (await this.isProblemSlide()) {
				await this.problem.submitCorrectAnswer();
				continue;
			}

			const buttonCount = await this.nextButton.count();
			if (buttonCount > 0 && (await this.nextButton.isEnabled())) {
				await this.nextButton.click();
			}
		}

		throw new Error('Failed to complete practice phase within 200 steps');
	}

	async completeTestPhase(): Promise<void> {
		await this.waitForTestPhase();

		for (let step = 0; step < 20; step++) {
			if (await this.finishButton.isVisible()) return;

			await this.problem.submitCorrectAnswer();

			if (await this.finishButton.isVisible()) return;

			await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
			await this.nextButton.click();
			await expect(this.nextButton).toBeDisabled({ timeout: 5000 });
		}

		throw new Error('Failed to complete test phase within 20 steps');
	}
}
