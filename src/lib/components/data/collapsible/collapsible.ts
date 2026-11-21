export interface CollapsibleTriggerProps {
	open: boolean;
	disabled: boolean;
	props: {
		id: string;
		type: 'button';
		'aria-expanded': boolean;
		'aria-controls': string;
		disabled: boolean;
		onclick: () => void;
	};
	toggle: () => void;
}
