import type { IconData } from '@fractaldesign/icons';

/** Visual and semantic state of a step. */
export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

/** One step in a Stepper. */
export interface StepItem {
	/** A stable value for this step, written to the stepper's `value` when it is current. */
	value: string;
	/** The visible title. */
	label: string;
	/** A short supporting line under the title. */
	description?: string;
	/** An icon drawn in the marker, in place of the step number or a check. */
	icon?: IconData;
	/** Overrides the derived state (complete, current, upcoming) for this step. */
	status?: StepStatus;
	/** Prevents the step from being selected when the stepper is clickable. */
	disabled?: boolean;
}
