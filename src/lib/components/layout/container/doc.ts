import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Container',
	summary: 'A page container on the measure ladder, optionally padded and centred in its parent.',
	description: `Container is a page container, not a wrapper around the system's flex and grid primitives — those already live on box, row and grid. It sets a readable maximum width from the measure ladder (sm to 2xl, or full), can add padding, and can centre itself in its parent.

The element is configurable (div, section, article, main or aside) so the container can be the page's landmark. Compose layout inside it with the ordinary layout classes.`,
	features: [
		'Measure ladder widths, or full width',
		'Optional padding and centering',
		'Renders as div, section, article, main or aside'
	],
	accessibility: [
		'Renders the element given by as, so a section, article, main or aside is a real landmark. Give it an accessible name when more than one landmark of that kind is on the page.',
		'The default div has no implicit role; it is a width constraint only.'
	],
	related: ['scroll-area', 'bento-grid']
});
