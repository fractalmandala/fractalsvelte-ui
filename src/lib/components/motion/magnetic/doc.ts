import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Magnetic',
	summary: 'Pulls its child toward the pointer, then springs it back.',
	description: `Magnetic wraps any element and attaches the library's \`magnetic()\` gesture. While the pointer stays within \`radius\` of the element, it is pulled by \`strength\`; when the pointer leaves, it springs home. The wrapper carries the \`.motion\` class so the engine can write \`--mx\` and \`--my\`.

The pull is mouse and pen only, and it is disabled under reduced motion — both behaviours come from the attachment itself.`,
	features: [
		'Built on the magnetic() attachment',
		'strength, radius and spring are passed through',
		'disabled leaves the child at rest',
		'Reduced-motion safe'
	],
	accessibility: [
		'Renders a wrapping div and forwards attributes and events to it. The children keep their own roles.',
		'The pull is visual only; it does not change click targets in a way that removes a control from the pointer, but a large strength can shift a small target. Keep strength modest on buttons.',
		'Does not respond to the keyboard. Keyboard users reach the child control directly.'
	],
	related: ['tilt-card', 'motion', 'draggable']
});
