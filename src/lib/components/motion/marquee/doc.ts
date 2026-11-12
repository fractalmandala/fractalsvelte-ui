import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Marquee',
	summary: 'An infinite scrolling strip of content, with edge fades, pause on hover, and a static fallback under reduced motion.',
	description: `\`Marquee\` tiles its children into a seamless loop that travels at a constant pixel speed, so a long strip and a short one move at the same pace. The first copy is the one assistive technology reads; every further copy is \`aria-hidden\` and inert.

\`direction\` chooses the axis and the sense of travel. \`up\` and \`down\` need a container with a height. \`fade\` masks the edges the content enters and leaves through. \`pauseOnHover\` stops the loop while the pointer is over the strip or keyboard focus is inside it.

The duration is written as a custom property and honours the motion scale, so \`motion="off"\` and the reduced-motion preference both freeze the strip into a wrapping row (or column) of the original content.`,
	features: [
		'Four directions at a constant pixel speed',
		'Pause on hover and keyboard focus',
		'Optional edge fade',
		'Configurable repeat and gap',
		'Reduced motion falls back to a static layout'
	],
	accessibility: [
		'The first copy of the content stays in the document and is read by assistive technology; duplicated copies are aria-hidden and inert, so the list is not announced twice.',
		'The strip pauses while keyboard focus is inside it, so a control or a link in the content can be used without chasing it.',
		'prefers-reduced-motion (and theme motion="off") cancel the animation and lay the content out statically.',
		'The root is a plain div; put a heading or aria-label on it when the strip is a landmark of its own (a ticker, a list of partners).'
	],
	related: ['number-ticker', 'animated-list']
});
