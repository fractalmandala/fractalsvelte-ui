import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'EmptyState',
	summary: 'A centred placeholder for a view that has nothing to show yet, with an optional next step.',
	description: `An empty state is for a list, a search, or a workspace that has no items — not for an error, and not for a page that is still loading. A quiet icon, a short title and a sentence of explanation tell the reader why the view is empty, and an actions slot holds the button that would fill it.

The block can sit openly in the page, or inside a hairline or dashed frame when it needs a little more presence in a large surface.`,
	features: [
		'An icon, a title, a description and an actions slot',
		'Five sizes',
		'Optional bordered or dashed frame'
	],
	accessibility: [
		'The title and description are plain text, so they are read in order.',
		'Icons are decorative and hidden from assistive technology; the title carries the meaning.',
		'Actions are ordinary buttons or links, and receive focus in document order.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to any actions.' },
		{ keys: 'Enter / Space', action: 'Activates the focused action.' }
	],
	related: ['skeleton', 'alert', 'button']
});
