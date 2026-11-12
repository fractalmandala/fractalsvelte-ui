import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Calendar',
	summary: 'A month grid for picking a day, a range or several days, with locale-aware labels and full keyboard navigation.',
	description: `The calendar is a \`role="grid"\` of civil dates — ISO \`YYYY-MM-DD\` strings — with no timezone-sensitive arithmetic. It can show one month or several side by side, starts the week on any day, and names months and weekdays through \`Intl\`.

In \`range\` mode the first click sets the start and the second sets the end; hovering in between previews the span. Arrow keys move a single focus through the grid, PageUp and PageDown change month (with Shift, year), and a directional spring slides the months as they change.`,
	features: [
		'Single, range and multiple selection, bindable to ISO dates',
		'min, max and isDateDisabled, with a today marker',
		'Locale-aware labels, weekStartsOn, and several months side by side',
		'Directional spring slide between months',
		'Full grid keyboard navigation'
	],
	accessibility: [
		'Each month is a grid labelled with its month and year; weekday names are columnheaders, days are gridcells.',
		'The selected day (or the start and end of a range) has aria-selected="true"; today has aria-current="date".',
		'Disabled dates expose aria-disabled and cannot be selected.',
		'One tab stop per visible month, on the focused day; arrow keys move that focus.',
		'Pass label to prefix the accessible name of each month.'
	],
	keyboard: [
		{ keys: 'Arrow keys', action: 'Move the focus by one day or one week.' },
		{ keys: 'Home / End', action: 'Move to the start or end of the week.' },
		{ keys: 'Page Up / Page Down', action: 'Move by one month; hold Shift to move by one year.' },
		{ keys: 'Enter / Space', action: 'Selects the focused day (or starts or ends a range).' }
	],
	api: [
		{ name: 'formatIso(iso, locale?, format?)', type: '(iso: string, locale?: string, format?: DateFormat) => string', description: 'Formats an ISO date as a local civil date in the given locale and short, medium or long style.' },
		{ name: 'parseInput(text, locale?)', type: '(text: string, locale?: string) => Ymd | null', description: 'Parses a typed date — ISO, locale-ordered numerics, or a month name plus day and year.' },
		{ name: 'parseIso(iso)', type: '(iso: string) => Ymd | null', description: 'Parses an ISO YYYY-MM-DD string into a civil date, or null if it is not a real day.' },
		{ name: 'toIso(date)', type: '(date: Ymd) => string', description: 'Formats a civil date as YYYY-MM-DD.' }
	],
	related: ['date-picker', 'date-range-picker']
});
