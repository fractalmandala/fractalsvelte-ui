import { MediaQuery } from 'svelte/reactivity';

export const globalMotion: { scale: number } = $state({ scale: 1 });

let query: MediaQuery | undefined;

export const reducedMotion: { readonly current: boolean } = {
	get current(): boolean {
		if (globalMotion.scale === 0) return true;
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
		query ??= new MediaQuery('(prefers-reduced-motion: reduce)', false);
		return query.current;
	}
};
