import { getContext, setContext } from 'svelte';
import type { Shape, Size, Variant } from '../../../internal/tokens.js';

export interface FieldContext {
	readonly controlId: string;
	readonly labelId: string | undefined;
	readonly describedBy: string | undefined;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly disabled: boolean;
	readonly size: Size | undefined;
	readonly shape: Shape | undefined;
	readonly variant: Variant | undefined;
}

const KEY = Symbol('fractalsvelte-field');

export function setFieldContext(context: FieldContext): void {
	setContext(KEY, context);
}

export function getFieldContext(): FieldContext | undefined {
	return getContext<FieldContext | undefined>(KEY);
}

export interface FieldControlOwn {
	id?: string | null;
	invalid?: boolean | null;
	required?: boolean | null;
	disabled?: boolean | null;
	describedby?: string | null;
	size?: Size | null;
	shape?: Shape | null;
	variant?: Variant | null;
}

export interface FieldControl {
	readonly id: string;
	readonly labelId: string | undefined;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly disabled: boolean;
	readonly describedby: string | undefined;
	readonly inField: boolean;
	readonly size: Size | undefined;
	readonly shape: Shape | undefined;
	readonly variant: Variant | undefined;
}

export function useFieldControl(fallbackId: string, own: () => FieldControlOwn): FieldControl {
	const field = getFieldContext();
	return {
		get id() {
			return own().id ?? field?.controlId ?? fallbackId;
		},
		get labelId() {
			return field?.labelId;
		},
		get invalid() {
			return own().invalid ?? field?.invalid ?? false;
		},
		get required() {
			return own().required ?? field?.required ?? false;
		},
		get disabled() {
			return own().disabled ?? field?.disabled ?? false;
		},
		get describedby() {
			const ids = [own().describedby, field?.describedBy].filter((v): v is string => Boolean(v));
			return ids.length ? ids.join(' ') : undefined;
		},
		get inField() {
			return field !== undefined;
		},
		get size() {
			return own().size ?? field?.size;
		},
		get shape() {
			return own().shape ?? field?.shape;
		},
		get variant() {
			return own().variant ?? field?.variant;
		}
	};
}
