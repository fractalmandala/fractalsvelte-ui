import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SpotlightCard',
	summary: 'A card lit by a soft radial light that follows the pointer, on the surface and along the border.',
	description: `A spotlight card is an ordinary raised surface with a pointer-following light. The \`pointer()\` attachment writes \`--px\` and \`--py\` as unitless fractions; a kit primitive paints a radial wash on the surface and a matching highlight on the 1px border.

The light is theme-coloured by default, or a neutral white highlight. It is clipped to the card, sits under the content, and does nothing under a fine pointer — the last position, or the centre, remains until the pointer moves.`,
	features: [
		'Surface light and border highlight follow the pointer',
		'Configurable light size and intensity',
		'Theme accent or a neutral white highlight',
		'GPU-friendly: custom properties only, contain: paint'
	],
	accessibility: [
		'The light is painted with decorative pseudo-elements, so it is not exposed to assistive technology. The card content is the accessible content.',
		'The effect does not capture pointer events and does not change the role of the card.'
	],
	related: ['glow-card', 'border-beam', 'glass-panel']
});
