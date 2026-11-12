import { createContext } from 'svelte';
import type { Orientation } from '../../../internal/tokens.js';

/** Shared state between a toolbar and its separators and groups. */
export interface ToolbarContext {
	/** The direction the toolbar runs in. */
	orientation: Orientation;
}

export const [getToolbar, setToolbar] = createContext<ToolbarContext>();

/** Focusable controls the toolbar's roving tabindex will move between. */
export const toolbarRoving = {
	selector:
		'button:not([disabled]), a[href], [data-roving]:not([aria-disabled="true"]):not([disabled])',
	tabindex: true
};
