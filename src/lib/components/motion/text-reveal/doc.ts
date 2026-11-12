import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'TextReveal',
	summary: 'Text that enters one character, word or line at a time, staggered on the `--i` channel.',
	description: `\`TextReveal\` splits a string into pieces and plays \`.anim-in\` on each one, staggered by the \`--i\` channel and \`stagger()\`. \`preset\` chooses the entrance (\`fade-up\`, \`blur\`, \`scale\`, or \`slide\`) through the shared \`.enter-*\` classes. \`trigger="inView"\` holds the pieces at their first frame (\`.held\`) until the text crosses into the viewport.

The full string stays the accessible name of the wrapper (\`aria-label\`); every visual piece is \`aria-hidden\`, so assistive technology reads the sentence once, not as a stream of letters.`,
	features: [
		'Split by character, word or line',
		'Four entrance presets',
		'Configurable stagger step',
		'Mount or in-view trigger',
		'Renders as any tag'
	],
	accessibility: [
		'The wrapper carries aria-label set to the full string. Each visual piece is aria-hidden, so the text is announced once rather than letter by letter.',
		'prefers-reduced-motion collapses the staggered animation (the motion scale is already applied to .anim-in).',
		'Choose `as` so the text is the right heading or paragraph for the page; the default is a paragraph.'
	],
	related: ['typewriter', 'number-ticker', 'marquee']
});
