import type { HTMLButtonAttributes } from 'svelte/elements';


export type DialogScrollBehavior = 'inside' | 'outside';


export interface OverlayTrigger {
	props: HTMLButtonAttributes;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export interface OverlayContent {
	close: () => void;
}


