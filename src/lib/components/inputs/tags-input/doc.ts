import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'TagsInput',
	summary: 'A field of tokens: add a tag with Enter, a comma or paste, and remove it with Backspace or its × button.',
	description: `Tags live inside the same frame as \`Input\`. Type a label and press Enter or comma to add it; paste a comma- or newline-separated list to add several at once. Backspace in an empty typing area removes the last tag; each tag also has a remove button. New tags enter with a spring.

\`max\` caps the list, \`allowDuplicates\` lets the same label appear more than once, and \`validate\` can reject a tag (return \`false\` or an error message). The typing area joins a \`Field\` automatically.`,
	features: [
		'Add on Enter, comma, paste and blur',
		'Remove with Backspace or a button',
		'max, validate and allowDuplicates',
		'Spring scale as tags enter',
		'Same variants, sizes and shapes as Input'
	],
	accessibility: [
		'The typing area is a native input whose id matches the Field label. Hint and error are linked with aria-describedby.',
		'Each remove button has an accessible name (Remove Design, and so on).',
		'A rejected tag is explained in a text message linked with aria-describedby.',
		'When the list is at max, the input is disabled and further additions are ignored.'
	],
	keyboard: [
		{ keys: 'Enter / Comma', action: 'Adds the text in the typing area as a tag.' },
		{ keys: 'Backspace', action: 'Removes the last tag when the typing area is empty.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the typing area; blur also adds a pending tag.' }
	],
	related: ['field', 'input']
});
