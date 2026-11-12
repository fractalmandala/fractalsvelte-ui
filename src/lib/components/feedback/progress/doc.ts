import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Progress',
	summary: 'A linear bar that shows how far a task has come, or that work is underway.',
	description: `The bar is a native progressbar: a track, a fill, and an optional label and percentage. The fill width rides the shared \`--value\` channel and glides to its new position on the spring, so a jump from 20% to 80% settles rather than snapping.

An indeterminate bar is for work whose length is unknown — a long query, a connection being opened. It slides a short fill along the track and omits \`aria-valuenow\`, so assistive technology reports the task as busy rather than as a number.`,
	features: [
		'Determinate and indeterminate modes',
		'Five tones and five sizes',
		'Optional label and tabular percentage',
		'Optional striped fill',
		'Fill width glides on the spring'
	],
	accessibility: [
		'Renders role="progressbar" with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext in determinate mode.',
		'In indeterminate mode the value attributes are omitted, so the control is announced as busy rather than as a percentage.',
		'Pass label to give the bar an accessible name; the visible label and the accessible name are the same string.'
	],
	related: ['progress-ring', 'spinner', 'skeleton']
});
