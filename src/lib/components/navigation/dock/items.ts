import type { IconData } from '@fractaldesign/icons';

/** One item in a Dock. */
export interface DockItem {
	/** A stable value for this item, used as the key and for `current`. */
	value: string;
	/** The hover label and the accessible name. */
	label: string;
	/** The icon drawn in the dock. */
	icon: IconData;
	/** A destination; when set, the item renders as a link. */
	href?: string;
	/** Called when the item is activated, if it is not a link. */
	onSelect?: () => void;
	/** Prevents the item from being activated. */
	disabled?: boolean;
}
