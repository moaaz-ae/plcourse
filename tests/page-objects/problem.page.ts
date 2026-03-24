/**
 * ProblemPage – encapsulates problem-form UI interactions
 * (MCQ, truth table, assertion judgment, formula builder).
 */
import { type Page, type Locator, expect } from '@playwright/test';

export class ProblemPage {
	readonly page: Page;
	readonly problemForm: Locator;
	readonly submitButton: Locator;
	readonly feedbackCorrect: Locator;
	readonly feedbackWrong: Locator;

	constructor(page: Page) {
		this.page = page;
		this.problemForm = page.getByTestId('problem-form');
		this.submitButton = page.getByTestId('submit-button');
		this.feedbackCorrect = page.getByTestId('feedback-correct');
		this.feedbackWrong = page.getByTestId('feedback-wrong');
	}

	// ── State reading ────────────────────────────────────────────────────────

	async getCorrectAnswer(): Promise<string> {
		await expect(this.problemForm).toHaveAttribute('data-correct-answer', /.+/, { timeout: 5000 });
		return (await this.problemForm.getAttribute('data-correct-answer'))!;
	}

	async getProblemType(): Promise<string> {
		await expect(this.problemForm).toBeVisible({ timeout: 5000 });
		await expect(this.problemForm).toHaveAttribute('data-problem-type', /.+/, { timeout: 5000 });
		return (await this.problemForm.getAttribute('data-problem-type')) ?? 'unknown';
	}

	// ── Submit actions ───────────────────────────────────────────────────────

	async submitCorrectAnswer(): Promise<void> {
		const correctAnswer = await this.getCorrectAnswer();
		const problemType = await this.getProblemType();
		await this.fillAnswer(problemType, correctAnswer, false);

		const countBefore = await this.problemForm.getAttribute('data-submission-count');
		await this.submitButton.click();
		await expect(this.problemForm).not.toHaveAttribute(
			'data-submission-count',
			countBefore ?? '0',
			{ timeout: 5000 }
		);
		await expect(this.feedbackCorrect.or(this.feedbackWrong)).toBeVisible({ timeout: 5000 });
	}

	async submitWrongAnswer(): Promise<void> {
		const correctAnswer = await this.getCorrectAnswer();
		const problemType = await this.getProblemType();
		await this.fillAnswer(problemType, correctAnswer, true);

		const countBefore = await this.problemForm.getAttribute('data-submission-count');
		await this.submitButton.click();
		await expect(this.problemForm).not.toHaveAttribute(
			'data-submission-count',
			countBefore ?? '0',
			{ timeout: 5000 }
		);
		await expect(this.feedbackCorrect.or(this.feedbackWrong)).toBeVisible({ timeout: 5000 });
	}

	// ── Diagnostic-specific submit ───────────────────────────────────────────

	async submitDiagnosticCorrectAnswer(): Promise<void> {
		const questionNumEl = this.page.locator('[data-question-number]');
		const currentNum = await questionNumEl.getAttribute('data-question-number');

		const correctAnswer = await this.getCorrectAnswer();
		const problemType = await this.getProblemType();
		await this.fillAnswer(problemType, correctAnswer, false);
		await this.ensureDiagnosticSubmitReady(problemType);
		await this.submitButton.click();

		// Wait for either navigation away or question number change
		await expect(async () => {
			const onDiagnostic = this.page.url().includes('/diagnostic');
			if (!onDiagnostic) return; // navigated away – success
			const newNum = await questionNumEl.getAttribute('data-question-number');
			expect(newNum).not.toBe(currentNum);
		}).toPass({ timeout: 10000 });
	}

	async submitDiagnosticWrongAnswer(): Promise<void> {
		const questionNumEl = this.page.locator('[data-question-number]');
		const currentNum = await questionNumEl.getAttribute('data-question-number');

		const correctAnswer = await this.getCorrectAnswer();
		const problemType = await this.getProblemType();
		await this.fillAnswer(problemType, correctAnswer, true);
		await this.ensureDiagnosticSubmitReady(problemType);
		await this.submitButton.click();

		await expect(async () => {
			const onDiagnostic = this.page.url().includes('/diagnostic');
			if (!onDiagnostic) return;
			const newNum = await questionNumEl.getAttribute('data-question-number');
			expect(newNum).not.toBe(currentNum);
		}).toPass({ timeout: 10000 });
	}

