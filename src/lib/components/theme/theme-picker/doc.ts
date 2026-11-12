import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ThemePicker',
	summary: 'A swatch grid of the named themes, each previewing its accent, with a spring-in selected ring.',
	description: `A view over the named \`themes\`. Each swatch is painted from the preset's hue and chroma as custom properties — never a hex — so it always matches the live theme. The selected swatch springs a ring in around its orb.

Leave \`value\` out to drive the shared \`theme\` (picking a name also clears any hue, chroma or tint override, through \`theme.setTheme\`). Pass a \`value\` and the component only reports changes through \`value\` and \`onValueChange\`, which suits a provider-scoped preview.`,
	features: [
		'Every named theme, previewed from its preset numbers',
		'Optional labels',
		'Five sizes',
		'Radiogroup with roving focus',
		'Selected ring springs in'
	],
	accessibility: [
		'The grid is a radiogroup of radios with a roving tab stop; arrow keys, Home and End move and select.',
		'Each swatch has an accessible name (the theme label), whether or not the visible label is shown.',
		'The selected ring is decorative; the checked state is conveyed by aria-checked.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Selects the focused theme.' },
		{ keys: 'Arrow keys', action: 'Moves to and selects a neighbouring theme.' },
		{ keys: 'Home / End', action: 'Selects the first or last theme.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the group (one tab stop).' }
	],
	related: ['theme-provider', 'mode-toggle', 'theme-customizer']
});
