import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Aurora',
	summary: 'Slow drifting blurred colour fields, used as a section background, with children on top.',
	description: `Aurora paints two overlapping, heavily blurred colour fields whose hues are offset from the current \`--hue\`. They drift on a transform, so the motion stays on the compositor, and they pause under reduced motion — the fields remain, they just stop moving.

Children are rendered on top. Intensity and speed are written as custom properties, so the same section can sit quietly behind a hero or move a little more on a feature band.`,
	features: [
		'Theme-derived hues offset from --hue',
		'Configurable intensity and drift speed',
		'Children sit above the fields',
		'Pauses under reduced motion, GPU-friendly transforms'
	],
	accessibility: [
		'The colour fields are decorative pseudo-elements and are not exposed to assistive technology. The children are the accessible content.'
	],
	related: ['pattern', 'gradient-text', 'glass-panel']
});
