import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'PinInput',
	summary: 'A row of cells for one-time codes and PINs, with paste distribution, auto-advance, and a spring pop as each cell fills.',
	description: `Each cell is a single character of a code. Typing advances to the next cell; Backspace on an empty cell returns to the previous one and clears it. Pasting a code (from an SMS, a password manager, the clipboard) distributes characters across the cells from the caret.

The first cell carries \`autocomplete="one-time-code"\`, so platforms that offer a received code can fill the group in one step. \`type="numeric"\` accepts digits only; \`alphanumeric\` accepts letters too. \`mask\` hides the characters. A filled cell pops with a spring.

Inside a \`Field\`, the group is named by the label (\`aria-labelledby\`) and the first cell receives the label's \`for\`.`,
	features: [
		'Configurable length',
		'Numeric or alphanumeric',
		'Optional mask',
		'Paste distribution and auto-advance',
		'Spring pop on each filled cell',
		'one-time-code autocomplete',
		'Same variants, sizes and shapes as Input'
	],
	accessibility: [
		'The cells are a group, named by the Field label through aria-labelledby. Each cell has its own accessible name (Digit 1 of 6, and so on).',
		'The first input has autocomplete="one-time-code" and carries the Field id, so clicking the label focuses it.',
		'aria-invalid and aria-describedby are applied to the group and to each cell.',
		'mask uses type="password" on every cell, so assistive technology does not read the code aloud as it is typed.'
	],
	keyboard: [
		{ keys: 'A character', action: 'Fills the current cell and advances to the next empty one.' },
		{ keys: 'Backspace', action: 'Clears the current cell, or the previous cell when the current one is empty.' },
		{ keys: 'Arrow Left / Right', action: 'Moves between cells.' },
		{ keys: 'Home / End', action: 'Moves to the first or last cell.' }
	],
	related: ['field', 'input']
});
