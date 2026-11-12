import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'PasswordInput',
	summary: 'A password field with a reveal toggle, an optional strength meter, and a Caps Lock hint.',
	description: `\`PasswordInput\` is an \`Input\` with \`type="password"\` and a trailing button that reveals or hides the text. The button stays out of the tab order; the input remains one tab stop.

Add \`strength\` for a meter under the field, scored from length and the mix of lower case, upper case, digits and symbols. While the field is focused and the text is hidden, a Caps Lock key is announced under the field and linked with \`aria-describedby\`.`,
	features: [
		'Reveal toggle with a pressed state',
		'Optional strength meter (track, fill, vars)',
		'Caps Lock hint while the field is focused',
		'Same variants, sizes and shapes as Input',
		'Joins a Field automatically'
	],
	accessibility: [
		'Renders a native password input; label, hint and error come from Field.',
		'The reveal button has an accessible name, aria-pressed for the revealed state, and is not a tab stop.',
		'The strength meter is a role="meter" with a text value (Weak, Fair, Strong) and is linked with aria-describedby.',
		'The Caps Lock hint is linked with aria-describedby and is not shown when the password is already revealed.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus into and out of the field. The reveal button is not a tab stop.' }
	],
	related: ['field', 'input']
});
