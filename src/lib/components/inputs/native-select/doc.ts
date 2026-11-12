import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'NativeSelect',
	summary: 'A styled native select in the same field frame as Input, with options, optgroups and a chevron.',
	description: `\`NativeSelect\` is the platform \`<select>\`: the browser draws the menu, the field frame draws the focus ring, and a chevron sits at the end of the frame. Use it when a short, known list does not need the search or virtualisation of Select.

Inside a \`Field\` it takes its \`id\`, description, invalid and required state from context. Pass \`options\` as a list of values and optional groups, or write \`<option>\` and \`<optgroup>\` yourself as children. The value is bindable and also reported through \`onValueChange\`.`,
	features: [
		'Three variants, five sizes and five shapes — the same axes as Input',
		'Options and optgroups from a list, or as children',
		'Placeholder option when nothing is selected',
		'Joins a Field automatically',
		'Frame-level focus ring and invalid styling'
	],
	accessibility: [
		'Renders a native <select>; label, description and error come from Field via for, aria-describedby and aria-invalid.',
		'The chevron is decorative and hidden from assistive technology.',
		'Without a Field, give the select an aria-label or associate a <label> yourself.',
		'The focus ring is drawn on the frame with :focus-within, so it is visible for keyboard and pointer focus alike.'
	],
	keyboard: [
		{ keys: 'Space / Enter / Arrow keys', action: 'Opens the menu and moves between options, as the platform select does.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the field.' }
	],
	related: ['field', 'input']
});
