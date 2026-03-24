type Formula =
	| { type: 'atom'; value: string }
	| { type: 'unary'; operator: string; operand: Formula }
	| { type: 'binary'; operator: string; left: Formula; right: Formula };

interface FormulaComplexityLimits {
	maxLength: number;
	maxTokens: number;
	maxDistinctVariables: number;
}

interface FormulaComplexityViolation {
	code: 'maxLength' | 'maxTokens' | 'maxDistinctVariables';
	message: string;
}

const FORMULA_COMPLEXITY_LIMITS: FormulaComplexityLimits = {
	maxLength: 256,
	maxTokens: 128,
	maxDistinctVariables: 8
};

function tokenize(input: string): string[] {
	const tokens: string[] = [];
	const regex = /(\\[a-zA-Z]+|[a-zA-Z0-9]+|[()])/g;
	let match;
	while ((match = regex.exec(input)) !== null) {
		tokens.push(match[0]);
	}
	return tokens;
}

function getDistinctVariableCount(tokens: string[]): number {
	const variables = new Set<string>();
	for (const token of tokens) {
		if (token === '(' || token === ')' || token.startsWith('\\')) continue;
		variables.add(token.toUpperCase());
	}
	return variables.size;
}

export function validateFormulaComplexity(
	input: string,
	limits: FormulaComplexityLimits = FORMULA_COMPLEXITY_LIMITS
): FormulaComplexityViolation | null {
	if (input.length > limits.maxLength) {
		return {
			code: 'maxLength',
			message: `Formula exceeds maximum length (${limits.maxLength} characters).`
		};
	}

	const cleanInput = input.replace(/\$/g, '');
	const tokens = tokenize(cleanInput);

	if (tokens.length > limits.maxTokens) {
		return {
			code: 'maxTokens',
			message: `Formula exceeds maximum token count (${limits.maxTokens}).`
		};
	}

	const distinctVariables = getDistinctVariableCount(tokens);
	if (distinctVariables > limits.maxDistinctVariables) {
		return {
			code: 'maxDistinctVariables',
			message: `Formula exceeds maximum distinct variables (${limits.maxDistinctVariables}).`
		};
	}

	return null;
}

export function parseFormula(input: string): Formula | null {
	const cleanInput = input.replace(/\$/g, '');
	const tokens = tokenize(cleanInput);
	let pos = 0;

	function peek(): string | null {
		return pos < tokens.length ? tokens[pos] : null;
	}

	function consume(): string | null {
		return pos < tokens.length ? tokens[pos++] : null;
	}

	function parsePrimary(): Formula | null {
		const token = consume();
		if (!token) return null;

		if (token === '(') {
			const expr = parseExpression();
			const closing = consume();
			if (closing !== ')') return null;
			return expr;
		}

		if (token === '\\neg') {
			const operand = parsePrimary();
			if (!operand) return null;
			return { type: 'unary', operator: '\\neg', operand };
		}

		return { type: 'atom', value: token };
	}

	function parseLevel4(): Formula | null {
		let left = parsePrimary();
		if (!left) return null;
		while (peek() === '\\land') {
			const op = consume()!;
			const right = parsePrimary();
			if (!right) return null;
			left = { type: 'binary', operator: op, left, right };
		}
		return left;
	}

	function parseLevel3(): Formula | null {
		let left = parseLevel4();
		if (!left) return null;
		while (peek() === '\\lor') {
			const op = consume()!;
			const right = parseLevel4();
			if (!right) return null;
			left = { type: 'binary', operator: op, left, right };
		}
		return left;
	}

	function parseLevel2(): Formula | null {
		const left = parseLevel3();
		if (!left) return null;
		if (peek() === '\\to') {
			const op = consume()!;
			const right = parseLevel2();
			if (!right) return null;
			return { type: 'binary', operator: op, left, right };
		}
		return left;
	}

	function parseExpression(): Formula | null {
		const left = parseLevel2();
		if (!left) return null;

		if (peek() === '\\leftrightarrow') {
			const op = consume()!;
			const right = parseExpression();
			if (!right) return null;
			return { type: 'binary', operator: op, left, right };
		}
		return left;
	}

	const result = parseExpression();

	if (result && pos < tokens.length) {
		return null;
	}

	return result;
}

export function extractVariables(formula: Formula): string[] {
	const vars = new Set<string>();

	function collect(f: Formula): void {
		if (f.type === 'atom') {
			vars.add(f.value.toUpperCase());
		} else if (f.type === 'unary') {
			collect(f.operand);
		} else if (f.type === 'binary') {
			collect(f.left);
			collect(f.right);
		}
	}

	collect(formula);
	return Array.from(vars).sort();
}

export function evaluateFormula(formula: Formula, assignment: Record<string, boolean>): boolean {
	const normalizedAssignment: Record<string, boolean> = {};
	for (const key of Object.keys(assignment)) {
		normalizedAssignment[key.toUpperCase()] = assignment[key];
	}

	function evaluate(f: Formula): boolean {
		if (f.type === 'atom') {
			const value = normalizedAssignment[f.value.toUpperCase()];
			if (value === undefined) {
				throw new Error(`Variable ${f.value} not found in assignment`);
			}
			return value;
		}

		if (f.type === 'unary') {
			if (f.operator === '\\neg') {
				return !evaluate(f.operand);
			}
			throw new Error(`Unknown unary operator: ${f.operator}`);
		}

		if (f.type === 'binary') {
			const left = evaluate(f.left);
			const right = evaluate(f.right);

			switch (f.operator) {
				case '\\land':
					return left && right;
				case '\\lor':
					return left || right;
				case '\\to':
					return !left || right;
				case '\\leftrightarrow':
					return left === right;
				default:
					throw new Error(`Unknown binary operator: ${f.operator}`);
			}
		}

		throw new Error(`Unknown formula type`);
	}

	return evaluate(formula);
}

function* iterateAssignments(variables: string[]): Generator<Record<string, boolean>> {
	const n = variables.length;
	const numRows = Math.pow(2, n);

	for (let i = 0; i < numRows; i++) {
		const assignment: Record<string, boolean> = {};
		for (let j = 0; j < n; j++) {
			assignment[variables[j]] = Boolean((i >> (n - 1 - j)) & 1);
		}
		yield assignment;
	}
}

export function areFormulasEquivalent(f1: string, f2: string): boolean {
	if (!f1 || !f2) return false;
	if (validateFormulaComplexity(f1) || validateFormulaComplexity(f2)) return false;

	const ast1 = parseFormula(f1);
	const ast2 = parseFormula(f2);

	if (!ast1 || !ast2) {
		return false;
	}

	const vars1 = extractVariables(ast1);
	const vars2 = extractVariables(ast2);
	const allVars = Array.from(new Set([...vars1, ...vars2])).sort();
	if (allVars.length > FORMULA_COMPLEXITY_LIMITS.maxDistinctVariables) {
		return false;
	}

	for (const assignment of iterateAssignments(allVars)) {
		const result1 = evaluateFormula(ast1, assignment);
		const result2 = evaluateFormula(ast2, assignment);
		if (result1 !== result2) {
			return false;
		}
	}

	return true;
}
