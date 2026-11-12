import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Reveal',
	summary: 'Springs its contents in when they scroll into view.',
	description: `Reveal watches the viewport with \`inView()\` and springs the element from an offset state to rest, the same way the \`reveal()\` attachment does. \`direction\` and \`distance\` set the offset, and optional \`scale\` and \`blur\` join the spring.

Blur is not a channel on \`reveal()\` itself, so when \`blur\` is set the component writes a \`--blur\` custom property and the kit's \`.blur-in\` class owns the filter. Use \`once={false}\` when the element should spring back out as it leaves.`,
	features: [
		'Scroll-triggered entrance on inView()',
		'Direction, distance, scale and blur',
		'once and amount match the reveal() attachment',
		'Reduced-motion safe: the element is shown at rest'
	],
	accessibility: [
		'Renders a wrapping div and forwards attributes to it.',
		'The content is always in the document — only its motion changes — so it stays in the accessibility tree while off-screen.',
		'Under reduced motion the element appears at rest with no offset or blur.'
	],
	related: ['stagger', 'motion', 'presence']
});
