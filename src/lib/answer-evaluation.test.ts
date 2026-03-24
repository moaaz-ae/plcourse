import { describe, expect, it } from 'vitest';
import {
	normalizeAnswer,
	evaluateMcqAnswer,
	evaluateTruthTableAnswer,
	evaluateAssertionAnswer,
	evaluateFormulaAnswer,
	evaluateAnswer,
	parseTruthTableSubmission,
	parseAssertionSubmission,
	isValidCounterexample
} from './answer-evaluation';
import type {
	McqProblem,
	TruthTableProblem,
	AssertionJudgmentProblem,
	FormulaBuilderProblem
} from '$lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const mcqProblem: McqProblem = {
	type: 'mcq',
	question: 'What is P?',
	answer: 'True',
	hint: '',
	walkthrough: '',
	options: ['True', 'False']
};

const truthTableProblem: TruthTableProblem = {
	type: 'truth-table',
	question: 'Fill in the table',
	answer: 'T,F',
	hint: '',
	walkthrough: '',
	headers: ['$P$', '$\\neg P$'],
	expectedTable: [
		[true, false],
		[false, true]
	],
	hiddenColumns: [1]
};

const assertionValidProblem: AssertionJudgmentProblem = {
	type: 'assertion-judgment',
	question: 'Is this valid?',
	answer: 'valid',
	hint: '',
	walkthrough: '',
	premises: ['$P \\to Q$', '$P$'],
	conclusion: '$Q$',
	isValid: true
};

const assertionInvalidProblem: AssertionJudgmentProblem = {
	type: 'assertion-judgment',
	question: 'Is this valid?',
	answer: 'invalid',
	hint: '',
	walkthrough: '',
	premises: ['$P \\to Q$'],
	conclusion: '$P$',
	isValid: false,
	counterexample: { P: false, Q: true }
};

const formulaProblem: FormulaBuilderProblem = {
	type: 'formula-builder',
	question: 'Build the formula',
	answer: 'P \\land Q',
	hint: '',
	walkthrough: '',
	variableMap: { $P$: 'P', $Q$: 'Q' }
};

// ── normalizeAnswer ──────────────────────────────────────────────────────────

describe('normalizeAnswer', () => {
	it('trims whitespace', () => {
		expect(normalizeAnswer('  hello  ')).toBe('hello');
	});

	it('collapses multiple spaces', () => {
		expect(normalizeAnswer('a   b   c')).toBe('a b c');
	});

	it('applies NFKC normalization', () => {
		// ﬁ (U+FB01) → fi
		expect(normalizeAnswer('ﬁnd')).toBe('find');
	});
});

// ── parseTruthTableSubmission ────────────────────────────────────────────────

describe('parseTruthTableSubmission', () => {
	it('parses valid submission', () => {
		const result = parseTruthTableSubmission('{"0:1":true,"1:1":false}');
		expect(result).toEqual({ '0:1': true, '1:1': false });
	});

	it('returns null for invalid JSON', () => {
		expect(parseTruthTableSubmission('not json')).toBeNull();
	});

	it('returns null for array', () => {
		expect(parseTruthTableSubmission('[1,2,3]')).toBeNull();
	});

	it('returns null for non-boolean values', () => {
		expect(parseTruthTableSubmission('{"0:1":"true"}')).toBeNull();
	});

	it('returns null for invalid key format', () => {
		expect(parseTruthTableSubmission('{"abc":true}')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseTruthTableSubmission('')).toBeNull();
	});
});

// ── parseAssertionSubmission ─────────────────────────────────────────────────

describe('parseAssertionSubmission', () => {
	it('parses valid submission', () => {
		const result = parseAssertionSubmission('{"judgment":"valid"}');
		expect(result).toEqual({ judgment: 'valid' });
	});

	it('parses valid submission with counterexample', () => {
		const result = parseAssertionSubmission(
			'{"judgment":"invalid","counterexample":{"P":false,"Q":true}}'
		);
		expect(result).toEqual({
			judgment: 'invalid',
			counterexample: { P: false, Q: true }
		});
	});

	it('returns null for invalid judgment', () => {
		expect(parseAssertionSubmission('{"judgment":"maybe"}')).toBeNull();
	});

	it('returns null for invalid JSON', () => {
		expect(parseAssertionSubmission('not json')).toBeNull();
	});

	it('returns null for array counterexample', () => {
		expect(parseAssertionSubmission('{"judgment":"invalid","counterexample":[1]}')).toBeNull();
	});

	it('returns null for non-boolean counterexample values', () => {
		expect(
			parseAssertionSubmission('{"judgment":"invalid","counterexample":{"P":"true"}}')
		).toBeNull();
	});
});

// ── isValidCounterexample ────────────────────────────────────────────────────

describe('isValidCounterexample', () => {
	it('accepts a valid counterexample', () => {
		expect(isValidCounterexample(assertionInvalidProblem, { P: false, Q: true })).toBe(true);
	});

	it('rejects when premises are not all true', () => {
		// P→Q with P=true, Q=false: premise P→Q is false
		expect(isValidCounterexample(assertionInvalidProblem, { P: true, Q: false })).toBe(false);
	});

	it('rejects when conclusion is true', () => {
		// P→Q with P=true, Q=true: conclusion P is true
		expect(isValidCounterexample(assertionInvalidProblem, { P: true, Q: true })).toBe(false);
	});
});

// ── evaluateMcqAnswer ────────────────────────────────────────────────────────

