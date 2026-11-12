import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'BorderBeam',
	summary: 'A single beam of light that travels around the border of its parent.',
	description: `Place the beam inside a positioned parent — typically a card with \`relative\` and a corner shape. It fills the parent, inherits its radius, and is hidden from assistive technology.

The beam is a narrow slice of a conic gradient, masked to a 1px border and rotated through the same registered \`--angle\` as the glow card. \`duration\`, \`size\`, \`delay\` and \`reverse\` are written as custom properties; the motion pauses under reduced motion.`,
	features: [
		'A single travelling beam, not a full rotating rainbow',
		'Configurable duration, beam length, delay and direction',
		'Follows the parent border radius',
		'Decorative: aria-hidden and pointer-events none'
	],
	accessibility: [
		'The beam is aria-hidden and does not receive pointer events. Put it inside a parent whose content is the accessible content.'
	],
	related: ['glow-card', 'spotlight-card']
});
