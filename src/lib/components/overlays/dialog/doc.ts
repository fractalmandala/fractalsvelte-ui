import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Dialog',
	summary: 'A modal dialog on the native <dialog> element, with a spring pop and a blurred backdrop.',
	description: `The dialog is a native \`<dialog>\` opened with \`showModal()\`, so the platform supplies the top layer, the inert page behind it, the focus trap, Esc to close and the return of focus to the trigger. Nothing is portalled and no z-index is involved.

Open it from a \`trigger\` snippet — spread its \`props\` onto your own button — or bind \`open\`. The panel pops in on a spring and leaves the same way, with no JavaScript animation: \`.pop\` and \`@starting-style\` do it in CSS, and reduced motion collapses it.

\`size\` follows the measure ladder. \`scrollBehavior="inside"\` keeps the header and footer fixed and scrolls the body; \`"outside"\` lets a long panel scroll past the viewport like a page.`,
	features: [
		'Native <dialog>: top layer, focus trap, Esc and focus return from the platform',
		'Spring enter and exit in CSS, with a fading, blurred backdrop',
		'Trigger, body and footer snippets — no wrappers around your button',
		'Five widths on the measure ladder, solid or glass surface',
		'Inside or outside scrolling for long content'
	],
	accessibility: [
		'Opened with showModal(): the rest of the page is inert and focus is trapped inside the dialog.',
		'The title is wired as aria-labelledby and the description as aria-describedby.',
		'The trigger carries aria-haspopup="dialog", aria-expanded and aria-controls.',
		'On close, focus returns to the element that had it before the dialog opened.',
		'The close button has an accessible name ("Close"); its icon is decorative.'
	],
	keyboard: [
		{ keys: 'Esc', action: 'Closes the dialog (unless dismissible is false).' },
		{ keys: 'Tab / Shift+Tab', action: 'Moves focus between the controls inside the dialog.' },
		{ keys: 'Enter / Space', action: 'On the trigger, opens the dialog.' }
	],
	related: ['alert-dialog', 'drawer', 'command-palette']
});
