import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ShimmerText',
	summary: 'A highlight that sweeps through text, for loading or "AI thinking" labels.',
	description: `The characters stay in the document; only their fill is a travelling highlight, clipped to the text. \`duration\` and \`spread\` set how fast the sweep is and how wide the bright band is.

Under reduced motion the sweep is removed and the text sits in the muted colour, so the label remains readable. The text can still be selected; the selection uses the ordinary primary colour, not the transparent fill.`,
	features: [
		'A highlight that travels through live text',
		'Configurable duration and spread',
		'Falls back to still muted text under reduced motion',
		'Selection keeps contrast'
	],
	accessibility: [
		'The text is real text in the accessibility tree, not an image or an aria-hidden decoration.',
		'Under reduced motion the animation is removed and the label is shown in a static muted colour.'
	],
	related: ['gradient-text']
});
