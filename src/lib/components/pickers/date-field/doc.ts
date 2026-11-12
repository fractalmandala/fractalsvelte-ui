import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DateField',
	summary: 'A segmented date field whose day, month and year are edited with the keyboard, in locale order.',
	description: `Each part of the date is a spinbutton inside a labelled group. Arrow keys increment a part or move between them, and typing a number fills the focused segment and advances when the value is complete. Dates are stored as ISO \`YYYY-MM-DD\` strings. Segment order, separators and placeholders come from \`Intl\`.

This is the typed field, not the calendar. Use \`DatePicker\` when a popover calendar should open from the field.`,
	features: [
		'Locale-aware segment order and placeholders via Intl',
		'Day, month or year granularity, with min and max',
		'Disabled, readonly and invalid states, on the shared size and shape axes',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The field is a group. Pass aria-label, or aria-labelledby, on the field — attributes go to the group.',
		'Each date part is a spinbutton with aria-valuemin, aria-valuemax, aria-valuenow (omitted when empty) and aria-valuetext.',
		'The group is a single tab stop; Left and Right move between segments.'
	],
	keyboard: [
		{ keys: 'Arrow Up / Down', action: 'Increments or decrements the focused segment. An empty segment first fills from the placeholder date (today by default).' },
		{ keys: 'Arrow Left / Right', action: 'Moves to the previous or next segment.' },
		{ keys: 'Home / End', action: 'Moves to the first or last segment.' },
		{ keys: 'Page Up / Down', action: 'Steps by a larger amount (10 years, 3 months, or 7 days).' },
		{ keys: 'Digits', action: 'Types into the segment and auto-advances when the value is uniquely determined.' },
		{ keys: 'Backspace / Delete', action: 'Clears the focused segment; Backspace on an empty segment clears the previous one.' }
	],
	related: ['calendar', 'date-picker', 'date-range-field']
});
