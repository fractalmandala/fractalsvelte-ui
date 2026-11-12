import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'BentoGrid',
	summary: 'A dense, staggered bento grid whose items can span columns and rows, and collapse to one column on small screens.',
	description: `BentoGrid lays tiles on a fixed row height and a chosen column count. Each BentoItem declares how many tracks it occupies; a featured item is raised, and an optional hover lift springs the tile up under the pointer.

Items enter with staggered springs (\`stagger()\` and \`.anim-in\`). Column count, gap and row height travel as custom properties, so the stylesheet owns the layout. When the grid's container shrinks below the md measure (28rem), every item drops to a single column.

Give featured tiles their own content — a metric, a chart, a list — and keep unfeatured tiles equally finished; the grid is meant to feel composed, not like a wireframe.`,
	parts: {
		BentoItem: 'One cell of the bento, with column and row span, an optional featured surface, and an optional hover lift.'
	},
	features: [
		'Column count, gap and row height through custom properties',
		'Column and row spanning on each item',
		'Collapses to one column in a narrow container',
		'Staggered spring entrance on the items',
		'Optional featured surface and hover lift'
	],
	accessibility: [
		'The grid is a layout structure with no implicit role; put headings and labels inside the items.',
		'Featured and lifted items are visual only — they do not change the accessibility tree.',
		'When the grid collapses to one column, source order is the reading order.'
	],
	related: ['masonry', 'card', 'container']
});
