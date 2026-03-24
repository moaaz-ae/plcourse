<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import QuestionFormulaBuilder from './question-formula-builder.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { GeneratedProblem } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Questions/FormulaBuilder',
		component: QuestionFormulaBuilder,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Formula builder component. Users translate English sentences into logical formulas using a virtual keyboard. Shows variable mappings and allows building formulas step by step.'
				}
			}
		}
	});

	function createFormulaBuilderData(problem: GeneratedProblem) {
		return renderProblem(problem);
	}
</script>

<Story
	name="Simple Implication"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				R: 'it rains',
				W: 'the ground is wet'
			},
			answer: '$R \\to W$',
			hint: 'Use the implication symbol ($\\to$) for "if...then".',
			walkthrough:
				'"If it rains" is the antecedent → $R$. "The ground is wet" is the consequent → $W$. "If...then" → $\\to$. Result: $R \\to W$.'
		})
	}}
/>

<Story
	name="Conjunction"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				S: 'it is sunny',
				W: 'it is warm'
			},
			answer: '$S \\land W$',
			hint: 'Use conjunction ($\\land$) for "and".',
			walkthrough:
				'"It is sunny" → $S$. "It is warm" → $W$. "And" → $\\land$. Result: $S \\land W$.'
		})
	}}
/>

<Story
	name="Disjunction"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				B: 'the bus is late',
				T: 'there is traffic'
			},
			answer: '$B \\lor T$',
			hint: 'Use disjunction ($\\lor$) for "either...or".',
			walkthrough:
				'"The bus is late" → $B$. "There is traffic" → $T$. "Either...or" → $\\lor$. Result: $B \\lor T$.'
		})
	}}
/>

<Story
	name="Negation"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				R: 'it is raining'
			},
			answer: '$\\neg R$',
			hint: 'Use negation ($\\neg$) for "not".',
			walkthrough: '"It is raining" → $R$. "It is **not** raining" → $\\neg R$.'
		})
	}}
/>

<Story
	name="Complex: Implication with Conjunction"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				R: 'it rains',
				C: 'the game is cancelled',
				W: 'we will win'
			},
			answer: '$(R \\land \\neg C) \\to W$',
			hint: 'Group the antecedent ($R$ and not $C$) in parentheses, then use implication.',
			walkthrough:
				'Antecedent: "it rains AND the game is not cancelled" → $(R \\land \\neg C)$. Consequent: "we will win" → $W$. "If...then" → $\\to$. Result: $(R \\land \\neg C) \\to W$.'
		})
	}}
/>

<Story
	name="Biconditional"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				L: 'the light is on',
				S: 'the switch is flipped'
			},
			answer: '$L \\leftrightarrow S$',
			hint: 'Use biconditional ($\\leftrightarrow$) for "if and only if".',
			walkthrough:
				'"The light is on" → $L$. "The switch is flipped" → $S$. "If and only if" → $\\leftrightarrow$. Result: $L \\leftrightarrow S$.'
		})
	}}
/>

<Story
	name="Nested Negation"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				A: 'Alice is present',
				B: 'Bob is present'
			},
			answer: '$\\neg (A \\land B)$',
			hint: 'Negate the entire conjunction using parentheses.',
			walkthrough:
				'"Alice is present" → $A$. "Bob is present" → $B$. "Both Alice and Bob are present" → $A \\land B$. "It is not the case that..." → $\\neg(A \\land B)$.'
		})
	}}
/>

<Story
	name="Unless (Disjunction)"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				P: 'the party will happen',
				R: 'it rains'
			},
			answer: '$P \\lor R$',
			hint: '"Unless" can be translated as "or". The party happens OR it rains (or both).',
			walkthrough:
				'"Unless" in logic is equivalent to "or": the party happens unless it rains = the party happens OR it rains. Result: $P \\lor R$.'
		})
	}}
/>

<Story
	name="Four Variables"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				A: 'Alice comes',
				B: 'Bob comes',
				C: 'Carol will come',
				D: 'Dave will leave'
			},
			answer: '$(A \\land B) \\to (C \\lor D)$',
			hint: 'Group the antecedent and consequent with parentheses.',
			walkthrough:
				'Antecedent: "Alice comes AND Bob comes" → $(A \\land B)$. Consequent: "Carol will come OR Dave will leave" → $(C \\lor D)$. Result: $(A \\land B) \\to (C \\lor D)$.'
		})
	}}
/>

<Story
	name="Diagnostic Mode"
	args={{
		data: createFormulaBuilderData({
			type: 'formula-builder',
			question: 'Translate the following sentence into a logical formula:',
			variableMap: {
				R: 'it rains',
				W: 'the ground is wet'
			},
			answer: '$R \\to W$',
			hint: 'Use $\\to$ for "if...then".',
			walkthrough:
				'"If it rains" → $R$. "The ground is wet" → $W$. "If...then" → $\\to$. Result: $R \\to W$.'
		})
	}}
/>
