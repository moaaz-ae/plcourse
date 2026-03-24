<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import QuestionAssertionJudgment from './question-assertion-judgment.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { GeneratedProblem } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Questions/AssertionJudgment',
		component: QuestionAssertionJudgment,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Assertion judgment component. Users determine if an argument is valid or invalid. For invalid arguments, they must provide a counterexample showing truth values that make premises true but conclusion false.'
				}
			}
		}
	});

	function createAssertionData(problem: GeneratedProblem) {
		return renderProblem(problem);
	}
</script>

<Story
	name="Modus Ponens (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$P$'],
			conclusion: '$Q$',
			isValid: true,
			answer: 'valid',
			hint: 'This is the classic Modus Ponens rule: if P implies Q, and P is true, then Q must be true.',
			walkthrough:
				'**Modus Ponens**: from $P \\to Q$ and $P$, conclude $Q$. There is no assignment where both premises are true and $Q$ is false — if $P$ is true and $P \\to Q$ holds, $Q$ must be true.'
		})
	}}
/>

<Story
	name="Modus Tollens (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$\\neg Q$'],
			conclusion: '$\\neg P$',
			isValid: true,
			answer: 'valid',
			hint: 'Modus Tollens: if P implies Q, and Q is false, then P must be false.',
			walkthrough:
				'**Modus Tollens**: if $P \\to Q$ and $\\neg Q$, then $\\neg P$. If $Q$ is false and the implication holds, $P$ cannot be true (that would make $Q$ true — contradiction).'
		})
	}}
/>

<Story
	name="Hypothetical Syllogism (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$Q \\to R$'],
			conclusion: '$P \\to R$',
			isValid: true,
			answer: 'valid',
			hint: 'Hypothetical Syllogism chains implications together.',
			walkthrough:
				'From $P \\to Q$ and $Q \\to R$, we can chain: if $P$ is true, then $Q$ is true (by premise 1), so $R$ is true (by premise 2). Therefore $P \\to R$.'
		})
	}}
/>

<Story
	name="Disjunctive Syllogism (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\lor Q$', '$\\neg P$'],
			conclusion: '$Q$',
			isValid: true,
			answer: 'valid',
			hint: 'If one disjunct is false, the other must be true.',
			walkthrough:
				'From $P \\lor Q$, at least one of $P$ or $Q$ is true. Since $\\neg P$ tells us $P$ is false, $Q$ must be the true one.'
		})
	}}
/>

<Story
	name="Affirming the Consequent (Invalid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$Q$'],
			conclusion: '$P$',
			isValid: false,
			counterexample: { P: false, Q: true },
			answer: 'invalid',
			hint: 'This is the fallacy of affirming the consequent. Q could be true for other reasons.',
			walkthrough:
				'Counterexample: $P$ = false, $Q$ = true. Then $P \\to Q$ = true (false antecedent) and $Q$ = true, but $P$ = false. So the premises are true and the conclusion is false — **invalid**.'
		})
	}}
/>

<Story
	name="Denying the Antecedent (Invalid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$\\neg P$'],
			conclusion: '$\\neg Q$',
			isValid: false,
			counterexample: { P: false, Q: true },
			answer: 'invalid',
			hint: 'This is the fallacy of denying the antecedent. Q might still be true even if P is false.',
			walkthrough:
				'Counterexample: $P$ = false, $Q$ = true. Both premises hold ($P \\to Q$ is vacuously true, $\\neg P$ is true) but $\\neg Q$ = false. So it is **invalid**.'
		})
	}}
/>

<Story
	name="Three Variables (Invalid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$R \\to Q$'],
			conclusion: '$P \\to R$',
			isValid: false,
			counterexample: { P: true, Q: true, R: false },
			answer: 'invalid',
			hint: 'Just because P and R both imply Q does not mean P implies R.',
			walkthrough:
				'Counterexample: $P$ = true, $Q$ = true, $R$ = false. Both premises are satisfied, but $P \\to R$ = false. Two things sharing a consequence do not imply each other.'
		})
	}}
/>

<Story
	name="Conjunction Elimination (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\land Q$'],
			conclusion: '$P$',
			isValid: true,
			answer: 'valid',
			hint: 'From a conjunction, you can derive either conjunct.',
			walkthrough:
				'If $P \\land Q$ is true, both $P$ and $Q$ are true. So $P$ is definitely true. This is the **conjunction elimination** rule.'
		})
	}}
/>

<Story
	name="Disjunction Introduction (Valid)"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P$'],
			conclusion: '$P \\lor Q$',
			isValid: true,
			answer: 'valid',
			hint: 'You can always add a disjunct to a true statement.',
			walkthrough:
				'If $P$ is true, then $P \\lor Q$ is true regardless of $Q$ — a disjunction is true whenever at least one disjunct is true. This is **disjunction introduction**.'
		})
	}}
/>

<Story
	name="Diagnostic Mode"
	args={{
		data: createAssertionData({
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$P$'],
			conclusion: '$Q$',
			isValid: true,
			answer: 'valid',
			hint: 'This is Modus Ponens.',
			walkthrough:
				'Modus Ponens: from $P \\to Q$ and $P$, we can conclude $Q$. The argument is valid.'
		})
	}}
/>
