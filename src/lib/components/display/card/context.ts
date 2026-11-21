import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

export interface CardContext {
	readonly size: Size;
}

const [read, write] = createContext<CardContext>();

export const setCardContext = write;

export function getCardContext(): CardContext {
	try {
		return read();
	} catch {
		return { size: 'h-md' };
	}
}

export const gapClass: Record<string, string> = {
	xs: 'gap-sm',
	sm: 'gap-md',
	md: 'gap-bs',
	lg: 'gap-lg',
	xl: 'gap-xl'
};

export const padToken: Record<string, string> = {
	xs: 'var(--space-sm)',
	sm: 'var(--space-md)',
	md: 'var(--space-bs)',
	lg: 'var(--space-lg)',
	xl: 'var(--space-xl)'
};

export const titleClass: Record<string, string> = {
	xs: 'text-md',
	sm: 'text-bs',
	md: 'text-lg',
	lg: 'text-xl',
	xl: 'text-2xl'
};

export const bodyClass: Record<string, string> = {
	xs: 'text-sm',
	sm: 'text-sm',
	md: 'text-md',
	lg: 'text-md',
	xl: 'text-bs'
};
