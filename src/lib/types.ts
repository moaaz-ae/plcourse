// Re-export from ts-fsrs - these are the canonical FSRS state and rating enums
export { State, Rating, type Grade } from 'ts-fsrs';

export type ProblemType = 'mcq' | 'truth-table' | 'assertion-judgment' | 'formula-builder';

interface BaseGeneratedProblem {
	type: ProblemType;
	question: string;
	answer: string;
	hint: string;
	walkthrough: string;
	tags?: string[];
}

export interface McqProblem extends BaseGeneratedProblem {
	type: 'mcq';
	options: string[];
}

export interface TruthTableProblem extends BaseGeneratedProblem {
	type: 'truth-table';
	headers: string[];
	expectedTable: boolean[][];
	hiddenColumns?: number[];
}

export interface AssertionJudgmentProblem extends BaseGeneratedProblem {
	type: 'assertion-judgment';
	premises: string[];
	conclusion: string;
	isValid: boolean;
	counterexample?: Record<string, boolean>;
}

export interface FormulaBuilderProblem extends BaseGeneratedProblem {
	type: 'formula-builder';
	variableMap: Record<string, string>;
}

export type GeneratedProblem =
	| McqProblem
	| TruthTableProblem
	| AssertionJudgmentProblem
	| FormulaBuilderProblem;

export interface RenderedProblem extends BaseGeneratedProblem {
	questionHtml: string;
	hintHtml: string;
	walkthroughHtml: string;

	options?: string[];
	headers?: string[];
	expectedTable?: boolean[][];
	hiddenColumns?: number[];
	premises?: string[];
	conclusion?: string;
	isValid?: boolean;
	counterexample?: Record<string, boolean>;
	variableMap?: Record<string, string>;

	optionsHtml?: string[];
	headersHtml?: string[];
	premisesHtml?: string[];
	conclusionHtml?: string;
	variableKeysHtml?: Record<string, string>;
}

export type Slide =
	| { type: 'content'; html: string }
	| {
			type: 'problem';
			filter?: {
				tags?: string[];
				type?: ProblemType;
			};
	  };

interface TopicMetadata {
	id: string;
	title: string;
	prerequisites: Array<{ id: string; weight: number }>;
}

export interface Topic extends TopicMetadata {
	problems: GeneratedProblem[];
	renderedProblems?: RenderedProblem[];

	slides: Slide[];
}

export interface KnowledgeGraph {
	topics: Record<string, Topic>;
	topologicalOrder: string[];
	depthMap: Map<string, number>;
	milestones: string[];
}
