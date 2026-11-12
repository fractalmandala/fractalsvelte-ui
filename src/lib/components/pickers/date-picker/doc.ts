import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DatePicker',
	summary: 'A text field and a popover calendar for picking a single date, with typed parsing and optional presets.',
	description: `The date picker pairs a typed field with the calendar. Dates are stored as ISO \`YYYY-MM-DD\` strings. The field formats and parses through \`Intl\` — ISO, locale-ordered numerics, and month names all work — and a click or an Arrow Down opens the calendar in an anchored popover.

Optional presets ("Today", "Next Monday") sit above the grid. \`min\` and \`max\` apply to both typing and the calendar.`,
	features: [
		'Typed input with locale-aware parsing and short, medium or long formatting',
		'Popover calendar with a spring pop, anchored to the field',
		'Presets, clearable, invalid and disabled, on the shared size and shape axes',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The field is a text input with aria-haspopup="dialog", aria-expanded and aria-controls pointing at the popover.',
		'The popover is a dialog labelled "Choose a date"; the calendar inside is a grid (see Calendar).',
		'Pass aria-label, or an id that a <label for> points at — attributes go to the input.'
	],
	keyboard: [
		{ keys: 'Arrow Down', action: 'Opens the calendar if it is closed.' },
		{ keys: 'Escape', action: 'Closes the calendar and returns focus to the field.' },
		{ keys: 'Typing a date', action: 'Parses the text with Intl; a valid date is committed as the value.' }
	],
	related: ['calendar', 'date-range-picker']
});
