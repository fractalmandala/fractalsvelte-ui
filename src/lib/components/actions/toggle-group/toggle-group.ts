import { createContext } from 'svelte';
import type { Shape, Size, Variant } from '../../../internal/tokens.js';

/** What a ToggleGroup shares with its items. */
export interface ToggleGroupState {
	readonly variant: Variant;
	readonly size: Size;
	readonly shape: Shape;
	readonly disabled: boolean;
	/** Whether the item with this value is currently on. */
	isPressed(value: string): boolean;
	/** Flip the item with this value, honouring `type`. */
	toggle(value: string): void;
}

export const [getToggleGroup, setToggleGroup] = createContext<ToggleGroupState>();
