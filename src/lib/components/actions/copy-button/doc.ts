import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'CopyButton',
	summary: 'Copies text to the clipboard and confirms it with a spring-morphed check.',
	description: `The copy button writes \`text\` to the clipboard and answers with a small, unmistakable change: the copy glyph shrinks away and a check springs in, then everything settles back after \`timeout\`.

It is icon-only by default; give it children to show a visible label that swaps to \`copiedLabel\`. The result is announced politely to screen readers through a live region, so the confirmation is never visual-only.`,
	features: [
		'Spring morph from copy to check, interruptible and reduced-motion safe',
		'Screen-reader announcement through an aria-live region',
		'Icon-only or labelled',
		'onCopy callback with the copied text',
		'Shares variants, sizes and shapes with Button'
	],
	accessibility: [
		'Renders a native <button>; an icon-only one is named by label.',
		'After a copy, copiedLabel is announced through a polite live region (role="status").',
		'Does nothing, and announces nothing, if the browser refuses the clipboard write.',
		'The clipboard API needs a secure context (HTTPS or localhost).'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Copies the text.' },
		{ keys: 'Tab', action: 'Moves focus to the next focusable element.' }
	],
	related: ['icon-button', 'button']
});
