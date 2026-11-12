import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Toolbar',
	summary: 'A group of controls with one tab stop and arrow-key movement, following the WAI-ARIA toolbar pattern.',
	description: `A toolbar gathers the actions of a view — an editor's formatting strip, a preview's zoom and layout switches — into one tab stop. Arrow keys move between the buttons, toggles and links inside; Tab leaves the toolbar entirely.

Existing action components drop in as children: \`Button\`, \`IconButton\`, \`Toggle\` and \`Link\`. Join a cluster of related controls with \`ToolbarGroup\`, which is a visual grouping only — it does not attach its own roving tabindex, so the toolbar remains the sole keyboard manager. Prefer it over \`ToggleGroup\` here: \`ToggleGroup\` already moves focus with the arrow keys, and the two would fight.`,
	parts: {
		ToolbarSeparator: 'A hairline between groups of controls, drawn across the toolbar cross axis.',
		ToolbarGroup: 'A visual cluster of controls, joined or spaced, without its own keyboard management.'
	},
	features: [
		'One tab stop, with arrow keys, Home and End moving between controls',
		'Horizontal or vertical orientation',
		'Works with Button, IconButton, Toggle and Link as children',
		'ToolbarGroup joins related controls without a nested roving tabindex'
	],
	accessibility: [
		'The root has role="toolbar", aria-orientation, and an accessible name via label (or aria-label).',
		'A roving tabindex keeps the toolbar one tab stop. Disabled buttons and aria-disabled controls are skipped.',
		'Separators have role="separator" and an orientation opposite the toolbar.',
		'ToolbarGroup is a role="group" and does not install its own keyboard handling.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves into or out of the toolbar. The toolbar is one tab stop.' },
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves to the next or previous enabled control in a horizontal toolbar. Vertical toolbars use Arrow Down / Arrow Up.' },
		{ keys: 'Home / End', action: 'Moves to the first or last enabled control.' },
		{ keys: 'Enter / Space', action: 'Activates the focused button or toggle. A link is followed on Enter.' }
	],
	related: ['button', 'icon-button', 'toggle', 'button-group', 'toggle-group', 'link']
});
