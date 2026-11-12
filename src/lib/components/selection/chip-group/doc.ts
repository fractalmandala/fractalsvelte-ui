import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ChipGroup',
	summary: 'A set of filter chips for a single choice or any number of them, with optional icons and counts.',
	description: `Chip groups are the filters above a list — Region, Status, Runtime — where each chip can show an icon and a count, and the person can pick one or several. In single mode the group is a radiogroup and a second press clears the choice; in multiple mode each chip is a checkbox and toggles on its own.

A spring check mark replaces the icon when a chip is on, so the selected set is obvious at a glance.`,
	features: [
		'Single or multiple selection, bindable value',
		'Optional icon and count on each chip',
		'Spring check mark on selected chips',
		'Five sizes, disabled chips, and hidden inputs for forms'
	],
	accessibility: [
		'In single mode the group is a radiogroup and each chip is a radio; in multiple mode the group is a group and each chip is a checkbox.',
		'aria-checked reflects the selected state; disabled chips expose aria-disabled and are skipped by the keyboard.',
		'Roving tabindex keeps the group one tab stop.',
		'Pass label, or an aria-label, to name the group.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves focus to the next or previous enabled chip.' },
		{ keys: 'Home / End', action: 'Moves focus to the first or last enabled chip.' },
		{ keys: 'Enter / Space', action: 'Selects the focused chip, or toggles it when multiple.' }
	],
	related: ['segmented-control', 'radio-group', 'checkbox']
});
