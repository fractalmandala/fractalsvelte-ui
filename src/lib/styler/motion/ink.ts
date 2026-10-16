// Canvas drawing needs colours as strings. These helpers *read* them from
// fractalstyler — an element's computed ink, or the tokens on its nearest
// [data-mode] ancestor — so canvases follow the theme without hardcoded hex.

/** The resolved `color` of an element (set by a .text-* class on it). */
export function inkOf(el: Element): string {
	return getComputedStyle(el).color;
}

/** Resolved values of fractalstyler colour tokens, read from an element's scope. */
export function tokens(el: Element, names: string[]): string[] {
	const cs = getComputedStyle(el);
	return names.map((n) => cs.getPropertyValue(n).trim()).filter(Boolean);
}

/** The status and theme palette, for multi-colour effects like confetti. */
export const PALETTE_TOKENS = ['--theme-color', '--theme-color-alt', '--success', '--warning', '--danger', '--info'];
