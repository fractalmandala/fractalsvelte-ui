/**
 * Global motion state shared by every part of the motion layer.
 * Internal module — the public surface re-exports from `animate.ts` and
 * `spring.svelte.ts`.
 */
import { MediaQuery } from 'svelte/reactivity';

/**
 * The global motion switch for the JS spring engine.
 *
 * - `1` — normal speed (default).
 * - `0` — JS motion disabled: every animation jumps straight to its target,
 *   exactly as with `prefers-reduced-motion: reduce`.
 * - Other positive values scale durations: `2` runs springs at half speed,
 *   `0.5` at double speed (mirrors a CSS duration multiplier).
 *
 * Reactive (`$state`), so the theme runtime can set it and `reducedMotion`
 * reflects the change. Never reassign the object — set `globalMotion.scale`.
 */
export const globalMotion: { scale: number } = $state({ scale: 1 });

let query: MediaQuery | undefined;

/**
 * Reactive reduced-motion flag: `true` when the user prefers reduced motion
 * OR `globalMotion.scale === 0`. SSR-safe — the media query is created lazily
 * on first read in the browser, and reads `false` on the server.
 */
export const reducedMotion: { readonly current: boolean } = {
	get current(): boolean {
		if (globalMotion.scale === 0) return true;
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
		query ??= new MediaQuery('(prefers-reduced-motion: reduce)', false);
		return query.current;
	}
};
