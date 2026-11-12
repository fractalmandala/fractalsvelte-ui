import { createContext } from 'svelte';
import type { Orientation } from '../../../internal/tokens.js';
import type { OverlaySurface } from '../../overlays/dialog/dialog.js';

/** Shared state between the navigation menu and its items, content and links. */
export interface NavigationMenuContext {
	/** The menu's unique id prefix. */
	uid: string;
	/** The open item's value, or `null` when every panel is closed. */
	value: () => string | null;
	/** Opens the item with this value, or closes the menu when `null`. */
	setValue: (value: string | null) => void;
	/** Starts the open delay (or opens instantly while the menu is warm). */
	scheduleOpen: (value: string) => void;
	/** Starts the close delay. */
	scheduleClose: () => void;
	/** Cancels pending open or close timers. */
	cancelTimers: () => void;
	/** List orientation. */
	orientation: Orientation;
	/** The fill of the shared viewport. */
	surface: OverlaySurface;
	/** The shared viewport element, once mounted. */
	viewport: () => HTMLElement | undefined;
	/** Bumps the measurement generation when a panel mounts or unmounts. */
	registerPanel: () => () => void;
}

export const [getNavigationMenu, setNavigationMenu] = createContext<NavigationMenuContext>();

/** Shared state between an item and its content panel. */
export interface NavigationMenuItemContext {
	/** The item's value, paired with its content. */
	value: string;
	/** The id of the content panel, used for aria-controls. */
	contentId: string;
	/** Whether the trigger is disabled. */
	disabled: boolean;
}

export const [getNavigationMenuItem, setNavigationMenuItem] =
	createContext<NavigationMenuItemContext>();

/** Roving options for top-level triggers and links. */
export const navigationMenuRoving = {
	selector: ':scope [data-nav-trigger], :scope [data-nav-link]',
	tabindex: true,
	loop: true
};
