import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'AlertDialog',
	summary: 'A confirmation dialog that requires a choice, with an imperative confirm() helper.',
	description: `An alert dialog is a modal that cannot be dismissed by Esc or a click on the backdrop — the person has to choose. Focus lands on the cancel action, the least destructive choice, and the confirm action takes its colour from \`tone\`.

If \`onConfirm\` returns a promise, the confirm button stays in a loading state until it settles. Returning \`false\` keeps the dialog open.

For confirmations that are not tied to a particular trigger, mount \`<Confirmer />\` once and call \`confirm({ title, description, … })\`, which returns a \`Promise<boolean>\`.`,
	parts: { Confirmer: 'A host that presents confirm() calls as alert dialogs. Mount one at the root of the app.' },
	features: [
		'Native <dialog> with role="alertdialog", no light dismiss',
		'Focus lands on the cancel action',
		'Async onConfirm with a loading state',
		'Imperative confirm() API with a Confirmer host'
	],
	accessibility: [
		'The dialog has role="alertdialog" and is opened with showModal(), so the rest of the page is inert.',
		'Esc and a click on the backdrop do not close it; a choice is required.',
		'Focus moves to the cancel action when the dialog opens — the least destructive choice.',
		'The title is the accessible name and the description is the accessible description.'
	],
	keyboard: [
		{ keys: 'Tab / Shift+Tab', action: 'Moves focus between the cancel and confirm actions.' },
		{ keys: 'Enter / Space', action: 'Activates the focused action.' }
	],
	api: [
		{
			name: 'confirm(options)',
			type: '(options: ConfirmOptions) => Promise<boolean>',
			description: 'Opens a confirmation dialog and resolves true if the person confirms, false if they cancel. Requires a <Confirmer /> in the tree.'
		}
	],
	related: ['dialog', 'drawer']
});
