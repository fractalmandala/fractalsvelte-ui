import { getContext, setContext } from 'svelte';
import type { Shape, Size } from '../../../internal/tokens.js';

/** The look a `Field` can pass down to the control inside it. */
export type FieldVariant = 'outline' | 'filled' | 'ghost';

/** What a `Field` shares with the control inside it. Every member is reactive. */
export interface FieldContext {
	/** The id the control should carry — the label's `for` points at it. */
	readonly controlId: string;
	/** The id of the label element, for controls that are groups (`aria-labelledby`). */
	readonly labelId: string | undefined;
	/** The ids of the hint or error text, for `aria-describedby`. */
	readonly describedBy: string | undefined;
	/** Whether the field has an error. */
	readonly invalid: boolean;
	/** Whether the field is required. */
	readonly required: boolean;
	/** Whether the field is disabled. */
	readonly disabled: boolean;
	/** The control height, inherited when the control does not set its own. */
	readonly size: Size | undefined;
	/** The corner shape, inherited when the control does not set its own. */
	readonly shape: Shape | undefined;
	/** The field look, inherited when the control does not set its own. */
	readonly variant: FieldVariant | undefined;
}

const KEY = Symbol('fractalsvelte-field');

/** Provide a field context to descendants. Called by `Field`. */
export function setFieldContext(context: FieldContext): void {
	setContext(KEY, context);
}

/**
 * The nearest `Field`'s context, or `undefined` outside one. Call it during
 * component initialisation.
 */
export function getFieldContext(): FieldContext | undefined {
	return getContext<FieldContext | undefined>(KEY);
}

/** A control's own settings, which win over the field's. */
export interface FieldControlOwn {
	id?: string | null;
	invalid?: boolean | null;
	required?: boolean | null;
	disabled?: boolean | null;
	describedby?: string | null;
	size?: Size | null;
	shape?: Shape | null;
	variant?: FieldVariant | null;
}

/** The merged attributes a control puts on its native element. */
export interface FieldControl {
	readonly id: string;
	readonly labelId: string | undefined;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly disabled: boolean;
	readonly describedby: string | undefined;
	/** Whether a `Field` is wrapping the control. */
	readonly inField: boolean;
	/** Own size, else the field's, else `undefined` (the control applies its default). */
	readonly size: Size | undefined;
	/** Own shape, else the field's, else `undefined`. */
	readonly shape: Shape | undefined;
	/** Own variant, else the field's, else `undefined`. */
	readonly variant: FieldVariant | undefined;
}

/**
 * Merge a control's own props with the surrounding `Field`: the control's value
 * wins; otherwise the field's applies. Call it during component initialisation.
 *
 * @param fallbackId An id for the control when neither it nor a field supplies one (`$props.id()`).
 * @param own A getter for the control's own props, so the result stays reactive.
 */
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
