import { createContext } from 'svelte';
import type { Shape, Size } from '../../../internal/tokens.js';

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarContext {
	readonly size: Size;
	readonly shape: Shape;
}

const [read, write] = createContext<AvatarContext>();

export const setAvatarContext = write;

export function getAvatarContext(): AvatarContext | null {
	try {
		return read();
	} catch {
		return null;
	}
}
