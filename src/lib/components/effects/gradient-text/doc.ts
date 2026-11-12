import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'GradientText',
	summary: 'Text filled with a theme-derived gradient, with optional slow motion and readable selection.',
	description: `The characters stay in the document; their fill is a gradient built from the current theme tokens, or from hues offset from \`--hue\`. The \`theme\` variant uses the accent and its lighter step; \`aurora\` walks three offsets; \`sunset\` leans warmer; \`mono\` fades from primary to secondary text.

Set \`animated\` to let the gradient travel slowly along the text. Selection is restored to the primary text colour on the selected background, so a highlight is never transparent. The motion pauses under reduced motion; the fill stays.`,
	features: [
		'Theme, aurora, sunset and mono fills, all from theme tokens',
		'Optional slow travelling fill',
		'Selection keeps contrast',
		'Pauses under reduced motion'
	],
	accessibility: [
		'The text is real text in the accessibility tree, not an image.',
		'A selection is painted in the primary text colour on the selected background, so it stays readable against the transparent fill.'
	],
	related: ['shimmer-text', 'aurora']
});
