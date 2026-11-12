import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Pattern',
	summary: 'A decorative background layer drawn from pure CSS gradients: grid, dots, lines or a cross.',
	description: `Pattern is an aria-hidden layer that fills its positioned parent. The motifs are repeating CSS gradients — no image and no SVG — tiled at \`size\`, coloured by the shared tone axis, and optionally faded with a mask at the top, bottom, edges, or in a radial falloff.

Sit it behind a hero or a feature band. Because it is a layer, it does not receive pointer events and is skipped by assistive technology.`,
	features: [
		'Grid, dots, lines and cross, from CSS gradients only',
		'Configurable tile size and tone',
		'Fade masks: none, radial, top, bottom and edges',
		'Decorative: aria-hidden and pointer-events none'
	],
	accessibility: [
		'The layer is aria-hidden and does not receive pointer events. Place it inside a parent whose content is the accessible content.'
	],
	related: ['aurora', 'noise']
});
