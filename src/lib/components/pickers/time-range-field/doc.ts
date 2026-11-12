import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'TimeRangeField',
	summary: 'Two segmented time fields in one frame, for typing a start and an end time.',
	description: `The start and end times are separate groups of spinbuttons, separated by an en dash, inside one labelled field. Each side is a tab stop and behaves like \`TimeField\`. Values are 24-hour ISO strings on a \`TimeRange\`. The two sides are independent — the field will not swap them if start is after end.

The hour cycle follows the locale unless \`hourCycle\` is set, and applies to both sides.`,
	features: [
		'Locale-aware segment order, literals and AM/PM via Intl',
		'Hour, minute or second granularity, 12- or 24-hour cycle, with min and max applied to both sides',
		'Disabled, readonly and invalid states, on the shared size and shape axes',
		'Hidden start and end inputs for native form submission'
	],
	accessibility: [
		'The field is a group. Pass aria-label, or aria-labelledby, on the field — attributes go to the group.',
		'Start and End are nested groups, each a single tab stop of spinbutton time parts.',
		'Each time part has aria-valuemin, aria-valuemax, aria-valuenow (omitted when empty) and aria-valuetext.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves from the start time to the end time, then out of the field.' },
		{ keys: 'Arrow Up / Down', action: 'Increments or decrements the focused segment. An empty segment first fills from the placeholder time.' },
		{ keys: 'Arrow Left / Right', action: 'Moves between segments on the same side.' },
		{ keys: 'Home / End', action: 'Moves to the first or last segment of the focused side.' },
		{ keys: 'Digits', action: 'Types into the segment and auto-advances when the value is uniquely determined.' },
		{ keys: 'A / P', action: 'Sets AM or PM when the period segment is focused.' },
		{ keys: 'Backspace / Delete', action: 'Clears the focused segment; Backspace on an empty segment clears the previous one.' }
	],
	related: ['time-field', 'date-range-field']
});
