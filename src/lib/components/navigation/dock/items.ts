import type { IconData } from '@fractaldesign/icons';

export interface DockItem {
	value: string;
	label: string;
	icon: IconData;
	href?: string;
	onSelect?: () => void;
	disabled?: boolean;
}
