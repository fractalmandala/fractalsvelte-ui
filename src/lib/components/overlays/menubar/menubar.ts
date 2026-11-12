import { createContext } from 'svelte';
import type { OverlaySurface } from '../dialog/dialog.js';

/** Which end of the newly opened menu should receive focus. */
export type MenubarIntent = 'first' | 'last';

/** Shared state between the menubar and each of its menus. */
export interface MenubarContext {
	/** The bar's unique id prefix. */
	uid: string;
	/** The open menu's value, or `null` when every menu is closed. */
	value: () => string | null;
	/** Opens the menu with this value, or closes the bar when `null`. */
	setValue: (value: string | null, intent?: MenubarIntent) => void;
	/** Where focus should land in a menu that has just opened. */
	intent: () => MenubarIntent;
	/** Whether arrow keys wrap from the last trigger to the first. */
	loop: boolean;
	/** The default fill of every menu panel. */
	surface: OverlaySurface;
	/** Moves to the adjacent enabled menu, opening it when one is already open. */
	move: (from: string, direction: 1 | -1, intent?: MenubarIntent) => void;
}

export const [getMenubar, setMenubar] = createContext<MenubarContext>();

/** Roving options for the top-level triggers — skips items inside menu popovers. */
export const menubarRoving = {
	selector: ':scope [data-menubar-trigger]',
	orientation: 'horizontal' as const,
	typeahead: true,
	tabindex: true
};
