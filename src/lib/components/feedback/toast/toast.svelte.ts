import type { Tone } from '../../../internal/tokens.js';

export interface ToastAction {
	label: string;
	onClick?: () => void;
	href?: string;
}

export interface ToastOptions {
	id?: string;
	tone?: Tone;
	loading?: boolean;
	description?: string;
	duration?: number;
	action?: ToastAction;
	cancel?: ToastAction;
}

export interface ToastItem {
	id: string;
	message: string;
	tone: Tone;
	loading: boolean;
	description?: string;
	duration?: number;
	action?: ToastAction;
	cancel?: ToastAction;
}

export type ToastPromiseMessage<T> =
	| string
	| (ToastOptions & { message?: string })
	| ((value: T) => string | (ToastOptions & { message?: string }));

export interface ToastPromiseMessages<T> {
	loading: string | (ToastOptions & { message?: string });
	success: ToastPromiseMessage<T>;
	error: ToastPromiseMessage<unknown>;
}

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
		tone: options.tone ?? 'neutral',
		loading: options.loading ?? false,
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

show.success = (message: string, options?: ToastOptions): string => upsert(message, { ...options, tone: 'success' });
show.error = (message: string, options?: ToastOptions): string => upsert(message, { ...options, tone: 'danger' });
show.warning = (message: string, options?: ToastOptions): string => upsert(message, { ...options, tone: 'warning' });
show.info = (message: string, options?: ToastOptions): string => upsert(message, { ...options, tone: 'info' });
show.loading = (message: string, options?: ToastOptions): string =>
	upsert(message, { ...options, loading: true, duration: options?.duration ?? 0 });

show.dismiss = (id?: string): void => {
	if (id === undefined) toaster.items = [];
	else toaster.items = toaster.items.filter((t) => t.id !== id);
};

show.promise = <T,>(promise: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> => {
	const loading = resolve(messages.loading, 'Loading');
	const id = upsert(loading.message, { ...loading.options, loading: true, duration: 0 });
	return promise.then(
		(value) => {
			const raw = typeof messages.success === 'function' ? messages.success(value) : messages.success;
			const next = resolve(raw, 'Done');
			upsert(next.message, { ...next.options, id, tone: next.options.tone ?? 'success', loading: false });
			return value;
		},
		(err: unknown) => {
			const raw = typeof messages.error === 'function' ? messages.error(err) : messages.error;
			const next = resolve(raw, 'Something went wrong');
			upsert(next.message, { ...next.options, id, tone: next.options.tone ?? 'danger', loading: false });
			throw err;
		}
	);
};

export const toast = show;

let hosts = 0;

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
