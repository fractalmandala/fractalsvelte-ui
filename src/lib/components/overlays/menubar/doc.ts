import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Menubar',
	summary: 'A persistent application menu bar with the WAI-ARIA menubar pattern, on the Popover API.',
	description: `A menubar is the always-visible File / Edit / View strip at the top of an application. Each trigger opens a native popover menu, so the platform supplies the top layer and light dismiss. The menus reuse the dropdown menu item parts — \`MenuItem\`, \`MenuCheckboxItem\`, \`MenuRadioGroup\`, \`MenuSub\` and the rest — and the same roving tabindex and typeahead.

Once any menu is open, moving to another trigger — with the arrow keys or by pointing at it — closes the current menu and opens the next, so the bar behaves like a desktop application menu. Submenus still open to the side with ArrowRight and close with ArrowLeft.`,
	parts: {
		MenubarMenu: 'One named menu in the bar: a trigger and a popover of item parts.'
	},
	features: [
		'Native Popover API with CSS anchor positioning',
		'Roving tabindex and typeahead on the bar and inside each menu',
		'Arrow keys move between open menus, as in a desktop application',
		'Reuses the dropdown menu item parts, including nested submenus',
		'Glass or solid surfaces'
	],
	accessibility: [
		'The root has role="menubar" and an accessible name via label (or aria-label).',
		'Each trigger is a menuitem with aria-haspopup="menu", aria-expanded and aria-controls.',
		'Each panel has role="menu". Items use menuitem, menuitemcheckbox or menuitemradio, with aria-checked where it applies.',
		'A roving tabindex keeps the bar one tab stop. Typeahead jumps to the trigger or item whose label starts with the typed characters.',
		'On close, focus returns to the trigger that opened the menu.',
		'Disabled menus have aria-disabled and are skipped by keyboard navigation.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves into or out of the menubar. The bar is one tab stop.' },
		{ keys: 'ArrowLeft / ArrowRight', action: 'Moves between triggers. When a menu is open, closes it and opens the adjacent menu, focusing its first item.' },
		{ keys: 'ArrowDown / Enter / Space', action: 'On a trigger, opens the menu and focuses the first item. Inside a menu, activates the item or opens a submenu.' },
		{ keys: 'ArrowUp', action: 'On a trigger, opens the menu and focuses the last item. Inside a menu, moves between items.' },
		{ keys: 'Home / End', action: 'Moves to the first or last trigger.' },
		{ keys: 'Typeahead', action: 'Jumps to the next trigger or item whose label starts with the typed characters.' },
		{ keys: 'ArrowRight', action: 'Inside a menu, opens a submenu, or moves to the next menu in the bar.' },
		{ keys: 'ArrowLeft / Esc', action: 'Closes a submenu, or closes the open menu and returns focus to its trigger. ArrowLeft on a root item also moves to the previous menu in the bar.' }
	],
	related: ['dropdown-menu', 'context-menu', 'navbar', 'navigation-menu']
});
