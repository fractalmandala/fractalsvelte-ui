import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Timeline',
	summary: 'A vertical list of events on a rail, with staggered spring reveals.',
	description: `A timeline is a sequence of events joined by a hairline rail. Each item has a title, an optional description and a timestamp; the marker can be a quiet dot or a small toned icon.

\`align="alternate"\` swings bodies to both sides of the rail. Items fade and rise in with a staggered spring the first time they scroll into view.`,
	parts: {
		TimelineItem: 'One event on the rail: a marker, a title, and optional description, time and icon.'
	},
	features: [
		'Items data API or composed TimelineItem children',
		'Left or alternate alignment',
		'Optional icons and tones on the rail markers',
		'Staggered reveal springs on first view'
	],
	accessibility: [
		'Renders a native ordered list. Each event is a list item, so the sequence is announced in order.',
		'Timestamps use a <time> element.',
		'The marker icon is decorative; the title and description carry the meaning, including any tone.',
		'The reveal is visual only and is disabled under reduced motion.'
	],
	related: ['card', 'stat', 'description-list']
});
