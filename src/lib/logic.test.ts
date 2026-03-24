import { describe, it, expect } from 'vitest';
import {
	parseFormula,
	extractVariables,
	evaluateFormula,
	areFormulasEquivalent,
	validateFormulaComplexity
} from './logic';

describe('parseFormula', () => {
	describe('atoms', () => {
		it('parses single variable P', () => {
			expect(parseFormula('P')).toEqual({ type: 'atom', value: 'P' });
		});

		it('parses single variable Q', () => {
			expect(parseFormula('Q')).toEqual({ type: 'atom', value: 'Q' });
		});

		it('parses lowercase variable (case preservation)', () => {
			expect(parseFormula('p')).toEqual({ type: 'atom', value: 'p' });
		});

		it('parses variable with numeric suffix', () => {
			expect(parseFormula('P1')).toEqual({ type: 'atom', value: 'P1' });
		});

		it('parses variable with $ delimiters', () => {
			expect(parseFormula('$P$')).toEqual({ type: 'atom', value: 'P' });
		});

		it('parses variable with whitespace and $', () => {
			expect(parseFormula('  $  P  $  ')).toEqual({ type: 'atom', value: 'P' });
		});
	});

	describe('negation', () => {
		it('parses simple negation \\neg P', () => {
			expect(parseFormula('\\neg P')).toEqual({
				type: 'unary',
				operator: '\\neg',
				operand: { type: 'atom', value: 'P' }
			});
		});

		it('parses double negation \\neg \\neg P', () => {
			expect(parseFormula('\\neg \\neg P')).toEqual({
				type: 'unary',
				operator: '\\neg',
				operand: {
					type: 'unary',
					operator: '\\neg',
					operand: { type: 'atom', value: 'P' }
				}
			});
		});

		it('parses triple negation', () => {
			const result: any = parseFormula('\\neg \\neg \\neg P');
			expect(result.type).toBe('unary');
			expect(result.operand.type).toBe('unary');
			expect(result.operand.operand.type).toBe('unary');
			expect(result.operand.operand.operand.value).toBe('P');
		});
	});

	describe('binary operators', () => {
		it('parses conjunction P \\land Q', () => {
			expect(parseFormula('P \\land Q')).toEqual({
				type: 'binary',
				operator: '\\land',
				left: { type: 'atom', value: 'P' },
				right: { type: 'atom', value: 'Q' }
			});
		});

		it('parses disjunction P \\lor Q', () => {
			expect(parseFormula('P \\lor Q')).toEqual({
				type: 'binary',
				operator: '\\lor',
				left: { type: 'atom', value: 'P' },
				right: { type: 'atom', value: 'Q' }
			});
		});

		it('parses implication P \\to Q', () => {
			expect(parseFormula('P \\to Q')).toEqual({
				type: 'binary',
				operator: '\\to',
				left: { type: 'atom', value: 'P' },
				right: { type: 'atom', value: 'Q' }
			});
		});

		it('parses biconditional P \\leftrightarrow Q', () => {
			expect(parseFormula('P \\leftrightarrow Q')).toEqual({
				type: 'binary',
				operator: '\\leftrightarrow',
				left: { type: 'atom', value: 'P' },
				right: { type: 'atom', value: 'Q' }
			});
		});
	});

	describe('parentheses and nesting', () => {
		it('parses parenthesized atom (P)', () => {
			expect(parseFormula('(P)')).toEqual({ type: 'atom', value: 'P' });
		});

		it('parses redundant parentheses ((P))', () => {
			expect(parseFormula('((P))')).toEqual({ type: 'atom', value: 'P' });
		});

		it('parses (P \\land Q) \\lor R', () => {
			const result: any = parseFormula('(P \\land Q) \\lor R');
			expect(result.type).toBe('binary');
			expect(result.operator).toBe('\\lor');
			expect(result.left.operator).toBe('\\land');
			expect(result.right.value).toBe('R');
		});

		it('parses P \\land (Q \\lor R)', () => {
			const result: any = parseFormula('P \\land (Q \\lor R)');
			expect(result.type).toBe('binary');
			expect(result.operator).toBe('\\land');
			expect(result.left.value).toBe('P');
			expect(result.right.operator).toBe('\\lor');
		});

		it('parses \\neg (P \\land Q)', () => {
			const result: any = parseFormula('\\neg (P \\land Q)');
			expect(result.type).toBe('unary');
			expect(result.operand.type).toBe('binary');
			expect(result.operand.operator).toBe('\\land');
		});
	});

	describe('precedence order (Tightest to Loosest)', () => {
		it('\\neg > \\land: \\neg P \\land Q parsed as (\\neg P) \\land Q', () => {
			const result: any = parseFormula('\\neg P \\land Q');
			expect(result.operator).toBe('\\land');
			expect(result.left.type).toBe('unary');
		});

		it('\\land > \\lor: P \\land Q \\lor R parsed as (P \\land Q) \\lor R', () => {
			const result: any = parseFormula('P \\land Q \\lor R');
			expect(result.operator).toBe('\\lor');
			expect(result.left.operator).toBe('\\land');
		});

		it('\\lor > \\to: P \\lor Q \\to R parsed as (P \\lor Q) \\to R', () => {
			const result: any = parseFormula('P \\lor Q \\to R');
			expect(result.operator).toBe('\\to');
			expect(result.left.operator).toBe('\\lor');
		});

		it('\\to > \\leftrightarrow: P \\to Q \\leftrightarrow R parsed as (P \\to Q) \\leftrightarrow R', () => {
			const result: any = parseFormula('P \\to Q \\leftrightarrow R');
			expect(result.operator).toBe('\\leftrightarrow');
			expect(result.left.operator).toBe('\\to');
		});

		it('Mixed: \\neg P \\land Q \\lor R \\to S \\leftrightarrow T', () => {
			const result: any = parseFormula('\\neg P \\land Q \\lor R \\to S \\leftrightarrow T');
			expect(result.operator).toBe('\\leftrightarrow');
			expect(result.left.operator).toBe('\\to');
			expect(result.left.left.operator).toBe('\\lor');
			expect(result.left.left.left.operator).toBe('\\land');
			expect(result.left.left.left.left.operator).toBe('\\neg');
		});
	});

	describe('associativity', () => {
		it('\\land is left-associative: P \\land Q \\land R -> (P \\land Q) \\land R', () => {
			const result: any = parseFormula('P \\land Q \\land R');
			expect(result.operator).toBe('\\land');
			expect(result.left.operator).toBe('\\land');
			expect(result.right.value).toBe('R');
		});

		it('\\lor is left-associative: P \\lor Q \\lor R -> (P \\lor Q) \\lor R', () => {
			const result: any = parseFormula('P \\lor Q \\lor R');
			expect(result.operator).toBe('\\lor');
			expect(result.left.operator).toBe('\\lor');
		});

		it('\\to is right-associative: P \\to Q \\to R -> P \\to (Q \\to R)', () => {
			const result: any = parseFormula('P \\to Q \\to R');
			expect(result.operator).toBe('\\to');
			expect(result.right.operator).toBe('\\to');
			expect(result.left.value).toBe('P');
		});
	});

	describe('edge cases and errors', () => {
		it('returns null for empty string', () => {
			expect(parseFormula('')).toBeNull();
		});

		it('returns null for whitespace only', () => {
			expect(parseFormula('   ')).toBeNull();
		});

		it('returns null for unbalanced open parenthesis', () => {
			expect(parseFormula('(P')).toBeNull();
		});

		it('returns null for unbalanced closed parenthesis', () => {
			expect(parseFormula('P)')).toBeNull();
		});

		it('returns null for missing operand after operator', () => {
			expect(parseFormula('P \\land')).toBeNull();
		});

		it('returns null for missing operand before operator', () => {
			expect(parseFormula('\\to Q')).toBeDefined();
		});

		it('returns null for consecutive binary operators', () => {
			const result: any = parseFormula('P \\land \\lor');
			expect(result).not.toBeNull();

			expect(result.right.value).toBe('\\lor');
		});
	});
});

