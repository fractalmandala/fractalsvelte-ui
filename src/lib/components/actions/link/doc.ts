import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Link',
	summary: 'A text link with three inks and a quiet, fading underline.',
	description: `The link is a plain \`<a>\` dressed in fractalstyler's link classes. \`theme\` takes the accent colour, \`plain\` stays in the body ink and warms on hover, and \`subtle\` sits back in secondary ink for footers and metadata.

The underline is typographic rather than decorative: one pixel, offset from the baseline, and by default it fades in only on hover. Mark a link \`external\` and it opens in a new tab with a safe \`rel\`, a small arrow and a hidden announcement.`,
	features: [
		'Three inks: theme, plain, subtle',
		'Underline on hover, always, or never',
		'External links: new tab, noopener noreferrer, arrow icon, screen-reader hint',
		'Visible focus ring for keyboard users'
	],
	accessibility: [
		'Renders a native <a>, so it is announced as a link and works with the browser\'s own shortcuts.',
		'External links append a visually hidden "(opens in a new tab)".',
		'The arrow icon is decorative and hidden from assistive technology.',
		'A link without an underline relies on colour alone; prefer underline="always" inside running text.'
	],
	keyboard: [
		{ keys: 'Enter', action: 'Follows the link.' },
		{ keys: 'Tab', action: 'Moves focus to the next focusable element.' }
	],
	related: ['button']
});
