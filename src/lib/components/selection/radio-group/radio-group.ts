import { createContext } from 'svelte';
import type { ChildTextSize, Pad, Shape, Size, Surface, TextColor, TextSize } from '../../../internal/tokens.js';

export interface RadioGroupState {
	readonly name: string;
	readonly value: string | undefined;
	readonly variant: 'default' | 'card';
	readonly size: Size;
	readonly disabled: boolean;
	readonly invalid: boolean;
	readonly textSize: TextSize | undefined;
	readonly childTextSize: ChildTextSize;
	readonly childTextColor: TextColor;
	readonly shape: Shape;
	readonly surface: Surface;
	select(value: string): void;
}

export const [getRadioGroup, setRadioGroup] = createContext<RadioGroupState>();
