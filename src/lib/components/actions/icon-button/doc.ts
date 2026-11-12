import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'IconButton',
	summary: 'A square, icon-only button with a required accessible label.',
	description: `The icon button is the toolbar atom: a ghost-by-default square that carries one glyph. It shares variants, sizes and shapes with the \`Button\`, so a row of icon buttons and text buttons lines up exactly.

Because there is no visible text, \`label\` is required. It becomes the \`aria-label\` and the native tooltip. Pass \`href\` to render an anchor, or \`loading\` to swap the glyph for a spinner.`,
	features: [
		'Always square — the size class sets height and the width follows',
		'Same eleven variants, five sizes and five shapes as Button',
		'Required label, wired to aria-label and the native tooltip',
		'Renders a link when given href',
		'Interruptible spring press'
	],
	accessibility: [
		'The required label is exposed as aria-label; the icon itself is decorative.',
		'Renders a native <button> (or <a> with href), so focus and activation come from the platform.',
		'While loading the button is disabled and exposes aria-busy="true".',
		'The focus ring is drawn only for keyboard focus (:focus-visible).'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Activates the button.' },
		{ keys: 'Tab', action: 'Moves focus to the next focusable element.' }
	],
	related: ['button', 'toggle', 'copy-button']
});
