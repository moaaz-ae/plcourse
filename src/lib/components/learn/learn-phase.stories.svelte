<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LearnPhase from './learn-phase.svelte';
	import { renderProblem } from '$lib/renderer';
	import type { Topic, Slide, GeneratedProblem } from '$lib/types';

	const mockProblems: GeneratedProblem[] = [
		{
			type: 'mcq',
			question: 'What is the capital of France?',
			options: ['London', 'Berlin', 'Paris', 'Madrid'],
			answer: 'Paris',
			hint: 'It is known as the city of light.',
			walkthrough:
				'Paris is the capital and largest city of France, located in northern France on the river Seine.',
			tags: ['geography']
		},
		{
			type: 'assertion-judgment',
			question: 'Is the following argument **valid** or **invalid**?',
			premises: ['$P \\to Q$', '$P$'],
			conclusion: '$Q$',
			isValid: true,
			answer: 'valid',
			hint: 'This is Modus Ponens.',
			walkthrough:
				'**Modus Ponens**: from $P \\to Q$ and $P$, conclude $Q$. There is no row where the premises are true and $Q$ is false.'
		},
		{
			type: 'formula-builder',
			question: 'Translate: "If it rains, then the ground is wet."',
			variableMap: { P: 'it rains', Q: 'the ground is wet' },
			answer: 'P \\to Q',
			hint: 'Use $\\to$ for "if...then".',
			walkthrough:
				'"If it rains" → $P$. "The ground is wet" → $Q$. "If...then" → $\\to$. Result: $P \\to Q$.'
		}
	];

	const mockSlides: Slide[] = [
		{
			type: 'content',
			html: '<h2>Welcome to the Learn Phase</h2><p>Here you will learn about basic logic concepts.</p>'
		},
		{
			type: 'problem',
			filter: { type: 'mcq' }
		},
		{
			type: 'content',
			html: '<h2>Next up</h2><p>Let us try an assertion judgment.</p>'
		},
		{
			type: 'problem',
			filter: { type: 'assertion-judgment' }
		},
		{
			type: 'problem',
			filter: { type: 'formula-builder' }
		}
	];

	const mockTopic: Topic = {
		id: 'logic-intro',
		title: 'Introduction to Logic',
		prerequisites: [],
		slides: mockSlides,
		problems: mockProblems,
		renderedProblems: mockProblems.map(renderProblem)
	};

	const { Story } = defineMeta({
		title: 'Phases/LearnPhase',
		component: LearnPhase,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'The Learn Phase component handles the sequence of content and problem slides.'
				}
			}
		}
	});

	function handleStartTest() {
		alert('onStartTest called');
	}
</script>

<Story
	name="Default"
	args={{
		topic: mockTopic,
		slides: mockTopic.slides,
		onStartTest: handleStartTest
	}}
/>

<Story
	name="Problems Only"
	args={{
		topic: mockTopic,
		slides: mockTopic.slides.filter((s) => s.type === 'problem'),
		onStartTest: handleStartTest
	}}
/>

<Story
	name="Content Only"
	args={{
		topic: mockTopic,
		slides: mockTopic.slides.filter((s) => s.type === 'content'),
		onStartTest: handleStartTest
	}}
/>
