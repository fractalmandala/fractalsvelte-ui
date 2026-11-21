export interface NativeSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface NativeSelectGroup {
	label: string;
	options: NativeSelectOption[];
}

export type NativeSelectItem = NativeSelectOption | NativeSelectGroup;

export function isNativeSelectGroup(item: NativeSelectItem): item is NativeSelectGroup {
	return 'options' in item;
}
