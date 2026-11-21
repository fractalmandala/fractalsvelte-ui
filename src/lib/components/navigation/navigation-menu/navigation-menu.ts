import { createContext } from 'svelte';
import type { Orientation } from '../../../internal/tokens.js';
import type { Surface } from '../../../internal/tokens.js';

export interface NavigationMenuContext {
	uid: string;
	value: () => string | null;
	setValue: (value: string | null) => void;
	scheduleOpen: (value: string) => void;
	scheduleClose: () => void;
	cancelTimers: () => void;
	orientation: Orientation;
	surface: Surface;
	viewport: () => HTMLElement | undefined;
	registerPanel: () => () => void;
}

export const [getNavigationMenu, setNavigationMenu] = createContext<NavigationMenuContext>();

export interface NavigationMenuItemContext {
	value: string;
	contentId: string;
	disabled: boolean;
}

export const [getNavigationMenuItem, setNavigationMenuItem] =
	createContext<NavigationMenuItemContext>();

export const navigationMenuRoving = {
	selector: ':scope [data-nav-trigger], :scope [data-nav-link]',
	tabindex: true,
	loop: true
};
