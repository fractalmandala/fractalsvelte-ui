import type { Attachment } from 'svelte/attachments';
import { reducedMotion } from './global.svelte.js';

export type ViewTransitionType = 'fade' | 'slide' | 'slide-back' | 'scale' | 'reveal' | 'none';

export interface NavigationLike {
	from: { url: URL } | null;
	to: { url: URL } | null;
	type: string;
	delta?: number;
	complete: Promise<void>;
}

export type OnNavigateLike = (
	callback: (navigation: NavigationLike) => void | Promise<void> | (() => void) | Promise<() => void>
) => void;

export interface ViewTransitionSetupOptions {
	type?:
		| ViewTransitionType
		| ((navigation: { from: { url: URL } | null; to: { url: URL } | null; type: string; delta?: number }) => ViewTransitionType);
}

export const supportsViewTransitions = (): boolean =>
	typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

const ALL_TYPES: ViewTransitionType[] = ['fade', 'slide', 'slide-back', 'scale', 'reveal', 'none'];

function originPoint(origin: { x: number; y: number } | MouseEvent | Element): { x: number; y: number } {
	if (origin instanceof MouseEvent) return { x: origin.clientX, y: origin.clientY };
	if (origin instanceof Element) {
		const r = origin.getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	}
	return origin;
}

export async function startViewTransition(
	update: () => void | Promise<void>,
	options: { type?: ViewTransitionType; origin?: { x: number; y: number } | MouseEvent | Element } = {}
): Promise<void> {
	const type = options.type ?? 'fade';
	if (type === 'none' || !supportsViewTransitions() || reducedMotion.current) {
		await update();
		return;
	}
	const root = document.documentElement;
	const cls = `vt-${type}`;
	for (const t of ALL_TYPES) root.classList.remove(`vt-${t}`);
	root.classList.add(cls);
	const written: string[] = [];
	if (options.origin) {
		const { x, y } = originPoint(options.origin);
		const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		root.style.setProperty('--vt-x', `${Math.round(x)}px`);
		root.style.setProperty('--vt-y', `${Math.round(y)}px`);
		root.style.setProperty('--vt-r', `${Math.ceil(r)}px`);
		written.push('--vt-x', '--vt-y', '--vt-r');
	}
	const cleanup = (): void => {
		root.classList.remove(cls);
		for (const prop of written) root.style.removeProperty(prop);
	};
	const transition = document.startViewTransition(async () => {
		await update();
	});
	try {
		await transition.updateCallbackDone;
	} catch (error) {
		cleanup();
		throw error;
	}
	try {
		await transition.finished;
	} catch {
		// A skipped/aborted animation is not an error for the caller: the update already applied.
	} finally {
		cleanup();
	}
}

export function setupViewTransitions(onNavigate: OnNavigateLike, options: ViewTransitionSetupOptions = {}): void {
	onNavigate((navigation) => {
		if (!supportsViewTransitions() || reducedMotion.current) return;
		const from = navigation.from?.url;
		const to = navigation.to?.url;
		if (from && to && from.pathname === to.pathname && from.search === to.search) return;
		const choice = options.type ?? 'fade';
		const type = typeof choice === 'function' ? choice(navigation) : choice;
		if (type === 'none') return;
		return new Promise<void>((resolve) => {
			startViewTransition(
				async () => {
					resolve();
					await navigation.complete;
				},
				{ type }
			).catch(() => {
				// Navigation failures are surfaced by SvelteKit itself.
			});
		});
	});
}

export function vtName(name: string | null | undefined): Attachment<HTMLElement> {
	return (node) => {
		if (name === null || name === undefined || name === '') {
			node.style.removeProperty('--vt-name');
			return;
		}
		let ident = name.replace(/[^a-zA-Z0-9_-]/g, '-');
		if (/^(?:\d|-\d|--)/.test(ident) || ident === '-') ident = `vt-${ident}`;
		node.style.setProperty('--vt-name', ident);
		return () => node.style.removeProperty('--vt-name');
	};
}