describe('evaluateMcqAnswer', () => {
	it('accepts correct answer', () => {
		expect(evaluateMcqAnswer(mcqProblem, 'True')).toBe(true);
	});

	it('accepts answer with extra spaces', () => {
		expect(evaluateMcqAnswer(mcqProblem, '  True  ')).toBe(true);
	});

	it('rejects wrong answer', () => {
		expect(evaluateMcqAnswer(mcqProblem, 'False')).toBe(false);
	});

	it('rejects empty answer', () => {
		expect(evaluateMcqAnswer(mcqProblem, '')).toBe(false);
	});
});

// ── evaluateTruthTableAnswer ─────────────────────────────────────────────────

describe('evaluateTruthTableAnswer', () => {
	it('accepts correct submission', () => {
		const answer = JSON.stringify({ '0:1': false, '1:1': true });
		expect(evaluateTruthTableAnswer(truthTableProblem, answer)).toBe(true);
	});

	it('rejects incorrect submission', () => {
		const answer = JSON.stringify({ '0:1': true, '1:1': true });
		expect(evaluateTruthTableAnswer(truthTableProblem, answer)).toBe(false);
	});

	it('rejects missing cells', () => {
		const answer = JSON.stringify({ '0:1': false });
		expect(evaluateTruthTableAnswer(truthTableProblem, answer)).toBe(false);
	});

	it('rejects malformed JSON', () => {
		expect(evaluateTruthTableAnswer(truthTableProblem, 'not json')).toBe(false);
	});

	it('rejects empty answer', () => {
		expect(evaluateTruthTableAnswer(truthTableProblem, '')).toBe(false);
	});

	it('rejects problem with no hidden columns', () => {
		const noHidden: TruthTableProblem = { ...truthTableProblem, hiddenColumns: [] };
		const answer = JSON.stringify({ '0:1': false });
		expect(evaluateTruthTableAnswer(noHidden, answer)).toBe(false);
	});
});

// ── evaluateAssertionAnswer ──────────────────────────────────────────────────

describe('evaluateAssertionAnswer', () => {
	it('accepts correct valid judgment', () => {
		const answer = JSON.stringify({ judgment: 'valid' });
		expect(evaluateAssertionAnswer(assertionValidProblem, answer)).toBe(true);
	});

	it('rejects wrong judgment for valid problem', () => {
		const answer = JSON.stringify({ judgment: 'invalid' });
		expect(evaluateAssertionAnswer(assertionValidProblem, answer)).toBe(false);
	});

	it('accepts correct invalid judgment with valid counterexample', () => {
		const answer = JSON.stringify({
			judgment: 'invalid',
			counterexample: { P: false, Q: true }
		});
		expect(evaluateAssertionAnswer(assertionInvalidProblem, answer)).toBe(true);
	});

	it('rejects invalid judgment with bad counterexample', () => {
		const answer = JSON.stringify({
			judgment: 'invalid',
			counterexample: { P: true, Q: true }
		});
		expect(evaluateAssertionAnswer(assertionInvalidProblem, answer)).toBe(false);
	});

	it('rejects invalid judgment with no counterexample', () => {
		const answer = JSON.stringify({ judgment: 'invalid' });
		expect(evaluateAssertionAnswer(assertionInvalidProblem, answer)).toBe(false);
	});

	it('rejects malformed JSON', () => {
		expect(evaluateAssertionAnswer(assertionValidProblem, 'not json')).toBe(false);
	});

	it('rejects empty answer', () => {
		expect(evaluateAssertionAnswer(assertionValidProblem, '')).toBe(false);
	});
});

// ── evaluateFormulaAnswer ────────────────────────────────────────────────────

describe('evaluateFormulaAnswer', () => {
	it('accepts equivalent formula', () => {
		expect(evaluateFormulaAnswer(formulaProblem, 'P \\land Q')).toBe(true);
	});

	it('accepts equivalent formula with different ordering', () => {
		expect(evaluateFormulaAnswer(formulaProblem, 'Q \\land P')).toBe(true);
	});

	it('rejects non-equivalent formula', () => {
		expect(evaluateFormulaAnswer(formulaProblem, 'P \\lor Q')).toBe(false);
	});

	it('rejects empty formula', () => {
		expect(evaluateFormulaAnswer(formulaProblem, '')).toBe(false);
	});

	it('rejects overly complex formula', () => {
		const longFormula = 'A'.repeat(300);
		expect(evaluateFormulaAnswer(formulaProblem, longFormula)).toBe(false);
	});
});

// ── evaluateAnswer (unified) ─────────────────────────────────────────────────

describe('evaluateAnswer', () => {
	it('dispatches to MCQ evaluator', () => {
		expect(evaluateAnswer(mcqProblem, 'True')).toBe(true);
		expect(evaluateAnswer(mcqProblem, 'False')).toBe(false);
	});

	it('dispatches to truth-table evaluator', () => {
		const answer = JSON.stringify({ '0:1': false, '1:1': true });
		expect(evaluateAnswer(truthTableProblem, answer)).toBe(true);
	});

	it('dispatches to assertion evaluator', () => {
		const answer = JSON.stringify({ judgment: 'valid' });
		expect(evaluateAnswer(assertionValidProblem, answer)).toBe(true);
	});

	it('dispatches to formula evaluator', () => {
		expect(evaluateAnswer(formulaProblem, 'P \\land Q')).toBe(true);
	});
});
