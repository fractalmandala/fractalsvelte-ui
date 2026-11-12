import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Slider',
	summary: 'A single-value or range slider with pointer drag, full keyboard control and a springing thumb.',
	description: `The slider draws a \`.track\`, a \`.fill\` and one or two \`.thumb\` elements, all driven by the custom properties \`--value\` and \`--from\`. Pass a number for a single value or a \`[low, high]\` pair for a range.

Dragging uses pointer capture, so it keeps tracking outside the control and works for mouse, touch and pen. Clicking the track makes the nearest thumb spring to that position; while dragging, the thumb follows the pointer without lag.`,
	features: [
		'Single value or two-thumb range through one bindable value',
		'min, max and step, with snapping for pointer and keyboard',
		'Horizontal and vertical orientations',
		'Tick marks, with optional labels',
		'Value bubble on hover, focus and drag; custom formatting',
		'Hidden inputs submit the value with a form'
	],
	accessibility: [
		'Each thumb has role="slider" with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext (from format).',
		'Name it with label; a range names its thumbs "minimum" and "maximum".',
		'aria-orientation reflects the orientation; disabled sets aria-disabled and removes the thumbs from the tab order.',
		'The thumb shows a focus ring for keyboard focus only.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Up', action: 'Increases the value by one step.' },
		{ keys: 'Arrow Left / Arrow Down', action: 'Decreases the value by one step.' },
		{ keys: 'Page Up / Page Down', action: 'Changes the value by about a tenth of the range.' },
		{ keys: 'Home / End', action: 'Jumps to the minimum or the maximum.' }
	],
	related: ['rating', 'switch']
});
