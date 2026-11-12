import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Toast',
	summary: 'An imperative notification, stacked in a pile at the edge of the viewport.',
	description: `Call \`toast()\` from anywhere in the app — after a save, a failure, a long job. A single \`<Toaster />\`, mounted near the root, draws the pile in the top layer through a manual popover.

The pile collapses into a stacked peek and expands on hover or focus, or stays open when \`expand\` is set. New toasts spring in from the nearest edge, a swipe with enough distance or velocity dismisses one, and the rest reflow with a FLIP spring. Timers pause while the pile is hovered, focused, or the tab is hidden. Passing an existing \`id\` updates a toast in place, which is how \`toast.promise\` moves from loading to success or error.`,
	parts: {
		Toaster: 'The host that renders the pile. Mount once near the root of the app.'
	},
	features: [
		'Imperative toast(), with success, error, warning, info, loading and promise helpers',
		'Update in place by id, and dismiss one or all',
		'Six viewport positions, a collapsed pile that expands on hover, and a max visible count',
		'Swipe to dismiss, spring-in from the edge, FLIP reflow',
		'Timers pause on hover, focus and a hidden tab',
		'Action and cancel buttons'
	],
	accessibility: [
		'Error and warning toasts use role="alert" and aria-live="assertive"; the rest use role="status" and aria-live="polite".',
		'Each toast is aria-atomic, so the message, the description and any actions are announced together.',
		'The dismiss button is a native button labelled "Dismiss".',
		'Timers pause while the pile is hovered or focused, and while the tab is hidden, so a reader is not racing a timeout.',
		'Swipe-to-dismiss is an addition to the close button, not a replacement for it.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the action, cancel and dismiss controls of the expanded pile.' },
		{ keys: 'Enter / Space', action: 'Activates the focused button.' },
		{ keys: 'Escape', action: 'Dismisses the front toast.' }
	],
	api: [
		{
			name: 'toast(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds a toast and returns its id. Passing an existing id updates that toast in place.'
		},
		{
			name: 'toast.success(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds a success toast and returns its id.'
		},
		{
			name: 'toast.error(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds an error toast and returns its id. Announced assertively.'
		},
		{
			name: 'toast.warning(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds a warning toast and returns its id. Announced assertively.'
		},
		{
			name: 'toast.info(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds an informational toast and returns its id.'
		},
		{
			name: 'toast.loading(message, options?)',
			type: '(message: string, options?: ToastOptions) => string',
			description: 'Adds a sticky loading toast. It stays until it is dismissed or updated by id.'
		},
		{
			name: 'toast.promise(promise, messages)',
			type: '<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => Promise<T>',
			description: 'Shows a loading toast, then updates it in place to success or error when the promise settles. Re-throws a rejection after the error toast is shown.'
		},
		{
			name: 'toast.dismiss(id?)',
			type: '(id?: string) => void',
			description: 'Dismisses one toast by id, or every toast when no id is given.'
		}
	],
	related: ['alert', 'banner']
});
