import type { Snippet } from 'svelte';
import type { Tone } from '../../../internal/tokens.js';

/** Options accepted by the imperative `confirm()` helper. */
export interface ConfirmOptions {
	/** The heading of the confirmation dialog. */
	title: string | Snippet;
	/** A line under the heading that explains the choice. */
	description?: string | Snippet;
	/** The colour of the confirm action. */
	tone?: Tone;
	/** The label of the confirm action. */
	confirmLabel?: string;
	/** The label of the cancel action. */
	cancelLabel?: string;
}

export interface ConfirmRequest {
	options: ConfirmOptions;
	resolve: (value: boolean) => void;
}

const queue: ConfirmRequest[] = [];
let notify: (() => void) | null = null;

/** Ask the user to confirm a choice. Requires a `<Confirmer />` somewhere in the tree. */
export function confirm(options: ConfirmOptions): Promise<boolean> {
	return new Promise((resolve) => {
		queue.push({ options, resolve });
		notify?.();
	});
}

/** Used by `<Confirmer />` to observe the pending request. Not a public API. */
export function subscribeConfirmer(fn: (request: ConfirmRequest | null) => void): () => void {
	const pump = () => fn(queue[0] ?? null);
	notify = pump;
	pump();
	return () => {
		if (notify === pump) notify = null;
	};
}

/** Resolve the current request and show the next one, if any. */
export function settleConfirm(value: boolean): void {
	const request = queue.shift();
	request?.resolve(value);
	notify?.();
}
