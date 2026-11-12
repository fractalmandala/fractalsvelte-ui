/** Props passed to the Collapsible `trigger` snippet. */
export interface CollapsibleTriggerProps {
	/** Whether the panel is open. */
	open: boolean;
	/** Whether the trigger is disabled. */
	disabled: boolean;
	/** Spread these onto the trigger button. */
	props: {
		id: string;
		type: 'button';
		'aria-expanded': boolean;
		'aria-controls': string;
		disabled: boolean;
		onclick: () => void;
	};
	/** Toggle the panel. */
	toggle: () => void;
}
