import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DropdownMenu',
	summary: 'A menu button with roving focus, typeahead and nested submenus, on the Popover API.',
	description: `The menu is a native popover anchored to its trigger, so the platform supplies the top layer and light dismiss. Items are \`.item\` rows with an optional icon, a label and a \`shortcut\`. Keyboard use follows the WAI-ARIA menu pattern: arrow keys and typeahead move, Enter or Space activates, Esc closes, and a submenu opens to the side with ArrowRight and closes with ArrowLeft.

\`MenuCheckboxItem\` and \`MenuRadioGroup\` / \`MenuRadioItem\` stay in the same pattern, with \`aria-checked\`. The same item parts are reused by the context menu.`,
	parts: {
		MenuItem: 'A command in the menu — icon, label, shortcut, optional link.',
		MenuCheckboxItem: 'A toggling item that stays open after it is changed.',
		MenuRadioGroup: 'A group that keeps one radio item selected.',
		MenuRadioItem: 'A radio item; choosing it selects the value and closes the menu.',
		MenuLabel: 'A section heading inside the menu.',
		MenuSeparator: 'A hairline between groups of items.',
		MenuSub: 'A nested submenu that opens to the side, with arrow-key open and close.'
	},
	features: [
		'Native Popover API with CSS anchor positioning',
		'Roving tabindex, typeahead, and the WAI-ARIA menu pattern',
		'Checkbox and radio items',
		'Nested submenus that open to the side',
		'Items with icon, label and shortcut'
	],
	accessibility: [
		'The trigger carries aria-haspopup="menu", aria-expanded and aria-controls.',
		'The panel has role="menu". Items use menuitem, menuitemcheckbox or menuitemradio, with aria-checked where it applies.',
		'A roving tabindex keeps the menu one tab stop. Typeahead jumps to the item whose label starts with the typed characters.',
		'On close, focus returns to the trigger.',
		'Disabled items have aria-disabled and are skipped by keyboard navigation.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'On the trigger, opens the menu. On an item, activates it.' },
		{ keys: 'ArrowDown / ArrowUp', action: 'On the trigger, opens the menu and focuses the first or last item. Inside the menu, moves between items.' },
		{ keys: 'Home / End', action: 'Moves to the first or last item.' },
		{ keys: 'Typeahead', action: 'Jumps to the next item whose label starts with the typed characters.' },
		{ keys: 'ArrowRight', action: 'Opens a submenu and focuses its first item.' },
		{ keys: 'ArrowLeft / Esc', action: 'Closes a submenu, or closes the root menu and returns focus to the trigger.' }
	],
	related: ['context-menu', 'popover', 'command-palette']
});
