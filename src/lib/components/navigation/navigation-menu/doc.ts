import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'NavigationMenu',
	summary: 'A site navigation with delayed flyout panels, a sliding indicator, and a viewport that springs between sizes.',
	description: `A navigation menu is the primary site nav: a row of triggers that open rich flyout panels, mixed with ordinary links. Hovering a trigger opens its panel after a short delay; once one panel is open the menu is warm, and moving to the next trigger opens instantly. The open trigger is marked by a sliding indicator, and every panel shares one viewport whose box springs to the measured size of the active content.

The viewport is a native popover anchored to the list. \`NavigationMenuContent\` is portaled into that viewport, so the call site stays next to its trigger while the surface itself is shared. The library stays router-agnostic: pass \`href\` and \`current\` as props, and never import the SvelteKit app module.`,
	parts: {
		NavigationMenuItem: 'A trigger that opens a flyout panel, identified by a value.',
		NavigationMenuContent: 'The flyout body for an item, rendered in the shared viewport.',
		NavigationMenuLink: 'A top-level link in the list, with an optional current page state.'
	},
	features: [
		'Delayed open and close, with a warm window so the next trigger opens instantly',
		'A sliding spring indicator under the open trigger',
		'A shared viewport that springs its width and height between panels',
		'Native Popover API with CSS anchor positioning',
		'Horizontal or vertical orientation, glass or solid surfaces'
	],
	accessibility: [
		'The root is a navigation landmark, named via label (or aria-label).',
		'Each trigger is a button with aria-expanded, aria-controls and aria-haspopup="true".',
		'A roving tabindex keeps the list one tab stop; disabled triggers are skipped.',
		'A current NavigationMenuLink sets aria-current="page".',
		'Esc closes the open panel and returns focus to its trigger. Pointer down outside the menu also closes it.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves into or out of the list, and into the open viewport when a panel is showing.' },
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves to the next or previous trigger or link in a horizontal list. Vertical lists use Arrow Down / Arrow Up.' },
		{ keys: 'Enter / Space', action: 'Opens or closes the focused trigger, or follows a focused link.' },
		{ keys: 'Esc', action: 'Closes the open panel and returns focus to its trigger.' },
		{ keys: 'Home / End', action: 'Moves to the first or last trigger or link.' }
	],
	related: ['navbar', 'menubar', 'tabs', 'dropdown-menu']
});
