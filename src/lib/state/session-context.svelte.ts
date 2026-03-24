import { createContext } from 'svelte';

export interface QuestionEnv {
	readonly status: 'idle' | 'correct' | 'wrong';
	readonly disabled: boolean;
	readonly diagnostic: boolean;
	readonly submissionCount: number;
	onAnswer: (correct: boolean, serialized: string) => void;
}

export const [getQuestionEnv, setQuestionEnv] = createContext<QuestionEnv>();
