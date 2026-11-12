import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Noise',
	summary: 'A film-grain overlay drawn from layered repeating gradients, without images or SVG.',
	description: `Noise is an aria-hidden layer that fills its positioned parent. It is made from three overlapping repeating linear gradients at 0°, 90° and 37°, tiled at slightly different sizes and mixed with what is behind them. There is no image, no SVG, and no turbulence filter.

That is also its limit: this is a fine ruled grain, not photographic film. At large sizes the grid can become visible, and it can band on some displays. Keep the opacity low, and prefer it as a quiet texture over a photograph or a dark hero rather than as a feature in its own right.`,
	features: [
		'Layered repeating gradients, no image and no SVG',
		'Configurable opacity and blend mode',
		'Decorative: aria-hidden and pointer-events none'
	],
	accessibility: [
		'The layer is aria-hidden and does not receive pointer events. Place it inside a parent whose content is the accessible content.'
	],
	related: ['pattern', 'glass-panel', 'aurora']
});
