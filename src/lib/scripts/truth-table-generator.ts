import { parseFormula, extractVariables, evaluateFormula } from '../logic';

export interface TruthTableSpec {
	formulas: string[];
	hiddenFormulas: string[];
	variableOrder?: string[];
}

export interface GeneratedTruthTable {
	headers: string[];
	expectedTable: boolean[][];
	hiddenColumns: number[];
	answer: string;
}

export interface TruthTableGenerationError {
	type: 'parse_error' | 'variable_mismatch' | 'hidden_not_found';
	message: string;
	formula?: string;
}

export type TruthTableResult =
	| { success: true; data: GeneratedTruthTable }
	| { success: false; error: TruthTableGenerationError };

function normalizeFormula(formula: string): string {
	return formula.replace(/\$/g, '').replace(/\s+/g, ' ').trim();
}

function generateAssignments(variables: string[]): Record<string, boolean>[] {
	const n = variables.length;
	const numRows = Math.pow(2, n);
	const assignments: Record<string, boolean>[] = [];

	for (let i = 0; i < numRows; i++) {
		const assignment: Record<string, boolean> = {};
		for (let j = 0; j < n; j++) {
			assignment[variables[j]] = !Boolean((i >> (n - 1 - j)) & 1);
		}
		assignments.push(assignment);
	}

	return assignments;
}

function isAtomFormula(formula: ReturnType<typeof parseFormula>): boolean {
	return formula !== null && formula.type === 'atom';
}

export function generateTruthTable(spec: TruthTableSpec): TruthTableResult {
	const { formulas, hiddenFormulas, variableOrder: explicitOrder } = spec;

	if (formulas.length === 0) {
		return {
			success: false,
			error: {
				type: 'parse_error',
				message: 'No formulas provided'
			}
		};
	}

	const parsedFormulas: Array<ReturnType<typeof parseFormula>> = [];
	const allVariables = new Set<string>();
	const orderedVariables: string[] = [];

	for (const formula of formulas) {
		const normalized = normalizeFormula(formula);
		const parsed = parseFormula(normalized);

		if (!parsed) {
			return {
				success: false,
				error: {
					type: 'parse_error',
					message: `Failed to parse formula: ${formula}`,
					formula
				}
			};
		}

		parsedFormulas.push(parsed);

		if (isAtomFormula(parsed) && parsed.type === 'atom') {
			const varName = parsed.value.toUpperCase();
			if (!allVariables.has(varName)) {
				orderedVariables.push(varName);
			}
		}

		for (const v of extractVariables(parsed)) {
			allVariables.add(v);
		}
	}

	const hiddenColumns: number[] = [];
	for (const hiddenFormula of hiddenFormulas) {
		const normalizedHidden = normalizeFormula(hiddenFormula);
		const index = formulas.findIndex((f) => normalizeFormula(f) === normalizedHidden);

		if (index === -1) {
			return {
				success: false,
				error: {
					type: 'hidden_not_found',
					message: `Hidden formula not found in formulas list: ${hiddenFormula}`,
					formula: hiddenFormula
				}
			};
		}

		hiddenColumns.push(index);
	}

	let variables: string[];
	if (explicitOrder) {
		variables = explicitOrder.map((v) => v.toUpperCase());
	} else if (orderedVariables.length === allVariables.size) {
		variables = orderedVariables;
	} else {
		variables = Array.from(allVariables).sort();
	}

	const assignments = generateAssignments(variables);
	const expectedTable: boolean[][] = [];

	for (const assignment of assignments) {
		const row: boolean[] = [];

		for (const parsed of parsedFormulas) {
			if (!parsed) {
				row.push(false);
				continue;
			}

			try {
				const value = evaluateFormula(parsed, assignment);
				row.push(value);
			} catch {
				return {
					success: false,
					error: {
						type: 'parse_error',
						message: `Failed to evaluate formula with assignment: ${JSON.stringify(assignment)}`
					}
				};
			}
		}

		expectedTable.push(row);
	}

	const answerValues: string[] = [];
	for (const row of expectedTable) {
		for (const colIndex of hiddenColumns) {
			answerValues.push(row[colIndex] ? 'T' : 'F');
		}
	}
	const answer = answerValues.join(', ');

	return {
		success: true,
		data: {
			headers: formulas,
			expectedTable,
			hiddenColumns,
			answer
		}
	};
}

export function validateExistingTruthTable(
	headers: string[],
	expectedTable: boolean[][],
	hiddenColumns: number[]
): TruthTableResult {
	const spec: TruthTableSpec = {
		formulas: headers,
		hiddenFormulas: hiddenColumns.map((i) => headers[i])
	};

	const result = generateTruthTable(spec);

	if (!result.success) {
		return result;
	}

	const { data } = result;

	if (data.expectedTable.length !== expectedTable.length) {
		return {
			success: false,
			error: {
				type: 'variable_mismatch',
				message: `Row count mismatch: expected ${expectedTable.length}, generated ${data.expectedTable.length}`
			}
		};
	}

	for (let rowIdx = 0; rowIdx < expectedTable.length; rowIdx++) {
		const existingRow = expectedTable[rowIdx];
		const generatedRow = data.expectedTable[rowIdx];

		if (existingRow.length !== generatedRow.length) {
			return {
				success: false,
				error: {
					type: 'variable_mismatch',
					message: `Column count mismatch at row ${rowIdx}: expected ${existingRow.length}, generated ${generatedRow.length}`
				}
			};
		}

		for (let colIdx = 0; colIdx < existingRow.length; colIdx++) {
			if (existingRow[colIdx] !== generatedRow[colIdx]) {
				return {
					success: false,
					error: {
						type: 'variable_mismatch',
						message: `Value mismatch at row ${rowIdx}, col ${colIdx} (${headers[colIdx]}): expected ${existingRow[colIdx]}, generated ${generatedRow[colIdx]}`
					}
				};
			}
		}
	}

	return result;
}
