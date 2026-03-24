import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { DiagnosticService } from '$lib/server/services/diagnostic.service';
import * as learningLogQ from '$lib/server/queries/learning-log.queries';
import { getKnowledgeGraph } from '$lib/server/services/curriculum.service';
import { Rating, State } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { evaluateAnswer } from '$lib/answer-evaluation';
import { validateFormulaComplexity } from '$lib/logic';

function getChallengeHmacKey(): string {
	if (!env.BETTER_AUTH_SECRET) {
		throw error(500, 'BETTER_AUTH_SECRET must be set for diagnostic challenge signing.');
	}
	return env.BETTER_AUTH_SECRET;
}

function signDiagnosticChallenge(userId: string, topicId: string, problemIndex: number): string {
	return createHmac('sha256', getChallengeHmacKey())
		.update(`${userId}:${topicId}:${problemIndex}`)
		.digest('hex');
}

function verifyDiagnosticChallenge(
	challenge: string,
	userId: string,
	topicId: string,
	problemIndex: number
): boolean {
	const expected = signDiagnosticChallenge(userId, topicId, problemIndex);
	const expectedBuffer = Buffer.from(expected, 'utf8');
	const challengeBuffer = Buffer.from(challenge, 'utf8');
	if (expectedBuffer.length !== challengeBuffer.length) {
		return false;
	}
	return timingSafeEqual(expectedBuffer, challengeBuffer);
}

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/');
	}

	const diagnosticService = new DiagnosticService();

	const { topicId: nextTopicId, questionNumber } = await diagnosticService.getNextTopic(user.id);

	if (!nextTopicId) {
		redirect(302, '/visual');
	}

	const knowledgeGraph = await getKnowledgeGraph();
	const topic = knowledgeGraph.topics[nextTopicId];
	if (!topic) {
		error(500, 'Topic not found in curriculum');
	}

	if (!topic.problems || topic.problems.length === 0) {
		error(500, 'No problems available for this topic');
	}

	let selectedIndex = topic.problems.findIndex((p) => p.tags && p.tags.includes('diagnostic'));
	if (selectedIndex === -1) {
		selectedIndex = Math.floor(Math.random() * topic.problems.length);
	}
	const selectedProblem = topic.problems[selectedIndex];

	if (!selectedProblem || !selectedProblem.question || !selectedProblem.answer) {
		error(500, 'Invalid problem in topic');
	}

	const renderedProblem = topic.renderedProblems?.[selectedIndex];
	if (!renderedProblem) {
		error(500, 'Missing rendered problem in topic');
	}

	const challenge = signDiagnosticChallenge(user.id, topic.id, selectedIndex);

	return {
		topic: {
			id: topic.id,
			title: topic.title
		},
		problem: renderedProblem,
		problemId: `${topic.id}-${selectedIndex}`,
		problemIndex: selectedIndex,
		challenge,
		questionNumber
	};
};

export const actions: Actions = {
	answer: async ({ request, locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, { message: 'Unauthorized. Please sign in.' });
		}

		try {
			const formData = await request.formData();
			const userAnswer = formData.get('answer')?.toString()?.trim() || '';
			const topicId = formData.get('topicId')?.toString() || '';
			const problemIndexRaw = formData.get('problemIndex')?.toString() || '';
			const challenge = formData.get('challenge')?.toString() || '';

			const problemIndex = Number.parseInt(problemIndexRaw, 10);

			if (!topicId || !challenge || Number.isNaN(problemIndex) || problemIndex < 0) {
				return fail(400, { message: 'Missing required fields' });
			}

			if (!verifyDiagnosticChallenge(challenge, user.id, topicId, problemIndex)) {
				return fail(400, { message: 'Invalid diagnostic submission' });
			}

			const knowledgeGraph = await getKnowledgeGraph();
			const topic = knowledgeGraph.topics[topicId];
			const problem = topic?.problems?.[problemIndex];
			if (!topic || !problem) {
				return fail(400, { message: 'Invalid topic or problem reference' });
			}

			if (problem.type === 'formula-builder') {
				const violation = validateFormulaComplexity(userAnswer);
				if (violation) {
					return fail(400, { message: violation.message });
				}
			}

			const correct = evaluateAnswer(problem, userAnswer);

			await learningLogQ.logInteraction({
				user_id: user.id,
				topic_id: topicId,
				grade: correct ? Rating.Good : Rating.Again,
				elapsed_days: 0,
				scheduled_days: 0,
				state: State.New
			});

			return { success: true };
		} catch (error) {
			console.error('Diagnostic action error:', error);
			return fail(500, { message: 'Failed to process your answer.' });
		}
	}
};
