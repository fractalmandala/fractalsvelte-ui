import type { IconData } from '@fractaldesign/icons';

export interface SplitButtonItem {
	label: string;
	icon?: IconData;
	onSelect: () => void;
	disabled?: boolean;
	danger?: boolean;
}

