import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Alert',
	summary: 'An inline message that tells people something about the page they are on.',
	description: `The alert sits in the flow of the page, next to the thing it is about. It takes a \`tone\` for what it means and a \`variant\` for how loudly it says it: a quiet tinted fill, a hairline outline, or a solid block.

Each tone brings its own icon, and a title, a body and a row of actions can be stacked inside. A dismissible alert springs closed and collapses its own height, so the content beneath it glides up rather than jumping.`,
	features: [
		'Five tones and three variants, shared with the rest of the status vocabulary',
		'A default icon per tone, replaceable or removable',
		'Springs closed and collapses its height when dismissed',
		'An actions slot for buttons and links'
	],
	accessibility: [
		'Danger and warning alerts use role="alert", so assistive technology announces them immediately.',
		'Info, success and neutral alerts use role="status", a polite live region announced when the reader is idle.',
		'Pass your own role to override the default, for example role="note" for static content that is present on load.',
		'Icons are decorative and hidden from assistive technology; the tone is never conveyed by colour alone, because the title and message carry the meaning.',
		'The dismiss button is a native button labelled "Dismiss" with a visible keyboard focus ring.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the dismiss button and any actions.' },
		{ keys: 'Enter / Space', action: 'Dismisses the alert when the dismiss button is focused.' }
	],
	related: ['banner', 'toast']
});
