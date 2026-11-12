import { startViewTransition, type ViewTransitionType } from '../../../motion/index.js';

/** Options for {@link morph}. */
export interface MorphOptions {
	/** The transition style. Defaults to `'fade'`. */
	type?: ViewTransitionType;
	/** Origin for the `'reveal'` wipe: a point, a pointer event, or an element's centre. */
	origin?: { x: number; y: number } | MouseEvent | Element;
}

/**
 * Run an in-page state change inside a view transition, so elements that share
 * a `SharedElement` name (and anything else in the snapshot) morph from their
 * old box to their new one. Falls back to applying `update` directly when the
 * API is missing or reduced motion is on.
 *
 * @param update The state change to apply (for example `() => (selected = card)`).
 * @param options `type` and optional `origin` (used by `'reveal'`).
 */
export function morph(update: () => void | Promise<void>, options: MorphOptions = {}): Promise<void> {
	return startViewTransition(update, options);
}
