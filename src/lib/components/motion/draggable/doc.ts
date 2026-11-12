import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Draggable',
	summary: 'A spring-dragged element, with optional bounds, a handle, and keyboard movement.',
	description: `Draggable is the component face of the \`drag()\` attachment. The element carries \`.motion\`, \`touch-none\` and \`select-none\`, so a pointer drag writes \`--mx\` and \`--my\` with rubber-banding, momentum and optional snap-back. A \`handle\` — a selector or a snippet — limits the pointer to that control; the rest of the element uses \`.pointer-none\`.

The position is bindable. Arrow keys nudge it (Shift for a longer step), and the element has \`aria-roledescription="draggable"\`.`,
	features: [
		'Built on the drag() attachment',
		'axis, bounds, snapBack, momentum and elastic',
		'Handle as a selector or a snippet',
		'Bindable position with keyboard nudging',
		'Reduced-motion: dragging still works, release settles instantly'
	],
	accessibility: [
		'The element is a button (role="button") with aria-roledescription="draggable", and is focusable when it is not disabled.',
		'Arrow keys move it; Shift multiplies the step. Disabled elements are removed from tab order and expose aria-disabled.',
		'A handle is a visual affordance only — the keyboard still moves the whole element.'
	],
	keyboard: [
		{ keys: 'Arrow keys', action: 'Moves the element by 8px along the allowed axis.' },
		{ keys: 'Shift + Arrow keys', action: 'Moves the element by 32px.' }
	],
	related: ['reorder', 'motion', 'magnetic']
});
