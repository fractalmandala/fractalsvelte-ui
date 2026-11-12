import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DataTable',
	summary: 'A data grid with client-side sort, filter, selection, pagination and expandable rows.',
	description: `\`DataTable\` is the interactive counterpart to \`Table\`. You hand it columns and rows, generic over the row type, and it sorts, filters and pages them on the client. Multi-column sort is a shift-click on a header — the caret springs to the new direction, and the rows reflow with FLIP so a reorder is something you can follow with your eye.

Selection is a tri-state checkbox in the header, with shift-click ranges down the body. A built-in pager, a filter field, a columns menu and optional expandable detail rows (the same \`.collapse\` used by Accordion) sit around the same quiet table typography: tabular numerals, uppercase headers, hairline rows. Reach for \`Table\` when you already have the rows you want to show.`,
	features: [
		'Generic over the row type, with typed column accessors and cell snippets',
		'Multi-column sort with a spring caret and FLIP row reflow',
		'Global filter text plus optional per-column filter functions',
		'Row selection with a tri-state header checkbox and shift-click ranges',
		'Pagination with its own pager, loading skeletons and an empty state',
		'Expandable detail rows, column visibility, sticky header'
	],
	accessibility: [
		'The grid is a native <table>, so row and column relationships come from the platform.',
		'Sortable headers are buttons that expose aria-sort (ascending, descending, or none).',
		'The header checkbox is labelled "Select all rows on this page" and becomes indeterminate when the page is partly selected.',
		'Each row checkbox and expand control is labelled. The filter field and columns menu are labelled too.',
		'Give the table a caption or a label so assistive technology can name the grid.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the filter, the columns menu, sort buttons, checkboxes, expanders and the pager.' },
		{ keys: 'Enter / Space', action: 'Activates the focused control (sort, checkbox, expand, page).' },
		{ keys: 'Shift + click', action: 'On a sortable header, adds the column to the sort. On a row checkbox, selects the range from the last clicked row.' },
		{ keys: 'Arrow keys', action: 'Scroll the labelled table region when it overflows.' }
	],
	related: ['table', 'virtual-list', 'tree']
});