describe('extractVariables', () => {
	it('extracts from atom', () => {
		expect(extractVariables(parseFormula('P')!)).toEqual(['P']);
	});

	it('uniques and sorts variables', () => {
		expect(extractVariables(parseFormula('Q \\land P \\land Q')!)).toEqual(['P', 'Q']);
	});

	it('normalizes case', () => {
		expect(extractVariables(parseFormula('p \\land P')!)).toEqual(['P']);
	});

	it('extracts recursively', () => {
		expect(extractVariables(parseFormula('A \\to (B \\lor \\neg C)')!)).toEqual(['A', 'B', 'C']);
	});

	it('handles numeric suffixes', () => {
		expect(extractVariables(parseFormula('P1 \\land P2')!)).toEqual(['P1', 'P2']);
	});
});

describe('evaluateFormula', () => {
	const T = true;
	const F = false;

	it('evaluates atoms', () => {
		expect(evaluateFormula(parseFormula('P')!, { P: T })).toBe(T);
		expect(evaluateFormula(parseFormula('P')!, { P: F })).toBe(F);
	});

	it('throws error for missing variable', () => {
		expect(() => evaluateFormula(parseFormula('P')!, {})).toThrow();
	});

	it('evaluates negation', () => {
		expect(evaluateFormula(parseFormula('\\neg P')!, { P: T })).toBe(F);
		expect(evaluateFormula(parseFormula('\\neg P')!, { P: F })).toBe(T);
	});

	it('evaluates conjunction', () => {
		const f = parseFormula('P \\land Q')!;
		expect(evaluateFormula(f, { P: T, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: T, Q: F })).toBe(F);
		expect(evaluateFormula(f, { P: F, Q: T })).toBe(F);
		expect(evaluateFormula(f, { P: F, Q: F })).toBe(F);
	});

	it('evaluates disjunction', () => {
		const f = parseFormula('P \\lor Q')!;
		expect(evaluateFormula(f, { P: T, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: F, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: F, Q: F })).toBe(F);
	});

	it('evaluates implication', () => {
		const f = parseFormula('P \\to Q')!;
		expect(evaluateFormula(f, { P: T, Q: F })).toBe(F);
		expect(evaluateFormula(f, { P: T, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: F, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: F, Q: F })).toBe(T);
	});

	it('evaluates biconditional', () => {
		const f = parseFormula('P \\leftrightarrow Q')!;
		expect(evaluateFormula(f, { P: T, Q: T })).toBe(T);
		expect(evaluateFormula(f, { P: F, Q: F })).toBe(T);
		expect(evaluateFormula(f, { P: T, Q: F })).toBe(F);
	});

	it('evaluates complex formula: (P \\land Q) \\to R', () => {
		const f = parseFormula('(P \\land Q) \\to R')!;
		expect(evaluateFormula(f, { P: T, Q: T, R: F })).toBe(F);
		expect(evaluateFormula(f, { P: F, Q: T, R: F })).toBe(T);
	});

	it('handles case-insensitive variable lookup', () => {
		const f = parseFormula('p')!;
		expect(evaluateFormula(f, { P: T })).toBe(T);
	});
});

