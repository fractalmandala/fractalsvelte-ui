import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

/** What a card shares with its parts. */
export interface CardContext {
	/** The card's size, read lazily so parts follow changes. */
	readonly size: Size;
}

const [read, write] = createContext<CardContext>();

/** Provide the card's context to its parts. */
export const setCardContext = write;

/** The enclosing card's context, or a medium default when a part is used on its own. */
export function getCardContext(): CardContext {
	try {
		return read();
	} catch {
		return { size: 'md' };
	}
}

/** The gap between a card's parts at each size. */
export const gapClass: Record<Size, string> = {
	xs: 'gap-sm',
	sm: 'gap-md',
	md: 'gap-bs',
	lg: 'gap-lg',
	xl: 'gap-xl'
};

/** The padding token a card's bleeding media reaches back across, at each size. */
export const padToken: Record<Size, string> = {
	xs: 'var(--space-sm)',
	sm: 'var(--space-md)',
	md: 'var(--space-bs)',
	lg: 'var(--space-lg)',
	xl: 'var(--space-xl)'
};

/** Title scale at each size. */
export const titleClass: Record<Size, string> = {
	xs: 'text-md',
	sm: 'text-bs',
	md: 'text-lg',
	lg: 'text-xl',
	xl: 'text-2xl'
};

/** Description and body scale at each size. */
export const bodyClass: Record<Size, string> = {
	xs: 'text-sm',
	sm: 'text-sm',
	md: 'text-md',
	lg: 'text-md',
	xl: 'text-bs'
};
