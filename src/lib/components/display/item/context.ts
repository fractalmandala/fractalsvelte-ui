import { createContext } from 'svelte';
import type { Step } from '../../../internal/tokens.js';

/** What an Item shares with its parts. */
export interface ItemContext {
	/** The item's size, read lazily so parts follow changes. */
	readonly size: Step;
}

const [read, write] = createContext<ItemContext>();

/** Provide the item's context to its parts. */
export const setItemContext = write;

/** The enclosing item's context, or a medium default when a part is used on its own. */
export function getItemContext(): ItemContext {
	try {
		return read();
	} catch {
		return { size: 'md' };
	}
}

/** Type scale of the title at each size. */
export const titleClass: Record<Step, string> = {
	xs: 'text-sm',
	sm: 'text-sm',
	md: 'text-md',
	lg: 'text-bs',
	xl: 'text-lg'
};

/** Padding of the row at each size. */
export const itemPadClass: Record<Step, string> = {
	xs: 'pad-xs',
	sm: 'pad-sm',
	md: 'px-md py-sm',
	lg: 'pad-md',
	xl: 'pad-md'
};