	// ── Private helpers ──────────────────────────────────────────────────────

	private async fillAnswer(
		problemType: string,
		correctAnswer: string,
		wrong: boolean
	): Promise<void> {
		switch (problemType) {
			case 'mcq':
				await (wrong ? this.fillMcqWrong(correctAnswer) : this.fillMcq(correctAnswer));
				break;
			case 'truth-table':
				await (wrong
					? this.fillTruthTableWrong(correctAnswer)
					: this.fillTruthTable(correctAnswer));
				break;
			case 'assertion-judgment':
				await (wrong
					? this.fillAssertionJudgmentWrong(correctAnswer)
					: this.fillAssertionJudgment(correctAnswer));
				break;
			case 'formula-builder':
				await (wrong ? this.fillFormulaBuilderWrong() : this.fillFormulaBuilder(correctAnswer));
				break;
			default:
				throw new Error(`Unknown problem type: ${problemType}`);
		}
	}

	// ── MCQ ──────────────────────────────────────────────────────────────────

	private normalize(value: string): string {
		return value.normalize('NFKC').replace(/\$/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
	}

	private async fillMcq(answer: string): Promise<void> {
		const target = this.normalize(answer);
		const options = this.page.getByTestId('mcq-option');
		const count = await options.count();

		// Pass 1: exact match on data-option-value (most reliable)
		for (let i = 0; i < count; i++) {
			const option = options.nth(i);
			const optionValue = (await option.getAttribute('data-option-value')) ?? '';
			if (this.normalize(optionValue) === target) {
				await option.click();
				return;
			}
		}

		// Pass 2: exact match on visible text
		for (let i = 0; i < count; i++) {
			const option = options.nth(i);
			const optionText = (await option.textContent()) ?? '';
			if (this.normalize(optionText) === target) {
				await option.click();
				return;
			}
		}

		// Pass 3: substring match (fallback for partial answer text)
		for (let i = 0; i < count; i++) {
			const option = options.nth(i);
			const optionText = (await option.textContent()) ?? '';
			if (this.normalize(optionText).includes(target)) {
				await option.click();
				return;
			}
		}

		if (count > 0) await options.first().click();
	}

	private async fillMcqWrong(correctAnswer: string): Promise<void> {
		const target = this.normalize(correctAnswer);
		const options = this.page.getByTestId('mcq-option');
		const count = await options.count();

		for (let i = 0; i < count; i++) {
			const optionValue = (await options.nth(i).getAttribute('data-option-value')) ?? '';
			if (this.normalize(optionValue) !== target) {
				await options.nth(i).click();
				return;
			}
		}
		if (count > 0) await options.first().click();
	}

	// ── Truth table ──────────────────────────────────────────────────────────

	private async fillTruthTable(correctAnswer: string): Promise<void> {
		const answers = correctAnswer.split(',').map((v) => v.trim().toUpperCase() === 'T');
		const cells = this.page.locator('[data-testid^="truth-table-cell-"] button');
		const cellCount = await cells.count();

		for (let i = 0; i < Math.min(answers.length, cellCount); i++) {
			await this.setTruthTableCell(cells.nth(i), answers[i]);
		}
	}

	private async fillTruthTableWrong(correctAnswer: string): Promise<void> {
		const answers = correctAnswer.split(',').map((v) => v.trim().toUpperCase() === 'T');
		const cells = this.page.locator('[data-testid^="truth-table-cell-"] button');
		const cellCount = await cells.count();

		for (let i = 0; i < Math.min(answers.length, cellCount); i++) {
			await this.setTruthTableCell(cells.nth(i), !answers[i]);
		}
	}

	private async setTruthTableCell(cell: Locator, targetValue: boolean): Promise<void> {
		const targetText = targetValue ? 'T' : 'F';

		for (let i = 0; i < 3; i++) {
			const current = ((await cell.textContent()) ?? '').trim();
			if (current === targetText) return;
			await cell.click();
			await expect(cell).not.toHaveText(current, { timeout: 2000 });
		}
		await expect(cell).toHaveText(targetText, { timeout: 2000 });
	}

	private async ensureTruthTableCellAnswered(cell: Locator): Promise<void> {
		const text = ((await cell.textContent()) ?? '').trim();
		if (text !== '?') return;
		await cell.click();
		await expect(cell).not.toHaveText('?', { timeout: 2000 });
	}

	// ── Assertion judgment ────────────────────────────────────────────────────

	private async fillAssertionJudgment(correctAnswer: string): Promise<void> {
		const isValid = correctAnswer.toLowerCase() === 'valid';
		await this.page.getByTestId(isValid ? 'judgment-valid' : 'judgment-invalid').click();

		if (!isValid) {
			const counterexampleStr = await this.problemForm.getAttribute('data-counterexample');
			if (counterexampleStr) {
				try {
					const counterexample = JSON.parse(counterexampleStr) as Record<string, boolean>;
					for (const [variable, value] of Object.entries(counterexample)) {
						const cell = this.page.locator(`[data-testid="counterexample-${variable}"] button`);
						if ((await cell.count()) === 0) continue;
						await expect(cell).toBeVisible({ timeout: 5000 });
						const currentText = ((await cell.textContent()) ?? '').trim();
						const currentValue = currentText === 'T';
						if (currentValue !== value) {
							await cell.click();
							await expect(cell).not.toHaveText(currentText, { timeout: 2000 });
						}
					}
				} catch {
					// counterexample parsing failed – continue
				}
			}
		}
	}

	private async fillAssertionJudgmentWrong(correctAnswer: string): Promise<void> {
		const isValid = correctAnswer.toLowerCase() === 'valid';
		await this.page.getByTestId(isValid ? 'judgment-invalid' : 'judgment-valid').click();
	}

	// ── Formula builder ──────────────────────────────────────────────────────

	private async fillFormulaBuilder(correctAnswer: string): Promise<void> {
		const clearButton = this.page.getByTestId('clear-button');
		if ((await clearButton.count()) > 0) await clearButton.click();

		const tokens = correctAnswer
			.split(/\s+/)
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		for (const token of tokens) {
			const button = this.page.getByTestId(`symbol-${token}`);
			if ((await button.count()) > 0) await button.click();
		}
	}

	private async fillFormulaBuilderWrong(): Promise<void> {
		const clearButton = this.page.getByTestId('clear-button');
		if ((await clearButton.count()) > 0) await clearButton.click();

		const firstVar = this.page.locator('[data-testid^="symbol-"]').first();
		if ((await firstVar.count()) > 0) {
			await firstVar.click();
			await firstVar.click();
		}
	}

	// ── Diagnostic submit readiness ──────────────────────────────────────────

	private async ensureDiagnosticSubmitReady(problemType: string): Promise<void> {
		if (await this.submitButton.isEnabled()) return;

		switch (problemType) {
			case 'mcq': {
				const firstOption = this.page.getByTestId('mcq-option').first();
				if (await firstOption.isVisible()) await firstOption.click();
				break;
			}
			case 'truth-table': {
				const cells = this.page.locator('[data-testid^="truth-table-cell-"] button');
				const count = await cells.count();
				for (let i = 0; i < count; i++) {
					await this.ensureTruthTableCellAnswered(cells.nth(i));
				}
				break;
			}
			case 'assertion-judgment': {
				const validButton = this.page.getByTestId('judgment-valid');
				if (await validButton.isVisible()) await validButton.click();
				break;
			}
			case 'formula-builder': {
				const firstSymbol = this.page.locator('[data-testid^="symbol-"]').first();
				if (await firstSymbol.isVisible()) await firstSymbol.click();
				break;
			}
		}
	}
}
