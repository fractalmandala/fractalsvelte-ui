import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'NumberTicker',
	summary: 'A number that springs from zero to its value, as a count or as rolling digit columns.',
	description: `\`NumberTicker\` drives its display with a \`SpringValue\`, so a change of \`value\` is interruptible and keeps its velocity. The formatted final value is always the accessible name (\`aria-label\`); the ticking glyphs are \`aria-hidden\`, so a screen reader never hears the count.

\`variant="count"\` writes the formatted number in tabular numerals. \`variant="slot"\` splits that string into per-digit rolling columns, driven by the \`--digit\` custom property on each \`.slot\`. \`format\` and \`locale\` are passed through to \`Intl.NumberFormat\`. \`startOnView\` holds the ticker at zero until it crosses into the viewport.`,
	features: [
		'Spring-driven count, interruptible when the value changes',
		'Rolling per-digit slot columns',
		'Intl.NumberFormat options and locale',
		'Prefix and suffix',
		'Optional start-when-in-view',
		'The final value is the accessible name'
	],
	accessibility: [
		'The accessible name is always the formatted final value (with prefix and suffix), set as aria-label on the root. The visible ticking number is aria-hidden, so assistive technology does not hear the intermediate counts.',
		'prefers-reduced-motion (and theme motion="off") makes the spring jump to the target, so the final value is shown immediately.',
		'The root is a span. Put it in a heading or a labelled figure when the number is a statistic on the page.'
	],
	related: ['marquee', 'scroll-progress', 'text-reveal']
});
