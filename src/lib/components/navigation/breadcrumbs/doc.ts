import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Breadcrumbs',
	summary: 'A trail of links from the site root to the current page, with an optional collapsing ellipsis.',
	description: `Breadcrumbs show a person where they are in a hierarchy and how to climb back — Atlas, Coasts, Faroe Islands, Tórshavn. The last crumb is the current page and is not a link.

When the trail is longer than \`maxItems\`, the middle collapses behind an ellipsis that expands the full path in place. Each crumb may carry an icon; the separator is an icon too, and can be swapped.`,
	features: [
		'Collapses long trails behind an expandable ellipsis',
		'Optional icons on crumbs, and a customisable separator',
		'The last crumb is marked as the current page'
	],
	accessibility: [
		'Rendered as a navigation landmark with an aria-label (default “Breadcrumb”) and an ordered list.',
		'The last crumb has aria-current="page" and is not a link.',
		'The ellipsis is a button named “Show all breadcrumbs”; the separators are hidden from the accessibility tree.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the links and, when the trail is collapsed, the ellipsis button.' },
		{ keys: 'Enter / Space', action: 'Activates the focused link, or expands a collapsed trail.' }
	],
	related: ['navbar', 'pagination', 'link']
});
