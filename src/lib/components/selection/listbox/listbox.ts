import type { IconData } from '@fractaldesign/icons';

/** One choice in a Listbox. `value` is what it reports; the rest is presentation. */
export interface ListboxOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
	icon?: IconData;
	/** Section the option belongs to; options are grouped in first-seen order. */
	group?: string;
}

/** One section of options, in the order its first member appeared. */
export interface ListboxSection {
	group: string | undefined;
	items: ListboxOption[];
}

/** Bucket options by `group`, keeping the order in which each group first appears. */
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
