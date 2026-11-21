import { createContext } from 'svelte';
import type { Size, TextSize } from '../../../internal/tokens.js';

export interface InputGroupContext {
	readonly id: string;
	readonly invalid: boolean;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly describedby: string | undefined;
	readonly size: Size;
	readonly textSize: TextSize | undefined;
}

const [read, write] = createContext<InputGroupContext>();

export const setInputGroupContext = write;

export function getInputGroupContext(): InputGroupContext {
	try {
		return read();
	} catch {
		return {
			id: '',
			invalid: false,
			disabled: false,
			required: false,
			describedby: undefined,
			size: 'h-lg',
			textSize: undefined
		};
	}
}
