import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Stagger',
	summary: 'Reveals its children in sequence, staggered from first, last or centre.',
	description: `Stagger writes \`--i\` on each direct child and \`--stagger\` on the group, then adds \`.anim-in\` (on mount) or \`.reveal\` (when \`trigger="inView"\`) together with an \`.enter-*\` preset. The delay is \`calc(var(--i) * var(--stagger))\`, so the same CSS the rest of the library uses does the work.

The \`slide\` preset uses \`.enter-edge-bottom\`, which is the CSS counterpart of a slide-from-edge entrance. Height-collapsing \`springSlide\` belongs on Presence, where it can run as a Svelte transition.`,
	features: [
		'stagger() writes --i and --stagger',
		'from first, last or centre',
		'Trigger on mount or when the group is in view',
		'Eight enter presets, matching Presence'
	],
	accessibility: [
		'Renders a wrapping div around the children and forwards attributes to it.',
		'The children stay in the document; only their entrance is delayed. They remain in the accessibility tree while waiting to appear.',
		'Under reduced motion, stagger() writes --stagger: 0ms, so every child appears together.'
	],
	related: ['reveal', 'presence', 'motion']
});
