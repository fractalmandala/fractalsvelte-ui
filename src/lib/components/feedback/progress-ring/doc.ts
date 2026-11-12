import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ProgressRing',
	summary: 'A circular meter that shows how far a task has come, with a label in the centre.',
	description: `The ring is the same \`--value\` channel as the linear bar, drawn as a conic fill. A label or any children sit in the centre of the ring.

Thickness follows the text scale — a property the ring already uses for its stroke — so a thicker ring is just a larger type size, not a new shape. An indeterminate ring spins a partial fill for work whose length is unknown.`,
	features: [
		'Determinate and indeterminate modes',
		'Five diameters and three stroke thicknesses',
		'Five tones',
		'Centred label or custom children'
	],
	accessibility: [
		'Renders role="progressbar" with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext in determinate mode.',
		'In indeterminate mode the value attributes are omitted, so the control is announced as busy rather than as a percentage.',
		'Pass label to give the ring an accessible name and, when children are omitted, to set the centre text.'
	],
	related: ['progress', 'spinner']
});