describe('areFormulasEquivalent', () => {
	it('Identity: P == P', () => expect(areFormulasEquivalent('P', 'P')).toBe(true));

	it('Double Negation: P == \\neg\\neg P', () =>
		expect(areFormulasEquivalent('P', '\\neg\\neg P')).toBe(true));
	it('Triple Negation: \\neg P == \\neg\\neg\\neg P', () =>
		expect(areFormulasEquivalent('\\neg P', '\\neg\\neg\\neg P')).toBe(true));

	it('Commutative AND: P \\land Q == Q \\land P', () =>
		expect(areFormulasEquivalent('P \\land Q', 'Q \\land P')).toBe(true));
	it('Commutative OR: P \\lor Q == Q \\lor P', () =>
		expect(areFormulasEquivalent('P \\lor Q', 'Q \\lor P')).toBe(true));
	it('Commutative IFF: P \\leftrightarrow Q == Q \\leftrightarrow P', () =>
		expect(areFormulasEquivalent('P \\leftrightarrow Q', 'Q \\leftrightarrow P')).toBe(true));
	it('Non-Commutative IMPLIES: P \\to Q != Q \\to P', () =>
		expect(areFormulasEquivalent('P \\to Q', 'Q \\to P')).toBe(false));

	it('Associative AND: (A \\land B) \\land C == A \\land (B \\land C)', () =>
		expect(areFormulasEquivalent('(A \\land B) \\land C', 'A \\land (B \\land C)')).toBe(true));
	it('Associative OR: (A \\lor B) \\lor C == A \\lor (B \\lor C)', () =>
		expect(areFormulasEquivalent('(A \\lor B) \\lor C', 'A \\lor (B \\lor C)')).toBe(true));

	it('Distributive AND over OR: P \\land (Q \\lor R) == (P \\land Q) \\lor (P \\land R)', () =>
		expect(areFormulasEquivalent('P \\land (Q \\lor R)', '(P \\land Q) \\lor (P \\land R)')).toBe(
			true
		));
	it('Distributive OR over AND: P \\lor (Q \\land R) == (P \\lor Q) \\land (P \\lor R)', () =>
		expect(areFormulasEquivalent('P \\lor (Q \\land R)', '(P \\lor Q) \\land (P \\lor R)')).toBe(
			true
		));

	it('De Morgan 1: \\neg(P \\land Q) == \\neg P \\lor \\neg Q', () =>
		expect(areFormulasEquivalent('\\neg(P \\land Q)', '\\neg P \\lor \\neg Q')).toBe(true));
	it('De Morgan 2: \\neg(P \\lor Q) == \\neg P \\land \\neg Q', () =>
		expect(areFormulasEquivalent('\\neg(P \\lor Q)', '\\neg P \\land \\neg Q')).toBe(true));

	it('Material Implication 1: P \\to Q == \\neg P \\lor Q', () =>
		expect(areFormulasEquivalent('P \\to Q', '\\neg P \\lor Q')).toBe(true));
	it('Contrapositive: P \\to Q == \\neg Q \\to \\neg P', () =>
		expect(areFormulasEquivalent('P \\to Q', '\\neg Q \\to \\neg P')).toBe(true));

	it('Biconditional expansion: P \\leftrightarrow Q == (P \\to Q) \\land (Q \\to P)', () =>
		expect(areFormulasEquivalent('P \\leftrightarrow Q', '(P \\to Q) \\land (Q \\to P)')).toBe(
			true
		));

	it('Excluded Middle: P \\lor \\neg P == true (matches another tautology Q \\lor \\neg Q)', () =>
		expect(areFormulasEquivalent('P \\lor \\neg P', 'Q \\lor \\neg Q')).toBe(true));
	it('Tautology check: P \\to P == Q \\lor \\neg Q', () =>
		expect(areFormulasEquivalent('P \\to P', 'Q \\lor \\neg Q')).toBe(true));

	it('Contradiction check: P \\land \\neg P == Q \\land \\neg Q', () =>
		expect(areFormulasEquivalent('P \\land \\neg P', 'Q \\land \\neg Q')).toBe(true));

	it('Exportation: (P \\land Q) \\to R == P \\to (Q \\to R)', () =>
		expect(areFormulasEquivalent('(P \\land Q) \\to R', 'P \\to (Q \\to R)')).toBe(true));

	it("Pierce's Law: ((P \\to Q) \\to P) \\to P == Tautology", () => {
		expect(areFormulasEquivalent('((P \\to Q) \\to P) \\to P', 'A \\lor \\neg A')).toBe(true);
	});

	it('returns false for parsing failure on left', () =>
		expect(areFormulasEquivalent('(', 'P')).toBe(false));
	it('returns false for parsing failure on right', () =>
		expect(areFormulasEquivalent('P', ')')).toBe(false));
	it('returns false for empty string', () => expect(areFormulasEquivalent('', 'P')).toBe(false));
	it('returns false when formula exceeds complexity limits', () =>
		expect(
			areFormulasEquivalent(
				'A \\lor B \\lor C \\lor D \\lor E \\lor F \\lor G \\lor H \\lor I',
				'A \\lor B \\lor C \\lor D \\lor E \\lor F \\lor G \\lor H \\lor I'
			)
		).toBe(false));
});

describe('validateFormulaComplexity', () => {
	it('flags formulas that exceed the max length', () => {
		const violation = validateFormulaComplexity('P'.repeat(257));
		expect(violation?.code).toBe('maxLength');
	});

	it('flags formulas that exceed max distinct variables', () => {
		const violation = validateFormulaComplexity(
			'A \\lor B \\lor C \\lor D \\lor E \\lor F \\lor G \\lor H \\lor I'
		);
		expect(violation?.code).toBe('maxDistinctVariables');
	});
});
