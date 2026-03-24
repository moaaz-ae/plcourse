/**
 * DiagnosticPage – diagnostic assessment flow interactions.
 */
import { type Page, type Locator, expect } from '@playwright/test';
import { ProblemPage } from './problem.page';

export const DIAGNOSTIC_SAFETY_LIMIT = 25;

export class DiagnosticPage {
	readonly page: Page;
	readonly problem: ProblemPage;
	readonly diagnosticPage: Locator;
	readonly diagnosticHeader: Locator;
	readonly diagnosticQuestion: Locator;
	readonly questionNumber: Locator;
	readonly iDontKnowButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.problem = new ProblemPage(page);
		this.diagnosticPage = page.getByTestId('diagnostic-page');
		this.diagnosticHeader = page.getByTestId('diagnostic-header');
		this.diagnosticQuestion = page.getByTestId('diagnostic-question');
		this.questionNumber = page.locator('[data-question-number]');
		this.iDontKnowButton = page.getByTestId('i-dont-know-button');
	}

	async goto() {
		await this.page.goto('/diagnostic');
	}

	async waitForDiagnostic(): Promise<void> {
		await expect(this.diagnosticPage).toBeVisible({ timeout: 10000 });
	}

	async waitForQuestion(): Promise<boolean> {
		if (!this.page.url().includes('/diagnostic')) return false;

		try {
			await expect(this.diagnosticQuestion).toBeVisible({ timeout: 5000 });
			await expect(this.problem.submitButton).toBeVisible({ timeout: 5000 });
			return true;
		} catch {
			return false;
		}
	}

	async completeDiagnostic(answerCorrectly: boolean): Promise<number> {
		let questionsAnswered = 0;

		while (questionsAnswered < DIAGNOSTIC_SAFETY_LIMIT) {
			if (!this.page.url().includes('/diagnostic')) break;
			if (!(await this.waitForQuestion())) break;

			try {
				if (answerCorrectly) {
					await this.problem.submitDiagnosticCorrectAnswer();
				} else {
					await this.problem.submitDiagnosticWrongAnswer();
				}
				questionsAnswered++;
			} catch {
				break;
			}
		}

		return questionsAnswered;
	}

	async completeDiagnosticMixed(correctCount: number): Promise<number> {
		let questionsAnswered = 0;

		while (questionsAnswered < DIAGNOSTIC_SAFETY_LIMIT) {
			if (!this.page.url().includes('/diagnostic')) break;
			if (!(await this.waitForQuestion())) break;

			try {
				if (questionsAnswered < correctCount) {
					await this.problem.submitDiagnosticCorrectAnswer();
				} else {
					await this.problem.submitDiagnosticWrongAnswer();
				}
				questionsAnswered++;
			} catch {
				break;
			}
		}

		return questionsAnswered;
	}
}
