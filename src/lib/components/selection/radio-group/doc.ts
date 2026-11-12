import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'RadioGroup',
	summary: 'A set of native radios with a bindable value, as plain rows or selectable cards.',
	description: `\`RadioGroup\` owns the selected \`value\` and hands a shared \`name\` to each \`Radio\`, so the browser groups them natively: arrow keys move and select, Tab enters the group once, and the value submits with a form.

The \`card\` variant turns each radio into a bordered card with a title and a description, lit with a theme-coloured edge when selected. Both variants lay out vertically or horizontally.`,
	parts: { Radio: 'One option in the group: a native radio with a label and an optional description.' },
	features: [
		'Native radios: arrow-key navigation, form submission and reset for free',
		'Default and card variants',
		'Vertical or horizontal layout',
		'Group-level disabled and invalid, per-radio disabled',
		'The dot springs when selected'
	],
	accessibility: [
		'The group has role="radiogroup"; name it with aria-label or aria-labelledby.',
		'Each option is a native radio inside a <label>, so the label text is its accessible name and clicking it selects.',
		'Descriptions are linked with aria-describedby.',
		'invalid sets aria-invalid on the group and a danger border on every radio.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus into the group, onto the selected radio (or the first).' },
		{ keys: 'Arrow keys', action: 'Move to the next or previous radio and select it.' },
		{ keys: 'Space', action: 'Selects the focused radio.' }
	],
	related: ['checkbox', 'segmented-control']
});
