import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DateRangeField',
	summary: 'Two segmented date fields in one frame, for typing a start and an end date in locale order.',
	description: `The start and end dates are separate groups of spinbuttons, separated by an en dash, inside one labelled field. Each side is a tab stop and behaves like \`DateField\`. Values are ISO \`YYYY-MM-DD\` strings on a \`DateRange\`. The two sides are independent — the field will not swap them if start is after end.

Use \`DateRangePicker\` when a two-month calendar should open from the field.`,
	features: [
		'Locale-aware segment order and placeholders via Intl',
		'Day, month or year granularity, with min and max applied to both sides',
		'Disabled, readonly and invalid states, on the shared size and shape axes',
		'Hidden start and end inputs for native form submission'
	],
	accessibility: [
		'The field is a group. Pass aria-label, or aria-labelledby, on the field — attributes go to the group.',
		'Start and End are nested groups, each a single tab stop of spinbutton date parts.',
		'Each date part has aria-valuemin, aria-valuemax, aria-valuenow (omitted when empty) and aria-valuetext.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves from the start date to the end date, then out of the field.' },
		{ keys: 'Arrow Up / Down', action: 'Increments or decrements the focused segment. An empty segment first fills from the placeholder date.' },
		{ keys: 'Arrow Left / Right', action: 'Moves between segments on the same side.' },
		{ keys: 'Home / End', action: 'Moves to the first or last segment of the focused side.' },
		{ keys: 'Digits', action: 'Types into the segment and auto-advances when the value is uniquely determined.' },
		{ keys: 'Backspace / Delete', action: 'Clears the focused segment; Backspace on an empty segment clears the previous one.' }
	],
	related: ['date-field', 'date-range-picker', 'calendar']
});
