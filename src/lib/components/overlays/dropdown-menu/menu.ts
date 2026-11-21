import { createContext } from 'svelte';

export interface MenuContext {
	uid: string;
	close: () => void;
}

export const [getMenu, setMenu] = createContext<MenuContext>();

export interface MenuRadioContext {
	value: () => string;
	setValue: (value: string) => void;
}

export const [getMenuRadio, setMenuRadio] = createContext<MenuRadioContext>();

export const menuRoving = {
	selector:
		':scope > [data-menu-item], :scope > [data-menu-sub] > [data-menu-item], :scope > [role="group"] > [data-menu-item]',
	loop: true,
	typeahead: true,
	orientation: 'vertical' as const
};
