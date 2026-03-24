<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TestPhase from './test-phase.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { Topic, GeneratedProblem } from '$lib/types';

	const mockProblems: GeneratedProblem[] = [
		{
			type: 'mcq',
			question: 'Question 1: What is the capital of France?',
			options: ['London', 'Berlin', 'Paris', 'Madrid'],
			answer: 'Paris',
			hint: 'It is known as the city of light.',
			walkthrough: 'Paris is the capital and largest city of France.'
		},
		{
			type: 'assertion-judgment',
			question: 'Question 2: Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$P$'],
			conclusion: '$Q$',
			isValid: true,
			answer: 'valid',
			hint: 'This is Modus Ponens.',
			walkthrough: '**Modus Ponens**: from $P \\to Q$ and $P$, conclude $Q$. The argument is valid.'
		},
		{
			type: 'formula-builder',
			question: 'Question 3: Translate: "If it rains, then the ground is wet."',
			variableMap: { P: 'it rains', Q: 'the ground is wet' },
			answer: 'P \\to Q',
			hint: 'Use $\\to$ for "if...then".',
			walkthrough: '"If it rains" → $P$. "The ground is wet" → $Q$. Result: $P \\to Q$.'
		},
		{
			type: 'mcq',
			question: 'Question 4: Which of these is a valid logical operator?',
			options: ['AND', 'OR', 'NOT', 'All of the above'],
			answer: 'All of the above',
			hint: 'Think about all the connectives you know.',
			walkthrough:
				'AND ($\\land$), OR ($\\lor$), and NOT ($\\neg$) are all standard propositional logic operators.'
		},
		{
			type: 'mcq',
			question: 'Question 5: What does modus ponens mean?',
			options: ['Method of affirming', 'Method of denying', 'Syllogism', 'Hypothesis'],
			answer: 'Method of affirming',
			hint: '"Ponens" comes from Latin for "to affirm".',
			walkthrough:
				'Modus ponens (Latin: "method of affirming") is the rule: from $P \\to Q$ and $P$, conclude $Q$.'
		},
		{
			type: 'assertion-judgment',
			question: 'Question 6: Is the following argument valid?',
			premises: ['$P \\to Q$', '$\\neg Q$'],
			conclusion: '$\\neg P$',
			isValid: true,
			answer: 'valid',
			hint: 'Modus Tollens.',
			walkthrough:
				'**Modus Tollens**: from $P \\to Q$ and $\\neg Q$, conclude $\\neg P$. The argument is valid.'
		}
	];

	const mockTopic: Topic = {
		id: 'logic-test',
		title: 'Logic Test',
		prerequisites: [],
		slides: [],
		problems: mockProblems,
		renderedProblems: mockProblems.map(renderProblem)
	};

	const { Story } = defineMeta({
		title: 'Phases/TestPhase',
		component: TestPhase,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'The Test Phase component provides a sequence of 5 test questions, rendering appropriate questions and grading them.'
				}
			}
		}
	});
</script>

<Story
	name="Learn Mode"
	args={{
		topic: mockTopic,
		mode: 'learn'
	}}
/>

<Story
	name="Review Mode"
	args={{
		topic: mockTopic,
		mode: 'review'
	}}
/>

<Story
	name="Not Enough Problems Error"
	args={{
		topic: {
			...mockTopic,
			problems: [],
			renderedProblems: []
		},
		mode: 'learn'
	}}
/>
