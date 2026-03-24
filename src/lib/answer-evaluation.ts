import type {
	AssertionJudgmentProblem,
	FormulaBuilderProblem,
	GeneratedProblem,
	McqProblem,
	TruthTableProblem
} from '$lib/types';
import {
	areFormulasEquivalent,
	parseFormula,
	evaluateFormula,
	validateFormulaComplexity
} from '$lib/logic';

// ── Normalization ────────────────────────────────────────────────────────────

export function normalizeAnswer(answer: string): string {
	return answer.normalize('NFKC').replace(/\s+/g, ' ').trim();
}

// ── JSON Parsing Helpers ─────────────────────────────────────────────────────

interface AssertionSubmission {
	judgment: 'valid' | 'invalid';
	counterexample?: Record<string, boolean>;
}

export function parseTruthTableSubmission(answer: string): Record<string, boolean> | null {
	try {
		const parsed: unknown = JSON.parse(answer);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

		const record: Record<string, boolean> = {};
		for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
			if (!/^\d+:\d+$/.test(key) || typeof value !== 'boolean') {
				return null;
			}
			record[key] = value;
		}
		return record;
	} catch {
		return null;
	}
}

export function parseAssertionSubmission(answer: string): AssertionSubmission | null {
	try {
		const parsed: unknown = JSON.parse(answer);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

		const obj = parsed as Record<string, unknown>;
		const judgment = obj.judgment;
		if (judgment !== 'valid' && judgment !== 'invalid') return null;

		let counterexample: Record<string, boolean> | undefined;
		if (obj.counterexample !== undefined) {
			const ce = obj.counterexample;
			if (!ce || typeof ce !== 'object' || Array.isArray(ce)) return null;
			const validated: Record<string, boolean> = {};
			for (const [key, value] of Object.entries(ce as Record<string, unknown>)) {
				if (typeof value !== 'boolean') return null;
				validated[key] = value;
			}
			counterexample = validated;
		}

		return { judgment, counterexample };
	} catch {
		return null;
	}
}

// ── Counterexample Validation ────────────────────────────────────────────────

export function isValidCounterexample(
	problem: AssertionJudgmentProblem,
	assignment: Record<string, boolean>
): boolean {
	const parsedPremises = problem.premises.map((premise) => parseFormula(premise));
	const parsedConclusion = parseFormula(problem.conclusion);

	if (!parsedConclusion || parsedPremises.some((premise) => !premise)) return false;

	try {
		for (const premise of parsedPremises) {
			if (!premise || !evaluateFormula(premise, assignment)) {
				return false;
			}
		}
		return !evaluateFormula(parsedConclusion, assignment);
	} catch {
		return false;
	}
}

// ── Per-Type Evaluators ──────────────────────────────────────────────────────

export function evaluateMcqAnswer(problem: McqProblem, answer: string): boolean {
	return normalizeAnswer(answer) === normalizeAnswer(problem.answer);
}

export function evaluateTruthTableAnswer(problem: TruthTableProblem, answer: string): boolean {
	const submission = parseTruthTableSubmission(answer);
	if (!submission) return false;

	const expectedTable = problem.expectedTable ?? [];
	const hiddenColumns = problem.hiddenColumns ?? [];
	if (expectedTable.length === 0 || hiddenColumns.length === 0) return false;

	for (let rowIndex = 0; rowIndex < expectedTable.length; rowIndex++) {
		const row = expectedTable[rowIndex];
		for (const colIndex of hiddenColumns) {
			if (row[colIndex] === undefined) return false;
			const key = `${rowIndex}:${colIndex}`;
			if (!(key in submission)) return false;
			if (submission[key] !== row[colIndex]) return false;
		}
	}

	return true;
}

export function evaluateAssertionAnswer(
	problem: AssertionJudgmentProblem,
	answer: string
): boolean {
	const submission = parseAssertionSubmission(answer);
	if (!submission) return false;

	const expectedValid = problem.isValid;
	const userSaysValid = submission.judgment === 'valid';
	if (userSaysValid !== expectedValid) return false;

	if (!expectedValid && problem.counterexample) {
		if (!submission.counterexample) return false;
		if (!isValidCounterexample(problem, submission.counterexample)) return false;
	}

	return true;
}

export function evaluateFormulaAnswer(problem: FormulaBuilderProblem, answer: string): boolean {
	const violation = validateFormulaComplexity(answer);
	if (violation) return false;
	return areFormulasEquivalent(answer, problem.answer);
}

// ── Unified Evaluator ────────────────────────────────────────────────────────

export function evaluateAnswer(problem: GeneratedProblem, answer: string): boolean {
	switch (problem.type) {
		case 'mcq':
			return evaluateMcqAnswer(problem, answer);
		case 'truth-table':
			return evaluateTruthTableAnswer(problem, answer);
		case 'assertion-judgment':
			return evaluateAssertionAnswer(problem, answer);
		case 'formula-builder':
			return evaluateFormulaAnswer(problem, answer);
		default:
			return false;
	}
}
