import type { SelectOption } from '../../pickers/select/options.js';
export type ListboxOption = SelectOption;


export interface ListboxSection {
	group: string | undefined;
	items: ListboxOption[];
}

export function groupOptions(options: readonly ListboxOption[]): ListboxSection[] {
	const sections: ListboxSection[] = [];
	const byGroup = new Map<string | undefined, ListboxSection>();

	for (const option of options) {
		let bucket = byGroup.get(option.group);
		if (!bucket) {
			bucket = { group: option.group, items: [] };
			byGroup.set(option.group, bucket);
			sections.push(bucket);
		}
		bucket.items.push(option);
	}

	return sections;
}
