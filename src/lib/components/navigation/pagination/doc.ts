import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Pagination',
	summary: 'Moves through a long list a page at a time, as buttons or as real links.',
	description: `Pagination is for a catalogue, an inbox or a search result that does not fit on one screen. It can take a page \`count\` directly, or derive it from \`total\` and \`pageSize\`. The numbered form keeps \`siblings\` around the current page and \`boundaries\` at each end, collapsing the rest into ellipses.

Pass an \`href\` builder to render an \`<a>\` for every page, so the control works as real navigation. The first, previous, next and last controls are always present.`,
	features: [
		'Three variants: numbers, simple (“Page X of Y”) and compact',
		'Configurable siblings and boundaries, with collapsed ellipses',
		'Optional href builder for link-based navigation',
		'Five sizes, on the shared control ladder'
	],
	accessibility: [
		'Rendered as a navigation landmark with an aria-label (default “Pagination”).',
		'The current page is marked with aria-current="page". Icon-only controls have an aria-label.',
		'The simple and compact readouts use aria-live="polite" so a page change is announced.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the page controls in order.' },
		{ keys: 'Enter / Space', action: 'Activates the focused page, or the first, previous, next or last control.' }
	],
	related: ['breadcrumbs', 'tabs', 'button']
});
