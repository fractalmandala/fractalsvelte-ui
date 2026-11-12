import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Masonry',
	summary: 'A balanced masonry of uneven items, using CSS grid masonry where it is supported and a shortest-column packer everywhere else.',
	description: `Masonry places a list of uneven items into a chosen number of columns. Where the browser supports it, the layout is CSS grid masonry (\`grid-template-rows: masonry\`). Everywhere else, a JavaScript packer measures the items and sits each one, in source order, in the shortest column. Offsets travel as custom properties (\`--x\`, \`--y\`, \`--extent\`); the stylesheet owns the placement.

Items stay in source order in the DOM, so reading order and tab order are stable even when the visual packing puts a later item into a shorter column. The packer is a fallback, not a second layout to opt into — native masonry and the packer use the same shortest-column rule, so the two paths look the same.

The \`columns\` prop can be a number, or a map (\`base\`, \`sm\`, \`md\`, \`lg\`, \`xl\`) resolved from the element's width against the system's \`--bp-*\` breakpoints. Gap and column count travel as custom properties.`,
	features: [
		'CSS grid masonry (grid-template-rows: masonry) when the browser supports it',
		'Balanced-columns JavaScript packer as a fallback — shortest column, source order kept',
		'A number of columns, or a responsive map against --bp-*',
		'Generic items with a typed children snippet'
	],
	accessibility: [
		'The masonry is a layout structure with no implicit role; put headings and labels inside the items.',
		'Items are rendered in source order, which is also the reading and tab order, including when the packer has visually placed a later item in a shorter column.',
		'When the column count changes, the same source order is kept.'
	],
	related: ['bento-grid', 'card']
});
