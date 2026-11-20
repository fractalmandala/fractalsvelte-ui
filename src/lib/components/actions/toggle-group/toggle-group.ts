import { createContext } from 'svelte';
import type { Shape, Size, TextColor, TextSize, Variant } from '../../../internal/tokens.js';

export interface ToggleGroupState {
	readonly variant: Variant;
	readonly size: Size;
	readonly textSize: TextSize | undefined;
	readonly textColor: TextColor | undefined;
	readonly shape: Shape;
	readonly disabled: boolean;
	isPressed(value: string): boolean;
	toggle(value: string): void;
}

export const [getToggleGroup, setToggleGroup] = createContext<ToggleGroupState>();
