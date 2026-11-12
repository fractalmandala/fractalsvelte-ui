import { createContext } from 'svelte';
import type { Size } from '../../../internal/tokens.js';

/** What an InputGroup shares with its parts. */
export interface InputGroupContext {
	/** The id the input should carry — the Field label's `for` points at it. */
	readonly id: string;
	/** Whether the group is invalid. */
	readonly invalid: boolean;
	/** Whether the group is disabled. */
	readonly disabled: boolean;
	/** Whether the group is required. */
	readonly required: boolean;
	/** Hint or error ids for `aria-describedby`. */
	readonly describedby: string | undefined;
	/** The group's size, so the inner button can match it. */
	readonly size: Size;
	/** The group's text scale, when set independently of size. */
	readonly textSize: Size | undefined;
}

const [read, write] = createContext<InputGroupContext>();

/** Provide the group's context to its parts. */
export const setInputGroupContext = write;

/** The enclosing group's context, or a standalone default when a part is used on its own. */
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
			size: 'md',
			textSize: undefined
		};
	}
}
