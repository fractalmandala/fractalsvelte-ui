import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'GlowCard',
	summary: 'A card with a rotating conic-gradient border and a soft outer glow.',
	description: `The border is a conic gradient that rotates through a registered \`--angle\` custom property — not a keyframed transform — so the stroke stays sharp as it travels. A soft halo sits outside the card.

By default the motion starts only when the pointer hovers or focus moves inside. Set \`active\` to keep it travelling. The rainbow variant walks hues offset from the current \`--hue\`, so it stays on-theme rather than painting a fixed spectrum.`,
	features: [
		'Rotating conic-gradient border via a registered @property angle',
		'Theme, rainbow and subtle variants',
		'Always-on, or only while hovered or focused',
		'Soft outer glow, pauses under reduced motion'
	],
	accessibility: [
		'The border and glow are decorative pseudo-elements and are not exposed to assistive technology.',
		'Hover-only rotation also runs when focus is inside the card, so keyboard users see the same motion.'
	],
	related: ['spotlight-card', 'border-beam']
});
