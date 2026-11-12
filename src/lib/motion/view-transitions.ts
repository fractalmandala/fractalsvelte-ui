/**
 * View Transitions: typed page/state transitions with a graceful fallback.
 *
 * The stylesheet styles `::view-transition-*` per type class on `<html>`
 * (`.vt-fade`, `.vt-slide`, …). This module only tags `<html>` with the class
 * for the transition's lifetime and writes origin custom properties.
 */
import type { Attachment } from 'svelte/attachments';
import { reducedMotion } from './global.svelte.js';

/** The built-in transition styles; each maps to the class `vt-<type>` on `<html>`. */
export type ViewTransitionType = 'fade' | 'slide' | 'slide-back' | 'scale' | 'reveal' | 'none';

/** The minimal shape of a SvelteKit navigation that the view-transition wiring needs. */
export interface NavigationLike {
	/** Where the navigation came from. */
	from: { url: URL } | null;
	/** Where the navigation is going. */
	to: { url: URL } | null;
	/** The navigation type (`link`, `goto`, `popstate`, `form`, …). */
	type: string;
	/** For history navigations, the number of steps (negative = back). */
	delta?: number;
	/** Resolves once the navigation has completed. */
	complete: Promise<void>;
}

/** A SvelteKit-compatible `onNavigate` registration function. */
export type OnNavigateLike = (
	callback: (navigation: NavigationLike) => void | Promise<void> | (() => void) | Promise<() => void>
) => void;

/** Options for {@link setupViewTransitions}. */
export interface ViewTransitionSetupOptions {
	/** The transition type, or a function choosing it per navigation (e.g. back → `'slide-back'`). Defaults to `'fade'`. */
	type?:
		| ViewTransitionType
		| ((navigation: { from: { url: URL } | null; to: { url: URL } | null; type: string; delta?: number }) => ViewTransitionType);
}

/** Whether `document.startViewTransition` is available (always `false` during SSR). */
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

/**
 * Run `update` inside `document.startViewTransition`, tagging `<html>` with the
 * class `vt-<type>` for the transition's duration. For `'reveal'` (a circular
 * wipe) the origin is written to `--vt-x`/`--vt-y` on `<html>` as px lengths,
 * and `--vt-r` holds the radius (px) needed to cover the viewport from it.
 *
 * Falls back to calling `update` directly when the API is unsupported, under
 * reduced motion, or for type `'none'`. Resolves when the transition finishes
 * (or right after `update` in the fallback); rejects if `update` throws.
 *
 * @param update The DOM/state change to animate.
 * @param options `type` (default `'fade'`), `origin` (a point, a pointer event, or an element's centre).
 */
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

/**
 * Wire SvelteKit navigations into view transitions. Kit-agnostic: pass your
 * app's own `onNavigate` from `$app/navigation` (call this in the root layout
 * during component init). Hash-only navigations are skipped.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import { onNavigate } from '$app/navigation';
 * 	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';
 * 	setupViewTransitions(onNavigate, { type: (nav) => ((nav.delta ?? 0) < 0 ? 'slide-back' : 'slide') });
 * </script>
 * ```
 * @param onNavigate SvelteKit's `onNavigate` (or any compatible registration function).
 * @param options `type`: a fixed type or a function of the navigation. Defaults to `'fade'`.
 */
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

/**
 * Give an element a shared-element identity for view transitions: writes
 * `--vt-name` (the `.vt-name` class turns it into `view-transition-name`).
 * Names are sanitised to a valid CSS identifier; `null`/`undefined` clears it.
 * Each name must be unique on the page at transition time.
 * @param name The shared-element name, e.g. `card-${id}`.
 */
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
