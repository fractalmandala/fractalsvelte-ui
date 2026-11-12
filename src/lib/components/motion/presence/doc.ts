import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Presence',
	summary: 'Mounts and unmounts children with spring enter and exit transitions.',
	description: `Presence is the unmounting counterpart to Motion. Pass \`show\` to play a spring enter or exit — fade, scale, fly, blur or slide — built on the library's \`spring*\` transition functions. A \`key\` treats a change of children as a swap; \`mode="sync"\` crosses the two, and \`mode="wait"\` holds the enter until the exit has finished.

Use it whenever something must leave the document, not just change pose: a dismissed notice, a swapped panel, a collapsing footnote.`,
	features: [
		'Eight enter and exit presets, all spring-eased',
		'Keyed swaps in sync or wait mode',
		'onExitComplete after the exit has finished',
		'Reduced-motion safe (the transitions collapse to a short fade)'
	],
	accessibility: [
		'Renders a wrapping div around the children while they are present, and forwards attributes to it.',
		'The children are removed from the document after the exit transition, so they leave the accessibility tree once they have finished leaving.',
		'Does not manage focus. Move focus before hiding a dialog or a similar surface that had it.'
	],
	related: ['motion', 'reveal', 'stagger']
});
