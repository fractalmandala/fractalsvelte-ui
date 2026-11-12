import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DateRangePicker',
	summary: 'A field that opens a two-month range calendar, with hover preview and optional presets.',
	description: `The date range picker is for a start and an end — an analytics window, a stretch of leave. The field shows the formatted range; the popover holds a two-month calendar in range mode, so the first click sets the start, hovering previews the span, and the second click sets the end and closes the list.

Presets like "Last 7 days" sit above the grid. Dates are stored as ISO \`YYYY-MM-DD\` strings in \`{ start, end }\`.`,
	features: [
		'Two-month range calendar in an anchored popover, with hover preview',
		'Presets, clearable, invalid and disabled, on the shared size and shape axes',
		'Locale-aware short, medium or long formatting',
		'Hidden start and end inputs for native form submission'
	],
	accessibility: [
		'The field is a button with aria-haspopup="dialog", aria-expanded and aria-controls pointing at the popover.',
		'The popover is a dialog labelled "Choose a date range"; the calendar inside is a grid in range mode (see Calendar).',
		'Pass aria-label, or an id that a <label for> points at — attributes go to the field button.'
	],
	keyboard: [
		{ keys: 'Enter / Space / Arrow Down', action: 'Opens the calendar.' },
		{ keys: 'Escape', action: 'Closes the calendar and returns focus to the field.' },
		{ keys: 'Calendar keys', action: 'The calendar grid keeps its usual keyboard behaviour for moving and selecting a range.' }
	],
	related: ['calendar', 'date-picker']
});
