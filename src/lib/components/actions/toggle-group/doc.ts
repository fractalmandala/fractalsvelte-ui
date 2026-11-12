import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ToggleGroup',
	summary: 'A set of toggles where one or several can be on, with arrow-key navigation.',
	description: `A toggle group manages a row of \`Toggle\`s as one control. In \`single\` mode at most one item is on, like a segmented control; in \`multiple\` mode any number are, like a formatting toolbar. Pressing an item that is already on turns it off.

\`value\` is bindable: a string in single mode, a string array in multiple mode. The group is one tab stop; arrow keys move between items.`,
	parts: {
		ToggleGroupItem: 'One toggle in the group. Its `value` joins the group value while it is on.'
	},
	features: [
		'Single or multiple selection',
		'Roving focus: one tab stop, arrow keys, Home and End',
		'Items inherit variant, size and shape from the group',
		'Attached (segmented) or spaced, horizontal or vertical'
	],
	accessibility: [
		'The group has role="group"; pass label to name it.',
		'Each item is a native <button> with aria-pressed.',
		'Icon-only items need an aria-label.',
		'Only one item is in the tab order at a time (roving tabindex).'
	],
	keyboard: [
		{ keys: 'Arrow Left / Right', action: 'Moves focus between items in a horizontal group.' },
		{ keys: 'Arrow Up / Down', action: 'Moves focus between items in a vertical group.' },
		{ keys: 'Home / End', action: 'Moves focus to the first or last item.' },
		{ keys: 'Enter / Space', action: 'Toggles the focused item.' }
	],
	related: ['toggle', 'button-group']
});
