import type { IconData } from '@fractaldesign/icons';

export interface SidebarItem {
	label?: string;
	href?: string;
	icon?: IconData;
	badge?: string | number;
	children?: SidebarItem[];
	disabled?: boolean;
	separator?: boolean;
	defaultOpen?: boolean;
}
