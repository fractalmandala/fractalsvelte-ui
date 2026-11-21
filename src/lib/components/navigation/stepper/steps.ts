import type { IconData } from '@fractaldesign/icons';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepItem {
	value: string;
	label: string;
	description?: string;
	icon?: IconData;
	status?: StepStatus;
	disabled?: boolean;
}
