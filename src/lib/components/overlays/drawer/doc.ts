import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Drawer',
	summary: 'An edge-docked sheet on a native <dialog>, with a drag-to-dismiss handle on the bottom edge.',
	description: `A drawer is a \`<dialog>\` docked to one edge of the viewport. The platform supplies the top layer, the focus trap, Esc and the return of focus to the trigger. It slides in from its edge with \`.enter-edge-*\` and leaves the same way, with no JavaScript animation.

\`size\` follows the measure ladder: it is the width of a left or right drawer, and the height of a top or bottom one. A bottom drawer also has a grip; dragging it down with enough distance or velocity dismisses the sheet on a spring, and a shorter pull snaps it back.

Set \`modal={false}\` to open the sheet without making the rest of the page inert.`,
	features: [
		'Native <dialog> docked to any of the four edges',
		'Spring slide in and out from the docked edge',
		'Drag-to-dismiss on the bottom edge, with a velocity-aware spring',
		'Trigger, body and footer snippets',
		'Modal or non-modal, solid or glass'
	],
	accessibility: [
		'Opened with showModal() when modal is true: the rest of the page is inert and focus is trapped inside the drawer.',
		'The title is wired as aria-labelledby and the description as aria-describedby.',
		'The trigger carries aria-haspopup="dialog", aria-expanded and aria-controls.',
		'On close, focus returns to the element that had it before the drawer opened.',
		'The close button has an accessible name ("Close"); the bottom grip is decorative.'
	],
	keyboard: [
		{ keys: 'Esc', action: 'Closes the drawer (unless dismissible is false).' },
		{ keys: 'Tab / Shift+Tab', action: 'Moves focus between the controls inside the drawer.' },
		{ keys: 'Enter / Space', action: 'On the trigger, opens the drawer.' }
	],
	related: ['dialog', 'alert-dialog']
});
