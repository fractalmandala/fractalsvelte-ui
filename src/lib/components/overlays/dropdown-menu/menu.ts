import { createContext } from 'svelte';

/** Shared state between a menu and its items. */
export interface MenuContext {
	/** The menu's unique id prefix. */
	uid: string;
	/** Closes the root menu. */
	close: () => void;
}

export const [getMenu, setMenu] = createContext<MenuContext>();

/** Shared state between a radio group and its items. */
export interface MenuRadioContext {
	/** The selected value. */
	value: () => string;
	/** Selects a value and closes the root menu. */
	setValue: (value: string) => void;
}

export const [getMenuRadio, setMenuRadio] = createContext<MenuRadioContext>();

/** Roving selector for one menu level — skips items inside nested popovers. */
export const menuRoving = {
	selector:
		':scope > [data-menu-item], :scope > [data-menu-sub] > [data-menu-item], :scope > [role="group"] > [data-menu-item]',
	loop: true,
	typeahead: true,
	orientation: 'vertical' as const
};
