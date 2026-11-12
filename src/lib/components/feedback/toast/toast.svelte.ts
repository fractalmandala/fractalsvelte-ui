/** Imperative toast API and the reactive list the Toaster host reads. */
export type ToastType = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'loading';

/** A button shown on a toast — a next step, or a quieter cancel. */
export interface ToastAction {
	/** The button label. */
	label: string;
	/** Called when the button is pressed. The toast is then dismissed. */
	onClick?: () => void;
	/** If set, the button is rendered as a link. */
	href?: string;
}

/** Options for `toast()` and its helpers. Passing an existing `id` updates that toast in place. */
export interface ToastOptions {
	/** An explicit id. Reusing one updates the existing toast instead of adding another. */
	id?: string;
	/** The meaning of the toast. Defaults to `neutral`. */
	type?: ToastType;
	/** Supporting text under the message. */
	description?: string;
	/** Auto-dismiss time in milliseconds. `0` keeps the toast until it is dismissed. */
	duration?: number;
	/** A button for the next step. */
	action?: ToastAction;
	/** A quieter button that dismisses the toast. */
	cancel?: ToastAction;
}

export interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
	description?: string;
	duration?: number;
	action?: ToastAction;
	cancel?: ToastAction;
}

/** A message passed to `toast.promise`, either a string, options, or a function of the resolved value. */
export type ToastPromiseMessage<T> =
	| string
	| (ToastOptions & { message?: string })
	| ((value: T) => string | (ToastOptions & { message?: string }));

export interface ToastPromiseMessages<T> {
	/** Shown while the promise is pending. */
	loading: string | (ToastOptions & { message?: string });
	/** Shown when the promise resolves. May be a function of the resolved value. */
	success: ToastPromiseMessage<T>;
	/** Shown when the promise rejects. May be a function of the rejected value. */
	error: ToastPromiseMessage<unknown>;
}

/** The live list of toasts. The Toaster host reads this; application code uses `toast()`. */
export const toaster: { items: ToastItem[] } = $state({ items: [] });

let seq = 0;

function uid(explicit?: string): string {
	if (explicit) return explicit;
	seq += 1;
	return `toast-${seq}`;
}

function resolve(
	message: string | (ToastOptions & { message?: string }),
	fallback: string
): { message: string; options: ToastOptions } {
	if (typeof message === 'string') return { message, options: {} };
	return { message: message.message ?? fallback, options: message };
}

function upsert(message: string, options: ToastOptions = {}): string {
	const id = uid(options.id);
	const item: ToastItem = {
		id,
		message,
		type: options.type ?? 'neutral',
		description: options.description,
		duration: options.duration,
		action: options.action,
		cancel: options.cancel
	};
	const idx = toaster.items.findIndex((t) => t.id === id);
	if (idx >= 0) toaster.items[idx] = item;
	else toaster.items.push(item);
	return id;
}

function show(message: string, options?: ToastOptions): string {
	return upsert(message, options);
}

show.success = (message: string, options?: ToastOptions): string => upsert(message, { ...options, type: 'success' });
show.error = (message: string, options?: ToastOptions): string => upsert(message, { ...options, type: 'error' });
show.warning = (message: string, options?: ToastOptions): string => upsert(message, { ...options, type: 'warning' });
show.info = (message: string, options?: ToastOptions): string => upsert(message, { ...options, type: 'info' });
show.loading = (message: string, options?: ToastOptions): string =>
	upsert(message, { ...options, type: 'loading', duration: options?.duration ?? 0 });

show.dismiss = (id?: string): void => {
	if (id === undefined) toaster.items = [];
	else toaster.items = toaster.items.filter((t) => t.id !== id);
};

show.promise = <T,>(promise: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> => {
	const loading = resolve(messages.loading, 'Loading');
	const id = upsert(loading.message, { ...loading.options, type: 'loading', duration: 0 });
	return promise.then(
		(value) => {
			const raw = typeof messages.success === 'function' ? messages.success(value) : messages.success;
			const next = resolve(raw, 'Done');
			upsert(next.message, { ...next.options, id, type: next.options.type ?? 'success' });
			return value;
		},
		(err: unknown) => {
			const raw = typeof messages.error === 'function' ? messages.error(err) : messages.error;
			const next = resolve(raw, 'Something went wrong');
			upsert(next.message, { ...next.options, id, type: next.options.type ?? 'error' });
			throw err;
		}
	);
};

/** Add, update or dismiss toasts. A `<Toaster />` must be mounted to show them. */
export const toast = show;

let hosts = 0;

/** Claim the single Toaster slot. The first mounted host wins; the rest stay idle. */
export function claimToaster(): { active: boolean; release: () => void } {
	const active = hosts === 0;
	hosts += 1;
	return {
		active,
		release() {
			hosts -= 1;
		}
	};
}
