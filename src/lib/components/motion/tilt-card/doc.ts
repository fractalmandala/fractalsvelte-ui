import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'TiltCard',
	summary: 'Tilts a card in 3D toward the pointer, with an optional glare highlight.',
	description: `TiltCard attaches the library's \`tilt()\` gesture. The element carries \`.tilt\` and \`.motion\`, so the engine can write \`--rx\`, \`--ry\` and a lift \`--ms\`. When \`glare\` is on, \`tilt()\` also writes \`--px\` and \`--py\` as percentages, and a \`.glare\` layer — a kit fragment primitive — paints a highlight at that point.

The tilt is disabled under reduced motion by the attachment itself.`,
	features: [
		'Built on the tilt() attachment',
		'Optional glare following --px and --py',
		'max, scale and spring are passed through',
		'Reduced-motion safe'
	],
	accessibility: [
		'Renders a wrapping div and forwards attributes and events to it. Put the card\'s accessible name on the content or on the wrapper.',
		'The glare layer is decorative, pointer-events none, and is not exposed to assistive technology.',
		'The tilt is visual only and does not affect keyboard use. Focused content inside the card is unchanged.'
	],
	related: ['magnetic', 'motion']
});
