import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ThemeCustomizer',
	summary: 'The live theme editor: mode, named theme, colour, radius, density, motion, a preview, and copy or reset.',
	description: `The proof of complete customisability. Every axis of the theme is here — light, dark or system mode, the named themes, hue (0–360 on a hue-gradient track), chroma, tint, three radii, three densities and four motion profiles — plus a live preview of sample surfaces and buttons.

Leave \`value\` out to drive the shared \`theme\`. Pass a \`value\` to keep the edits inside a preview (pair it with \`ThemeProvider\`) so the surrounding page is undisturbed. \`sections\` hides any block you do not need.

Reset returns to the defaults. Copy CSS emits the \`data-*\` attributes and any custom properties; Copy config emits the \`ThemeSettings\` JSON. Both confirm on the button when the clipboard accepts the text.`,
	features: [
		'Mode, named theme, hue, chroma, tint, radius, density and motion',
		'Live preview strip',
		'sections to choose which controls to show',
		'Reset, Copy CSS and Copy config, with clipboard feedback',
		'Controlled or shared-theme operation'
	],
	accessibility: [
		'Every slider is a native range input with an accessible name. Radius, density and motion are radiogroups of radios.',
		'Mode and theme reuse ModeToggle and ThemePicker, including their keyboard behaviour.',
		'Copy and Reset are named buttons; the copy buttons announce success by changing their label to “Copied CSS” or “Copied config”.',
		'The preview is a themed subtree and is not a live region, so moving a slider does not interrupt a screen reader.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the controls in order.' },
		{ keys: 'Arrow keys', action: 'Adjust the focused slider, or move between radios in a group.' },
		{ keys: 'Enter / Space', action: 'Activates Reset, Copy CSS, Copy config, or the focused radio or mode segment.' }
	],
	related: ['theme-provider', 'theme-picker', 'mode-toggle']
});
