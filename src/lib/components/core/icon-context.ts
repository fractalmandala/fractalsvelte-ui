import { getContext, setContext } from 'svelte';
import type { Size } from '$lib/types.js';

export interface IconFit {
	fit: boolean;
	/** The enclosing button's size class, which an icon without a size of its own takes. */
	size: Size;
}

const KEY = Symbol('icon-fit');

/** Set by IconButton: with `fit`, icons inside set the button's size and crop to their drawn shape. */
export const setIconFit = (get: () => IconFit) => setContext(KEY, get);

/** The fit an enclosing icon button asked for, if any. */
export const getIconFit = (): IconFit | undefined => getContext<(() => IconFit) | undefined>(KEY)?.();
