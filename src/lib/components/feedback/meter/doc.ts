import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Meter',
	summary: 'A gauge for a value on a known range, with optional low, high and optimum thresholds.',
	description: `A meter is not a progress bar. Progress tells you how far a task has come; a meter tells you where a value sits on a scale — disk used, battery left, a score out of ten.

The fill uses the same \`--value\` channel as Progress, and the optional ring is the same conic fill as ProgressRing. When you set \`low\`, \`high\` and \`optimum\`, the tone is picked with the HTML \`<meter>\` region rules: the optimum region is success, the neighbouring region is warning, and the far region is danger. Pass \`tone\` to choose the colour yourself.`,
	features: [
		'Linear bar or circular ring',
		'Low, high and optimum thresholds pick a tone',
		'Forced tone when you need a fixed colour',
		'Optional label and tabular value',
		'Five sizes and three ring thicknesses'
	],
	accessibility: [
		'Renders role="meter" with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext.',
		'Pass label to give the meter an accessible name; the visible label and the accessible name are the same string.',
		'valueText, when set, is the accessible value and the default centre text of a ring.'
	],
	related: ['progress', 'progress-ring']
});
