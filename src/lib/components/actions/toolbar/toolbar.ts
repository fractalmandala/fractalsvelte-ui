import { createContext } from 'svelte';
import type { Orientation } from '../../../internal/tokens.js';

export interface ToolbarContext {
	orientation: Orientation;
}

export const [getToolbar, setToolbar] = createContext<ToolbarContext>();

export const toolbarRoving = {
	selector:
		'button:not([disabled]), a[href], [data-roving]:not([aria-disabled="true"]):not([disabled])',
	tabindex: true
};
