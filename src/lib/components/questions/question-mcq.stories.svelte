<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import QuestionMcq from './question-mcq.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { GeneratedProblem } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Questions/MCQ',
		component: QuestionMcq,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Multiple choice question component. Displays a question with selectable options. Shows feedback on submission in practice mode.'
				}
			}
		}
	});

	function createMcqData(problem: GeneratedProblem) {
		return renderProblem(problem);
	}
</script>

<Story
	name="De Morgan's Law"
	args={{
		problemId: 'demorgan-1',
		data: createMcqData({
			type: 'mcq',
			question: "What is the negation of $P \\land Q$ according to De Morgan's laws?",
			options: [
				'$P \\lor Q$',
				'$\\neg P \\land \\neg Q$',
				'$\\neg P \\lor \\neg Q$',
				'$\\neg (P \\lor Q)$'
			],
			answer: '$\\neg P \\lor \\neg Q$',
			hint: "De Morgan's law states: $\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q$",
			walkthrough:
				"De Morgan's law tells us that negating a conjunction flips it to a disjunction and negates each part: $\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q$."
		})
	}}
/>

<Story
	name="Implication Definition"
	args={{
		problemId: 'impl-1',
		data: createMcqData({
			type: 'mcq',
			question: 'Which of the following is logically equivalent to $P \\to Q$?',
			options: ['$P \\land Q$', '$\\neg P \\lor Q$', '$P \\lor \\neg Q$', '$\\neg P \\land Q$'],
			answer: '$\\neg P \\lor Q$',
			hint: 'An implication is false only when the antecedent is true and consequent is false.',
			walkthrough:
				'$P \\to Q$ is false only when $P$ is true and $Q$ is false. The same is true for $\\neg P \\lor Q$: it is false only when $\\neg P$ is false (i.e. $P$ is true) and $Q$ is false. So they are equivalent.'
		})
	}}
/>

<Story
	name="Simple Yes/No"
	args={{
		problemId: 'yesno-1',
		data: createMcqData({
			type: 'mcq',
			question: 'Is $P \\land \\neg P$ a contradiction?',
			options: ['Yes', 'No'],
			answer: 'Yes',
			hint: 'A contradiction is always false.',
			walkthrough:
				'$P \\land \\neg P$ requires $P$ to be both true and false simultaneously, which is impossible. So it is false on every row of the truth table — a contradiction.'
		})
	}}
/>

<Story
	name="With Math in Options"
	args={{
		problemId: 'math-opts-1',
		data: createMcqData({
			type: 'mcq',
			question: 'If $P$ is true and $Q$ is false, what is the truth value of $P \\to Q$?',
			options: ['True', 'False', 'Unknown', 'Both True and False'],
			answer: 'False',
			hint: 'An implication $P \\to Q$ is false when $P$ is true and $Q$ is false.',
			walkthrough:
				'An implication is false in exactly one case: when the antecedent is true and the consequent is false. Here $P$ = true and $Q$ = false, so $P \\to Q$ = false.'
		})
	}}
/>

<Story
	name="Diagnostic Mode"
	args={{
		problemId: 'diag-1',
		data: createMcqData({
			type: 'mcq',
			question: 'What logical connective does "$\\land$" represent?',
			options: ['AND (conjunction)', 'OR (disjunction)', 'NOT (negation)', 'IF-THEN (implication)'],
			answer: 'AND (conjunction)',
			hint: 'Think about what "and" means in everyday language.',
			walkthrough:
				'$\\land$ is the conjunction symbol, read as "and". $P \\land Q$ is true only when both $P$ and $Q$ are true.'
		})
	}}
/>

<Story
	name="Long Question"
	args={{
		problemId: 'long-1',
		data: createMcqData({
			type: 'mcq',
			question:
				'Consider the argument: "If it rains, the ground gets wet. The ground is wet. Therefore, it rained." This is an example of which logical fallacy?',
			options: [
				'Affirming the consequent',
				'Denying the antecedent',
				'Modus ponens',
				'Modus tollens'
			],
			answer: 'Affirming the consequent',
			hint: 'This fallacy assumes $Q \\to P$ from $P \\to Q$.',
			walkthrough:
				'This is **affirming the consequent**: from $P \\to Q$ and $Q$, incorrectly concluding $P$. The ground could be wet for other reasons (a sprinkler, a flood), so knowing the ground is wet does not prove it rained.'
		})
	}}
/>

<Story
	name="Many Options"
	args={{
		problemId: 'many-1',
		data: createMcqData({
			type: 'mcq',
			question: 'Which of the following formulas is a tautology?',
			options: [
				'$P \\land Q$',
				'$P \\lor Q$',
				'$P \\to Q$',
				'$P \\lor \\neg P$',
				'$P \\land \\neg P$',
				'$\\neg P$'
			],
			answer: '$P \\lor \\neg P$',
			hint: 'A tautology is always true regardless of the truth values of its variables.',
			walkthrough:
				'$P \\lor \\neg P$ is always true: if $P$ is true the left disjunct is true; if $P$ is false the right disjunct ($\\neg P$) is true. This is the **law of excluded middle**.'
		})
	}}
/>
