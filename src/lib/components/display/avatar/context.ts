import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

/** The three avatar shapes. */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/** Presence shown as a status dot. */
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

/** Defaults an Avatar inherits from an enclosing AvatarGroup. */
export interface AvatarContext {
	/** The group's size, read lazily so members follow changes. */
	readonly size: Size;
	/** The group's shape, read lazily so members follow changes. */
	readonly shape: AvatarShape;
}

const [read, write] = createContext<AvatarContext>();

/** Provide the group's size and shape to member avatars. */
export const setAvatarContext = write;

/** The enclosing group's context, or `null` when an avatar stands alone. */
export function getAvatarContext(): AvatarContext | null {
	try {
		return read();
	} catch {
		return null;
	}
}
