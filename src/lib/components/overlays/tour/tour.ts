export interface TourStep {
	target?: string | Element | (() => Element | null) | null;
	title?: string;
	description?: string;
	placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function resolveTourTarget(target?: TourStep['target']): Element | null {
	if (!target || typeof document === 'undefined') return null;
	if (typeof target === 'string') return document.querySelector(target);
	if (typeof target === 'function') return target();

	return target as Element;
}
