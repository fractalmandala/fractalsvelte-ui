import { createContext } from 'svelte';
import type { Surface } from '../../../internal/tokens.js';

export type MenubarIntent = 'first' | 'last';

export interface MenubarContext {
	uid: string;
	value: () => string | null;
	setValue: (value: string | null, intent?: MenubarIntent) => void;
	intent: () => MenubarIntent;
	loop: boolean;
	surface: Surface;
	move: (from: string, direction: 1 | -1, intent?: MenubarIntent) => void;
}

export const [getMenubar, setMenubar] = createContext<MenubarContext>();

export const menubarRoving = {
	selector: ':scope [data-menubar-trigger]',
	orientation: 'horizontal' as const,
	typeahead: true,
	tabindex: true
};
