import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ThemeProvider',
	summary: 'Themes a subtree independently of the page, or the whole document with `root`.',
	description: `The theme is plain attributes and three numbers, so any element can carry it. \`ThemeProvider\` renders a wrapper with the \`data-theme\`, \`data-mode\`, \`data-radius\`, \`data-density\` and \`data-motion\` attributes you ask for, and writes \`hue\`, \`chroma\` and \`tint\` as the custom properties \`--hue\`, \`--chroma\` and \`--tint\`. Everything inside re-themes at once: colours, corner radii, spacing and motion. Anything you leave out is inherited from the page.

Use it for a light card on a dark page, a brand-coloured panel, a compact toolbar, or a live preview that must not disturb the surrounding page.

For the whole document use \`<ThemeProvider root>\` once in the root layout. It calls \`initTheme()\` (restores the saved theme, follows the OS colour scheme and keeps \`<html>\` and \`localStorage\` in step with the shared \`theme\`) and also inlines \`themeInitScript()\` in \`<svelte:head>\`, so the saved mode is applied before first paint and there is no flash. Calling \`initTheme()\` directly in the layout script works the same way; then add \`<script>{@html themeInitScript()}</script>\` to \`<svelte:head>\` yourself. In SvelteKit, \`app.html\` is the other place for the script.`,
	features: [
		'Themes any subtree: theme, mode, hue, chroma, tint, radius, density and motion',
		'Unset axes inherit from the page, including customised hue, chroma and tint',
		'Numeric overrides travel as custom properties, never inline styles',
		'`root` themes the document: restore, persist, follow the OS, no flash',
		'Renders as div, section, article or aside'
	],
	accessibility: [
		'The wrapper is a plain element with no role; choose `as` to give it the right landmark (`section`, `aside`, `article`).',
		'`system` mode follows the OS preference and respects the user\'s choice of colour scheme.',
		'`motion="off"` removes spring motion inside the subtree; the reduced-motion preference is always honoured on top of it.',
		'Contrast is designed per mode: every text colour role keeps its contrast against the surfaces of the same mode.'
	],
	related: ['mode-toggle', 'theme-picker', 'theme-customizer']
});
