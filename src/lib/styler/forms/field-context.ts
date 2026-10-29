import { getContext, setContext } from 'svelte';
import type { Surface, Variant, Size, Shape, Shadow } from '../types';

/** Look a FormField hands down to the control inside it (Input, Select). */
export interface FieldLook {
	variant?: Variant;
	surface?: Surface;
	size?: Size;
	shape?: Shape;
	shadow?: Shadow;
	/** FormField has an error: the control shows its danger border. */
	invalid?: boolean;
}

const KEY = Symbol('form-field');

export const setFieldLook = (look: () => FieldLook) => setContext(KEY, look);
export const getFieldLook = (): FieldLook => getContext<(() => FieldLook) | undefined>(KEY)?.() ?? {};
