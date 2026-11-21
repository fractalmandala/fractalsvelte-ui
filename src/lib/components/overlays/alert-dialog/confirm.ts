import type { Snippet } from 'svelte';
import type { Tone } from '../../../internal/tokens.js';

export interface ConfirmOptions {
	title: string | Snippet;
	description?: string | Snippet;
	tone?: Tone;
	confirmLabel?: string;
	cancelLabel?: string;
}

export interface ConfirmRequest {
	options: ConfirmOptions;
	resolve: (value: boolean) => void;
}

const queue: ConfirmRequest[] = [];
let notify: (() => void) | null = null;

export function confirm(options: ConfirmOptions): Promise<boolean> {
	return new Promise((resolve) => {
		queue.push({ options, resolve });
		notify?.();
	});
}

export function subscribeConfirmer(fn: (request: ConfirmRequest | null) => void): () => void {
	const pump = () => fn(queue[0] ?? null);
	notify = pump;
	pump();
	return () => {
		if (notify === pump) notify = null;
	};
}

export function settleConfirm(value: boolean): void {
	const request = queue.shift();
	request?.resolve(value);
	notify?.();
}
