import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Parallax',
	summary: 'A scroll-linked offset layer, with a group for stacking a scene at several speeds.',
	description: `\`Parallax\` offsets its content by \`speed\` times its distance from the viewport centre. Positive speeds lag behind the scroll (a background feel); negative speeds lead it. \`axis\` chooses vertical or horizontal travel.

Where the platform supports CSS scroll-driven animations (\`animation-timeline: view()\`), the layer uses the \`.parallax-view\` fast path and the \`--speed\` custom property. Everywhere else it uses the \`parallax()\` attachment and the \`.motion\` channels. Reduced motion cancels the offset in both paths.

\`ParallaxGroup\` is a clipped, relatively positioned frame for stacking several layers into one scene.`,
	parts: { ParallaxGroup: 'A clipped frame that stacks Parallax layers into one scene.' },
	features: [
		'Scroll-linked offset on x or y',
		'CSS scroll-driven animation fast path where supported',
		'JavaScript parallax() attachment fallback',
		'ParallaxGroup for layered scenes',
		'Reduced motion cancels the offset'
	],
	accessibility: [
		'Parallax is decorative motion around existing content. The content stays in the document and is read in source order, regardless of its visual offset.',
		'prefers-reduced-motion (and theme motion="off") holds every layer at rest, on both the CSS and JavaScript paths.',
		'Keep essential text on a slow or zero-speed layer so it remains readable while other layers move.'
	],
	related: ['scroll-progress', 'reveal', 'motion']
});
