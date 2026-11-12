import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'TimeField',
	summary: 'A segmented time field whose hour, minute and optional second are edited with the keyboard.',
	description: `Each part of the time is a spinbutton inside a labelled group. Arrow keys increment a part or move between them, and typing a number fills the focused segment and advances when the value is complete. Times are stored as 24-hour ISO strings — \`HH:mm\` or \`HH:mm:ss\` — even when the field shows a 12-hour clock with a localized AM/PM segment.

The hour cycle follows the locale unless \`hourCycle\` is set. Use \`TimeRangeField\` for an opening and a closing time.`,
	features: [
		'Locale-aware segment order, literals and AM/PM via Intl',
		'Hour, minute or second granularity, 12- or 24-hour cycle, with min and max',
		'Disabled, readonly and invalid states, on the shared size and shape axes',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The field is a group. Pass aria-label, or aria-labelledby, on the field — attributes go to the group.',
		'Each time part is a spinbutton with aria-valuemin, aria-valuemax, aria-valuenow (omitted when empty) and aria-valuetext.',
		'The group is a single tab stop; Left and Right move between segments.'
	],
	keyboard: [
		{ keys: 'Arrow Up / Down', action: 'Increments or decrements the focused segment. An empty segment first fills from the placeholder time (midnight by default). In 12-hour mode, 11 AM steps to 12 PM.' },
		{ keys: 'Arrow Left / Right', action: 'Moves to the previous or next segment.' },
		{ keys: 'Home / End', action: 'Moves to the first or last segment.' },
		{ keys: 'Page Up / Down', action: 'Steps by a larger amount (4 hours, or 10 minutes or seconds).' },
		{ keys: 'Digits', action: 'Types into the segment and auto-advances when the value is uniquely determined.' },
		{ keys: 'A / P', action: 'Sets AM or PM when the period segment is focused (or the locale\'s AM/PM initials).' },
		{ keys: 'Backspace / Delete', action: 'Clears the focused segment; Backspace on an empty segment clears the previous one.' }
	],
	api: [
		{ name: 'parseTimeIso(iso)', type: '(iso: string) => Hms | null', description: 'Parse an ISO `HH:mm` or `HH:mm:ss` string into a civil time, or `null` if it is not a real time.' },
		{ name: 'toTimeIso(time, granularity?)', type: '(time: Hms, granularity?: TimeGranularity) => string', description: 'Format a civil time as `HH:00`, `HH:mm`, or `HH:mm:ss` according to granularity.' }
	],
	related: ['time-range-field', 'date-field']
});
