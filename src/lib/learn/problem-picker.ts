import type { GeneratedProblem, ProblemType, RenderedProblem } from '$lib/types';

interface ProblemFilter {
	type?: ProblemType;
	tags?: string[];
}

interface PickRenderedProblemParams {
	problems: GeneratedProblem[];
	renderedProblems?: RenderedProblem[];
	usedIndices: Set<number>;
	candidateIndices?: number[];
	random?: () => number;
}

interface PickRenderedProblemResult {
	rendered: RenderedProblem | null;
	usedIndices: Set<number>;
	error: string | null;
}

export function getCandidateProblemIndices(
	problems: GeneratedProblem[],
	filter?: ProblemFilter
): number[] {
	let candidates = problems.map((problem, index) => ({ problem, index }));

	if (filter?.type) {
		candidates = candidates.filter((candidate) => candidate.problem.type === filter.type);
	}

	if (filter?.tags?.length) {
		candidates = candidates.filter((candidate) => {
			if (!candidate.problem.tags?.length) return false;
			return filter.tags!.every((tag) => candidate.problem.tags!.includes(tag));
		});
	}

	return candidates.map((candidate) => candidate.index);
}

export function pickRenderedProblem({
	problems,
	renderedProblems,
	usedIndices,
	candidateIndices,
	random = Math.random
}: PickRenderedProblemParams): PickRenderedProblemResult {
	if (!problems.length) {
		return {
			rendered: null,
			usedIndices,
			error: 'No problems available for this topic.'
		};
	}

	const candidates = candidateIndices ?? problems.map((_, index) => index);
	if (!candidates.length) {
		return {
			rendered: null,
			usedIndices,
			error: 'No problems match the filter criteria.'
		};
	}

	const renderedPool = renderedProblems ?? [];
	if (renderedPool.length !== problems.length) {
		return {
			rendered: null,
			usedIndices,
			error: 'Rendered problems are unavailable for this topic.'
		};
	}

	const normalizedUsed =
		usedIndices.size >= problems.length ? new Set<number>() : new Set(usedIndices);
	let available = candidates.filter((index) => !normalizedUsed.has(index));
	if (!available.length) {
		available = candidates;
	}

	const selectedIndex = available[Math.floor(random() * available.length)];
	const nextUsed = new Set(normalizedUsed);
	nextUsed.add(selectedIndex);

	const rendered = renderedPool[selectedIndex];
	if (!rendered) {
		return {
			rendered: null,
			usedIndices: nextUsed,
			error: 'Failed to load rendered problem.'
		};
	}

	return {
		rendered,
		usedIndices: nextUsed,
		error: null
	};
}
