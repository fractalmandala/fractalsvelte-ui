import type { IconData } from '@fractaldesign/icons';

export interface SplitButtonItem {
	label: string;
	icon?: IconData;
	onSelect: () => void;
	disabled?: boolean;
	danger?: boolean;
}

export type SplitButtonPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
