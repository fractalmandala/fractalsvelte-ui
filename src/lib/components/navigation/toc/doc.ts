import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Toc',
	summary: 'A table of contents with a scroll-spy and a spring-driven marker beside the active heading.',
	description: `A table of contents sits beside a long article and shows a person where they are. Pass an \`items\` list, or let the component collect headings from a \`container\` selector. As the page scrolls, an IntersectionObserver updates the active item, and a sliding indicator springs to it. Clicking a heading scrolls it into view, smoothly unless the person prefers reduced motion.`,
	features: [
		'Items provided, or auto-collected from a container of headings',
		'Scroll-spy with IntersectionObserver',
		'Spring-driven marker beside the active item',
		'Smooth scroll on click, honouring reduced motion'
	],
	accessibility: [
		'Rendered as a navigation landmark, labelled by the label prop (default “On this page”).',
		'The active item is marked with aria-current="true".',
		'Each entry is a link to the heading id, so it works without JavaScript as a plain fragment too.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the heading links.' },
		{ keys: 'Enter', action: 'Scrolls the focused heading into view and marks it active.' }
	],
	related: ['sidebar-nav', 'tabs', 'back-to-top']
});
