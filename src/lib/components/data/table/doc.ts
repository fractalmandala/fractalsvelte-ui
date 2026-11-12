import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Table',
	summary: 'A presentational table of records with quiet headers, hairline rows and aligned numerals.',
	description: `\`Table\` is the semantic HTML table, dressed in fractalstyler's \`.data-table\`: a quiet uppercase header row, hairline separators, an optional zebra stripe and a row hover. Its parts map one-to-one onto the native elements, so screen readers announce rows, columns and headers without any extra wiring.

The table sits in its own scroll container, so a wide table scrolls sideways instead of breaking the page; give it \`maxHeight\` and \`stickyHeader\` and the header stays in view while the body scrolls. Mark number columns \`numeric\` — on both the header and the cells — and the digits right-align on tabular numerals so they read down the column.

Reach for \`DataTable\` when you need sorting, filtering, selection or pagination; reach for \`Table\` when you already have the rows you want to show.`,
	parts: {
		TableHead: 'The header section (<thead>) — holds the header row.',
		TableBody: 'The body section (<tbody>) — holds the data rows.',
		TableRow: 'A row (<tr>); `selected` gives it the selected fill.',
		TableHeader: 'A header cell (<th scope="col">) with alignment, numeric and width helpers.',
		TableCell: 'A data cell (<td>) with alignment, numeric and muted helpers.',
		TableCaption: 'The table caption — its accessible name; can be visually hidden.'
	},
	features: [
		'Native table semantics — every part is the matching HTML element',
		'Three densities, zebra stripes and an optional row hover',
		'Sticky header inside a height-capped scroll container',
		'Horizontal scroll for wide tables, never a broken layout',
		'Numeric cells right-align on tabular numerals'
	],
	accessibility: [
		'Renders native <table>, <thead>, <tbody>, <tr>, <th> and <td>, so row and column relationships come from the platform.',
		'TableHeader defaults to scope="col"; pass scope="row" for a row header.',
		'Give every table a TableCaption (visuallyHidden if the design has no visible title) — it is the table\'s accessible name.',
		'With label, the scroll container becomes a named region that keyboard users can focus and scroll with the arrow keys.'
	],
	keyboard: [{ keys: 'Tab', action: 'Focuses the scroll region (when labelled), then any controls inside cells.' }, { keys: 'Arrow keys', action: 'Scroll the focused region when the table overflows.' }],
	related: ['data-table', 'virtual-list']
});
