import type { HTMLButtonAttributes } from 'svelte/elements';

/** The width of a dialog, on the measure ladder; `full` fills the viewport less a margin. */
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** What scrolls when the content is taller than the viewport. */
export type DialogScrollBehavior = 'inside' | 'outside';

/** The fill of an overlay surface: opaque, or frosted glass. */
export type OverlaySurface = 'solid' | 'glass';

/** What a `trigger` snippet receives: props to spread on your own button, and the controls. */
export interface OverlayTrigger {
	/** Spread onto the trigger element: ARIA wiring and the click handler. */
	props: HTMLButtonAttributes;
	/** Whether the overlay is open. */
	isOpen: boolean;
	/** Opens the overlay. */
	open: () => void;
	/** Closes the overlay. */
	close: () => void;
	/** Opens it if closed, closes it if open. */
	toggle: () => void;
}

/** What a content snippet (`children`, `footer`) receives. */
export interface OverlayContent {
	/** Closes the overlay. */
	close: () => void;
}

/** `--size` for each dialog size. */
export const dialogWidth: Record<DialogSize, string> = {
	sm: 'var(--measure-sm)',
	md: 'var(--measure-md)',
	lg: 'var(--measure-lg)',
	xl: 'var(--measure-xl)',
	full: '100%'
};

/** The surface classes of a raised overlay panel. */
export const surfaceClass: Record<OverlaySurface, string> = {
	solid: 'bg-overlay border rim',
	glass: 'glass border rim'
};
