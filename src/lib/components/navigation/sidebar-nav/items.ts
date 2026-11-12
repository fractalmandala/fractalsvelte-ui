import type { IconData } from '@fractaldesign/icons';

/** One entry in a SidebarNav tree: a link, a collapsible group, or a separator. */
export interface SidebarItem {
	/** The visible label. Omit it on a separator. */
	label?: string;
	/** A destination. Items with `children` are groups and ignore this. */
	href?: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** A short badge or count, drawn after the label. */
	badge?: string | number;
	/** Nested items; when present, this entry is a collapsible group. */
	children?: SidebarItem[];
	/** Prevents the item from being followed or opened. */
	disabled?: boolean;
	/** Renders a hairline separator instead of a link or a group. */
	separator?: boolean;
	/** When this is a group, whether it starts open. Groups that contain the current page start open anyway. */
	defaultOpen?: boolean;
}
