import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ScrollProgress',
	summary: 'A reading-progress bar or ring, bound to the page or to an element as it passes through the viewport.',
	description: `\`ScrollProgress\` uses the \`scrollProgress()\` attachment to write \`--value\` (0 to 1) and paints it with \`.fill\` or \`.ring\`. \`target="page"\` tracks the document; \`target="element"\` tracks this component's own passage through the viewport (0 as it enters, 1 as it leaves), so a bar can follow a single article.

The bar is a hairline along the top or bottom of the viewport and grows by scale (\`.fill.scaled\`), not width, so it stays on the compositor. The ring uses the shared \`.ring\` conic fill. \`tone\` re-points \`--theme-color\` so both follow the same status colour.`,
	features: [
		'Bar or ring, driven by --value',
		'Page scroll or element passage',
		'Top or bottom bar position',
		'Five tones',
		'Compositor-only bar (scale, not width)'
	],
	accessibility: [
		'The meter is a progressbar labelled "Reading progress". The value is visual; the bar does not announce every scroll tick, which would be noisy.',
		'prefers-reduced-motion does not hide the meter: progress still updates, without introducing animation of its own (the attachment writes --value directly).',
		'Place the component around an article when target is element, so the accessible name describes that reading, or pass aria-label to override it.'
	],
	related: ['number-ticker', 'parallax', 'progress', 'progress-ring']
});
