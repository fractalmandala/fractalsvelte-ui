import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Skeleton',
	summary: 'A placeholder for content that has not loaded yet, shaped as text, a circle or a rectangle.',
	description: `Skeletons reserve the layout of a page while data is on its way, so the view does not jump when it arrives. They come as lines of text, a circle — for an avatar — or a rectangle — for an image or a chart — and can shimmer, pulse, or sit still.

When \`loaded\` becomes true, the placeholder cross-fades to the real content passed as children, and \`aria-busy\` is cleared.`,
	features: [
		'Text, circle and rectangle shapes',
		'A configurable number of text lines, with a shorter last line',
		'Shimmer, pulse, or no animation',
		'Cross-fades to real content when loaded'
	],
	accessibility: [
		'The placeholder sets aria-busy="true" until loaded is set, and aria-live="polite" so the arrival of content can be announced.',
		'The bones are decorative; once loaded, only the real content remains in the accessibility tree at full opacity.'
	],
	related: ['spinner', 'progress', 'empty-state']
});
