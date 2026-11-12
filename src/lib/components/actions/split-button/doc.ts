import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SplitButton',
	summary: 'A primary action with an attached menu of related alternatives.',
	description: `A split button puts the most likely action one click away and tucks its siblings behind a chevron — "Merge", with "Squash and merge" and "Rebase and merge" beside it. The two halves read as one control.

The menu is a native popover: it renders in the top layer, dismisses on Escape or an outside click, and returns focus to the chevron. It is positioned with CSS anchor positioning against the whole control, so it lines up with the outer edge whatever the label width.`,
	features: [
		'Native popover menu — top layer, light dismiss, focus return',
		'Anchored to the whole control, flips when there is no room',
		'Rows with icons, disabled and danger states',
		'Roving keyboard navigation with typeahead',
		'Spring-animated entrance that honours reduced motion'
	],
	accessibility: [
		'The two halves are native buttons inside a role="group".',
		'The chevron carries aria-haspopup="menu", aria-expanded and aria-controls; menuLabel names it.',
		'The menu has role="menu" and its rows role="menuitem"; disabled rows are skipped by the keyboard.',
		'Focus moves to the first row on open and returns to the chevron on close.',
		'Tab closes the menu and continues in page order.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'On the primary half, runs the action. On the chevron, opens the menu. On a row, chooses it.' },
		{ keys: 'Arrow Down', action: 'On the chevron, opens the menu. In the menu, moves to the next row.' },
		{ keys: 'Arrow Up', action: 'Moves to the previous row, wrapping at the top.' },
		{ keys: 'Home / End', action: 'Jumps to the first or last row.' },
		{ keys: 'A–Z', action: 'Jumps to the next row starting with the typed letters.' },
		{ keys: 'Escape', action: 'Closes the menu and returns focus to the chevron.' },
		{ keys: 'Tab', action: 'Closes the menu and moves on.' }
	],
	related: ['button', 'button-group', 'icon-button']
});
