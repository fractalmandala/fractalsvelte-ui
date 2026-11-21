import { startViewTransition, type ViewTransitionType } from '../../../motion/index.js';

export interface MorphOptions {
	type?: ViewTransitionType;
	origin?: { x: number; y: number } | MouseEvent | Element;
}

export function morph(update: () => void | Promise<void>, options: MorphOptions = {}): Promise<void> {
	return startViewTransition(update, options);
}
