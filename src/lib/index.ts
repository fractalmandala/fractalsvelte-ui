/**
 * @fractaldesign/fractalsvelte-ui
 * Massive, token-driven Svelte 5 runes component library for SvelteKit.
 * Zero Tailwind. Scoped CSS. Precision ergonomics.
 */

// Types, Transitions, and Design Tokens
export * from './transitions';
export * from './view-transitions';
export { themeState } from './theme.svelte';

// Components (the styler edition)
export * from './styler';
// Names both ./types and ./styler export: the styler axes win.
export type { Pad, Placement, Shadow, Shape, Size, Space, Variant } from './styler';
