import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'CommandPalette',
	summary: 'A ⌘K command launcher on a modal dialog, with fuzzy ranking, highlighted matches and staggered results.',
	description: `The palette is a native \`<dialog>\` with a search field, a ranked list of commands and a footer of keyboard hints. Commands are grouped, scored by a small fuzzy matcher against their label and \`keywords\`, and listed with the matching characters highlighted. Arrow keys move an \`aria-activedescendant\` highlight; Enter runs the command and closes the palette.

Set \`shortcut="mod+k"\` to toggle it globally — \`mod\` is ⌘ on Apple platforms and Ctrl elsewhere. Results arrive with a staggered \`.anim-in\`.`,
	features: [
		'Native modal <dialog> with a search field',
		'Fuzzy ranking and highlighted matches',
		'Grouped commands, empty state and footer hints',
		'Optional global shortcut, such as mod+k',
		'Staggered .anim-in on the results'
	],
	accessibility: [
		'Opened with showModal(): the rest of the page is inert and focus moves to the search field.',
		'The field is a combobox with aria-controls and aria-activedescendant pointing at the highlighted option.',
		'Options live in a listbox, grouped where a command has a group name.',
		'Esc closes the palette. On close, focus returns to the trigger.'
	],
	keyboard: [
		{ keys: 'mod+K (optional)', action: 'Toggles the palette, when the shortcut prop is set.' },
		{ keys: 'ArrowUp / ArrowDown', action: 'Moves the highlight between ranked commands.' },
		{ keys: 'Home / End', action: 'Moves the highlight to the first or last command.' },
		{ keys: 'Enter', action: 'Runs the highlighted command and closes the palette.' },
		{ keys: 'Esc', action: 'Closes the palette without running a command.' }
	],
	related: ['dialog', 'dropdown-menu']
});
