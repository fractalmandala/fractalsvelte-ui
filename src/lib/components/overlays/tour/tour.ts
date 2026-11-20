/** One step of a guided tour. */
export interface TourStep {
	/** A CSS selector, an element, or a function that returns one. */
	target?: string | Element | (() => Element | null) | null;
	title?: string;
	description?: string;
	placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * The element a step points at, however it was written: a selector, an
 * element, or a getter. `null` while there is no DOM, or when nothing matches.
 */
export function resolveTourTarget(target?: TourStep['target']): Element | null {
	if (!target || typeof document === 'undefined') return null;
	if (typeof target === 'string') return document.querySelector(target);
	if (typeof target === 'function') return target();

	return target as Element;
}
