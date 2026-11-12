import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Input',
	summary: 'A single-line text input in a framed field, with icons, prefixes, suffixes and a clear button.',
	description: `\`Input\` is the base of the text-entry kit. The visible box is a \`.field\` frame and the native \`<input>\` inside it is bare, so the frame — not the browser — draws the focus ring, and leading and trailing content sits inside the same border.

Inside a \`Field\` it takes its \`id\`, description, invalid and required state from context. Outside one, pass them yourself. Every other attribute (\`type\`, \`placeholder\`, \`name\`, \`autocomplete\`, \`inputmode\`, event handlers) goes to the native input; \`class\` goes to the frame.

The value is bindable and also reported through \`onValueChange\`, so it works controlled or uncontrolled.`,
	features: [
		'Three variants, five sizes and five shapes — the same axes as Button',
		'Leading icon, leading and trailing snippets',
		'Clearable, with a spring-in clear button and Escape to clear',
		'Joins a Field automatically',
		'Frame-level focus ring and invalid styling'
	],
	accessibility: [
		'Renders a native <input>; label, description and error come from Field via for, aria-describedby and aria-invalid.',
		'Decorative icons are hidden from assistive technology. The clear button has an accessible name and stays out of the tab order, because Escape does the same job.',
		'Without a Field, give the input an aria-label or associate a <label> yourself.',
		'The focus ring is drawn on the frame with :focus-within, so it is visible for keyboard and pointer focus alike.'
	],
	keyboard: [
		{ keys: 'Escape', action: 'Clears the text when clearable and not empty.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the field.' }
	],
	related: ['field', 'textarea', 'password-input', 'search-input', 'number-input']
});
