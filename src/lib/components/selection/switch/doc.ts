import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Switch',
	summary: 'An on/off switch with a real sliding thumb that overshoots as it settles.',
	description: `The switch is a native checkbox with \`role="switch"\`, drawn as a \`.track\` and a \`.thumb\`. The thumb is a real element on a bouncy spring, so it slides, overshoots and settles, and the theme-coloured fill fades in behind it.

Use a switch for settings that take effect immediately; use a checkbox when the choice is submitted later with a form. The state is rendered from the input itself, so a server-rendered switch is already in the right position.`,
	features: [
		'Real input with role="switch": name, value and form reset work',
		'Sliding thumb on a bouncy spring, no gradient trick',
		'Label and description, on either side',
		'Five sizes, invalid and disabled states'
	],
	accessibility: [
		'Renders a native checkbox with role="switch" inside a <label>, so assistive technology announces on/off and the label text toggles it.',
		'The description is linked with aria-describedby.',
		'invalid sets aria-invalid="true" and a danger border.',
		'Reduced motion removes the spring; the thumb jumps to its position.'
	],
	keyboard: [
		{ keys: 'Space', action: 'Flips the switch.' },
		{ keys: 'Tab', action: 'Moves focus to the next control.' }
	],
	related: ['checkbox', 'segmented-control']
});
