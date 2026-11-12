import type { IconData } from '@fractaldesign/icons';

/** One row in a SplitButton menu. */
export interface SplitButtonItem {
	/** The row's text. */
	label: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** Called when the row is chosen by click, Enter or Space. The menu closes afterwards. */
	onSelect: () => void;
	/** Dims the row and removes it from keyboard navigation. */
	disabled?: boolean;
	/** Draws the row in the danger ink, for destructive choices. */
	danger?: boolean;
}

/** Where the menu opens relative to the whole split button. */
export type SplitButtonPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
