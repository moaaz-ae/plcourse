<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import QuestionTruthTable from './question-truth-table.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { GeneratedProblem } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Questions/TruthTable',
		component: QuestionTruthTable,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Truth table completion component. Users click cells to toggle between T/F/? to complete hidden columns. Great for learning logical operators.'
				}
			}
		}
	});

	function createTruthTableData(problem: GeneratedProblem) {
		return renderProblem(problem);
	}
</script>

<Story
	name="Conjunction (AND)"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for **conjunction** ($P \\land Q$).',
			headers: ['$P$', '$Q$', '$P \\land Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, false],
				[false, true, false],
				[false, false, false]
			],
			hiddenColumns: [2],
			answer: 'T, F, F, F',
			hint: 'Conjunction is true only when BOTH operands are true.',
			walkthrough:
				'Conjunction ($\\land$) is true only when both sides are true.\n- T ∧ T = **T**\n- T ∧ F = **F**\n- F ∧ T = **F**\n- F ∧ F = **F**'
		})
	}}
/>

<Story
	name="Disjunction (OR)"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for **disjunction** ($P \\lor Q$).',
			headers: ['$P$', '$Q$', '$P \\lor Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, true],
				[false, true, true],
				[false, false, false]
			],
			hiddenColumns: [2],
			answer: 'T, T, T, F',
			hint: 'Disjunction is true when AT LEAST ONE operand is true.',
			walkthrough:
				'Disjunction ($\\lor$) is false only when both sides are false.\n- T ∨ T = **T**\n- T ∨ F = **T**\n- F ∨ T = **T**\n- F ∨ F = **F**'
		})
	}}
/>

<Story
	name="Implication (IF-THEN)"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for **implication** ($P \\to Q$).',
			headers: ['$P$', '$Q$', '$P \\to Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, false],
				[false, true, true],
				[false, false, true]
			],
			hiddenColumns: [2],
			answer: 'T, F, T, T',
			hint: 'An implication is false ONLY when the antecedent is true and consequent is false.',
			walkthrough:
				'Implication ($\\to$) is false only in one case: when $P$ is true and $Q$ is false. In all other cases it is true (including when $P$ is false — a false premise can imply anything).'
		})
	}}
/>

<Story
	name="Biconditional (IFF)"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for **biconditional** ($P \\leftrightarrow Q$).',
			headers: ['$P$', '$Q$', '$P \\leftrightarrow Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, false],
				[false, true, false],
				[false, false, true]
			],
			hiddenColumns: [2],
			answer: 'T, F, F, T',
			hint: 'Biconditional is true when both sides have the SAME truth value.',
			walkthrough:
				'The biconditional ($\\leftrightarrow$) is true when both sides agree. T ↔ T = T, F ↔ F = T, but T ↔ F = F and F ↔ T = F.'
		})
	}}
/>

<Story
	name="Negation (NOT)"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for **negation** ($\\neg P$).',
			headers: ['$P$', '$\\neg P$'],
			expectedTable: [
				[true, false],
				[false, true]
			],
			hiddenColumns: [1],
			answer: 'F, T',
			hint: 'Negation flips the truth value.',
			walkthrough:
				'Negation ($\\neg$) always gives the opposite truth value. If $P$ = T then $\\neg P$ = F. If $P$ = F then $\\neg P$ = T.'
		})
	}}
/>

<Story
	name="Three Variables"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for $(P \\land Q) \\to R$.',
			headers: ['$P$', '$Q$', '$R$', '$(P \\land Q) \\to R$'],
			expectedTable: [
				[true, true, true, true],
				[true, true, false, false],
				[true, false, true, true],
				[true, false, false, true],
				[false, true, true, true],
				[false, true, false, true],
				[false, false, true, true],
				[false, false, false, true]
			],
			hiddenColumns: [3],
			answer: 'T, F, T, T, T, T, T, T',
			hint: 'First evaluate $P \\land Q$, then apply the implication.',
			walkthrough:
				'Step 1: compute $P \\land Q$ — only true on rows 1 and 2. Step 2: apply $\\to R$. The implication is false only on row 2 (antecedent T, consequent F). All other rows have a false antecedent, so the implication is vacuously true.'
		})
	}}
/>

<Story
	name="Multiple Hidden Columns"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question:
				'Complete both the intermediate column ($P \\land Q$) and the final result ($\\neg(P \\land Q)$).',
			headers: ['$P$', '$Q$', '$P \\land Q$', '$\\neg(P \\land Q)$'],
			expectedTable: [
				[true, true, true, false],
				[true, false, false, true],
				[false, true, false, true],
				[false, false, false, true]
			],
			hiddenColumns: [2, 3],
			answer: 'intermediate and final columns',
			hint: "This is De Morgan's law in action!",
			walkthrough:
				'First fill in $P \\land Q$ (true only on row 1). Then negate it: $\\neg$T = F, $\\neg$F = T. So the final column is: F, T, T, T.'
		})
	}}
/>

<Story
	name="Diagnostic Mode"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Complete the truth table for $P \\lor Q$.',
			headers: ['$P$', '$Q$', '$P \\lor Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, true],
				[false, true, true],
				[false, false, false]
			],
			hiddenColumns: [2],
			answer: 'T, T, T, F',
			hint: 'Disjunction is false only when both sides are false.',
			walkthrough:
				'Disjunction is false only when both $P$ and $Q$ are false. All other combinations give true.'
		})
	}}
/>

<Story
	name="Fill All Columns"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question: 'Build the complete truth table for $P \\land Q$ from scratch.',
			headers: ['$P$', '$Q$', '$P \\land Q$'],
			expectedTable: [
				[true, true, true],
				[true, false, false],
				[false, true, false],
				[false, false, false]
			],
			hiddenColumns: [0, 1, 2],
			answer: 'entire table',
			hint: 'Start with the variable columns (P, Q), then compute P ∧ Q.',
			walkthrough:
				'Fill the $P$ column: T, T, F, F. Fill the $Q$ column: T, F, T, F. Then compute $P \\land Q$: only the first row (T ∧ T) is true.'
		})
	}}
/>

<Story
	name="Middle Column Only"
	args={{
		data: createTruthTableData({
			type: 'truth-table',
			question:
				'Given $P$, $Q$, and the final result, fill in the intermediate column $P \\land Q$.',
			headers: ['$P$', '$Q$', '$P \\land Q$', '$(P \\land Q) \\to Q$'],
			expectedTable: [
				[true, true, true, true],
				[true, false, false, true],
				[false, true, false, true],
				[false, false, false, true]
			],
			hiddenColumns: [2],
			answer: 'T, F, F, F',
			hint: 'The intermediate column is P ∧ Q.',
			walkthrough:
				'Compute $P \\land Q$ for each row: T∧T=T, T∧F=F, F∧T=F, F∧F=F. The final column $(P \\land Q) \\to Q$ is then all true (you can verify).'
		})
	}}
/>
