import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Spinner',
	summary: 'A compact indicator that work is underway, as a ring, a row of dots, or a row of bars.',
	description: `Use a spinner when a task is short and has no measured progress — opening a menu, refreshing a list, waiting on a token. A progress bar or ring is the better choice once a percentage is known.

The ring is a partial conic fill that spins. Dots and bars stagger their motion through the shared \`--i\` channel, and every variant honours reduced motion. The label is visually hidden and announced through a status live region.`,
	features: [
		'Ring, dots and bars',
		'Five sizes and five tones',
		'A visually hidden, configurable label'
	],
	accessibility: [
		'Renders role="status" with an accessible name, so assistive technology announces the spinner politely.',
		'The visible mark is hidden from the accessibility tree; the label, defaulting to "Loading", is the announcement.',
		'Animations are disabled when the user prefers reduced motion.'
	],
	related: ['progress', 'progress-ring', 'skeleton']
});
