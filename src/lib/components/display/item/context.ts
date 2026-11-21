import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

export interface ItemContext {
	readonly size: Size;
}

const [read, write] = createContext<ItemContext>();

export const setItemContext = write;

export function getItemContext(): ItemContext {
	try {
		return read();
	} catch {
		return { size: 'h-md' };
	}
}

export const titleClass: Record<string, string> = {
	xs: 'text-sm',
	sm: 'text-sm',
	md: 'text-md',
	lg: 'text-bs',
	xl: 'text-lg'
};

export const itemPadClass: Record<string, string> = {
	xs: 'pad-xs',
	sm: 'pad-sm',
	md: 'px-md py-sm',
	lg: 'pad-md',
	xl: 'pad-md'
};
