import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'InputGroup',
	summary: 'A field frame that holds an input with leading and trailing addons — text, icons or buttons.',
	description: `\`InputGroup\` is the same \`.field\` frame as Input, opened up so you can compose what sits on either side of the text. A scheme prefix, a unit, a search icon or a Copy button all live inside one border, and the frame still draws the focus ring.

Do not put an \`Input\` inside the group — that would nest two frames. Use \`InputGroupInput\` for the text, \`InputGroupText\` for a prefix or suffix, and \`InputGroupButton\` for an action. Inside a \`Field\` the group takes its id, description and invalid state from context.`,
	parts: {
		InputGroupAddon: 'A start or end cluster of icons, text or buttons.',
		InputGroupInput: 'The bare text input inside the frame.',
		InputGroupText: 'Muted prefix or suffix text, such as a scheme or a unit.',
		InputGroupButton: 'A compact ghost button sized to the group, for an action such as Copy.'
	},
	features: [
		'One shared field frame, with the same variants, sizes and shapes as Input',
		'Leading and trailing addons for text, icons and buttons',
		'Joins a Field automatically',
		'Frame-level focus ring and invalid styling'
	],
	accessibility: [
		'The text is a native <input>; label, description and error come from Field via for, aria-describedby and aria-invalid.',
		'Icon-only InputGroupButton controls need an aria-label.',
		'Without a Field, give the input an aria-label or associate a <label> yourself.',
		'The focus ring is drawn on the frame with :focus-within.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the input, then to any button inside the group.' },
		{ keys: 'Enter', action: 'Activates the focused InputGroupButton.' }
	],
	related: ['input', 'field']
});
