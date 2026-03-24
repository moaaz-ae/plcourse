/**
 * FSRS scheduler configured for lesson-based learning.
 *
 * - enable_fuzz: Spreads reviews across days to avoid clustering
 * - enable_short_term: Uses BasicScheduler with learning/relearning steps
 *   (defaults: learning ['1m', '10m'], relearning ['10m'])
 */
import { fsrs, generatorParameters } from 'ts-fsrs';

export { State, Rating, type Grade, type Card, type FSRSHistory, createEmptyCard } from 'ts-fsrs';

export const scheduler = fsrs(
	generatorParameters({
		enable_fuzz: true,
		enable_short_term: true
	})
);
