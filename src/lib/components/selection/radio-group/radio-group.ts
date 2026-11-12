import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

/** The state a `RadioGroup` shares with its `Radio` parts. */
export interface RadioGroupState {
	readonly name: string;
	readonly value: string | undefined;
	readonly variant: 'default' | 'card';
	readonly size: Size;
	readonly disabled: boolean;
	readonly invalid: boolean;
	select(value: string): void;
}

export const [getRadioGroup, setRadioGroup] = createContext<RadioGroupState>();
