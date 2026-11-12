import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ContextMenu',
	summary: 'A menu that opens at the pointer on right-click, long-press or Shift+F10, using the same item parts as the dropdown menu.',
	description: `The menu reuses the dropdown menu's items, labels, separators, checkboxes, radios and submenus. It is anchored to a zero-size point at the pointer, placed through \`--px\` and \`--py\` and the \`.at-pointer\` fragment class — there is no trigger to hang a CSS anchor on.

Right-click, a 500 ms long-press, or Shift+F10 (or the Context Menu key) opens it. It is a native \`popover="auto"\` panel, so a click outside or Esc dismisses it. Focus moves to the first item and returns to the trigger when it closes.`,
	features: [
		'Opens at the pointer on right-click, long-press or Shift+F10',
		'Positioned with --px / --py and the .at-pointer fragment class',
		'Reuses the dropdown menu item parts',
		'Roving focus, typeahead and the WAI-ARIA menu pattern'
	],
	accessibility: [
		'The trigger carries aria-haspopup="menu", aria-expanded and aria-controls.',
		'The panel has role="menu" and uses the same item roles as the dropdown menu.',
		'On open, focus moves to the first item. On close, it returns to the trigger.',
		'The trigger should be focusable so Shift+F10 can open the menu from the keyboard.'
	],
	keyboard: [
		{ keys: 'Shift+F10 / Context Menu', action: 'Opens the menu at the trigger.' },
		{ keys: 'Arrow keys / Home / End / Typeahead', action: 'Move between items, as in the dropdown menu.' },
		{ keys: 'Enter / Space', action: 'Activates the focused item.' },
		{ keys: 'Esc', action: 'Closes the menu and returns focus to the trigger.' }
	],
	related: ['dropdown-menu', 'popover']
});
