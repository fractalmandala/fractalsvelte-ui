import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Dock',
	summary: 'A macOS-style dock whose items magnify by pointer proximity, driven by springs.',
	description: `The dock is a short, persistent launcher — a row of applications, a camera's tools, a player's transports. Each item scales with a spring according to its distance from the pointer, and a label appears on hover or focus. Under reduced motion the scale stays at rest.

Items can be links or buttons. The dock is keyboard reachable, with a roving tabindex, and can stand horizontally or vertically.`,
	features: [
		'Per-item spring magnification from pointer distance',
		'Labels on hover and focus',
		'Horizontal or vertical orientation',
		'Reduced-motion safe, and keyboard reachable'
	],
	accessibility: [
		'Rendered as a navigation landmark, labelled by the label prop (default “Dock”).',
		'Each item has an accessible name; the visible label is decorative.',
		'The current item is marked with aria-current="page".',
		'Roving tabindex keeps the dock one tab stop; disabled items are skipped.',
		'Magnification is disabled when the person prefers reduced motion.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves to the next or previous item. Vertical docks use Arrow Down / Arrow Up.' },
		{ keys: 'Home / End', action: 'Moves to the first or last item.' },
		{ keys: 'Enter / Space', action: 'Activates the focused item.' }
	],
	related: ['navbar', 'sidebar-nav', 'icon-button']
});
