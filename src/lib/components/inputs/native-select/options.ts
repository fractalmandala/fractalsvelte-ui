/** A single choice in a native select. */
export interface NativeSelectOption {
	/** The value submitted with the form. */
	value: string;
	/** The visible label. */
	label: string;
	/** Prevents the option from being chosen. */
	disabled?: boolean;
}

/** A labelled group of options, rendered as an `<optgroup>`. */
export interface NativeSelectGroup {
	/** The group's visible heading. */
	label: string;
	/** The options in the group. */
	options: NativeSelectOption[];
}

export type NativeSelectItem = NativeSelectOption | NativeSelectGroup;

export function isNativeSelectGroup(item: NativeSelectItem): item is NativeSelectGroup {
	return 'options' in item;
}
