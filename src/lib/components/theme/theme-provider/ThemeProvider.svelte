<!-- @component Themes a subtree independently of the page, or the whole document with `root`. -->

<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import {
		initTheme,
		theme as shared,
		themeInitScript,
		type ThemeDensity,
		type ThemeMode,
		type ThemeMotion,
		type ThemeName,
		type ThemeRadius,
		type ThemeSettings
	} from '../../../theme/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** The named theme for this subtree. Leave it out to inherit the page's theme, including any hue, chroma and tint the page has customised. */
		theme?: ThemeName;
		/** The colour mode for this subtree. `system` follows the OS; leave it out to inherit the page's mode. */
		mode?: ThemeMode;
		/** The accent hue, 0 to 360, overriding the named theme. */
		hue?: number;
		/** How vivid the accent is, 0 to about 0.3, overriding the named theme. */
		chroma?: number;
		/** How much of the hue the neutrals carry, 0 to about 0.04, overriding the named theme. */
		tint?: number;
		/** The corner ladder for this subtree. */
		radius?: ThemeRadius;
		/** The spacing and height ladder for this subtree. */
		density?: ThemeDensity;
		/** How lively motion is inside this subtree. */
		motion?: ThemeMotion;
		/** The element to render as the wrapper. */
		as?: 'div' | 'section' | 'article' | 'aside';
		/** Themes the whole document instead of a subtree: calls `initTheme()` (restore, persist, follow the OS) and renders no wrapper. Use it once, in the root layout. */
		root?: boolean;
		/** With `root`, the `localStorage` key the theme persists under; `false` disables persistence. */
		storageKey?: string | false;
		/** The content to theme. */
		children?: Snippet;
	}

	let {
		theme: themeName,
		mode,
		hue,
		chroma,
		tint,
		radius,
		density,
		motion,
		as: tag = 'div',
		root = false,
		storageKey,
		class: klass,
		children,
		...rest
	}: Props = $props();

	if (untrack(() => root)) {
		const defaults: Partial<ThemeSettings> = {};
		untrack(() => {
			if (themeName) defaults.theme = themeName;
			if (mode) defaults.mode = mode;
			if (radius) defaults.radius = radius;
			if (density) defaults.density = density;
			if (motion) defaults.motion = motion;
			if (hue !== undefined) defaults.hue = hue;
			if (chroma !== undefined) defaults.chroma = chroma;
			if (tint !== undefined) defaults.tint = tint;
		});
		initTheme({ defaults, storageKey: untrack(() => storageKey) });
	}

	const inherits = $derived(themeName === undefined);
	const name = $derived(themeName ?? shared.theme);
	const dataMode = $derived(mode === undefined ? undefined : mode === 'system' ? (shared.systemDark ? 'dark' : 'light') : mode);
	const numbers = $derived({
		hue: hue ?? (inherits ? shared.hue : null),
		chroma: chroma ?? (inherits ? shared.chroma : null),
		tint: tint ?? (inherits ? shared.tint : null)
	});
	// Built from parts so the literal tag never appears inside this script block.
	const initScript = $derived(
		root && storageKey !== false ? '<' + 'script>' + themeInitScript(storageKey) + '<' + '/script>' : ''
	);
</script>

<svelte:head>{@html initScript}</svelte:head>

{#if root}
	{@render children?.()}
{:else}
	<svelte:element
		this={tag}
		class={klass}
		data-theme={name}
		data-mode={dataMode}
		data-radius={radius}
		data-density={density}
		data-motion={motion}
		{@attach vars(numbers)}
		{...rest}
	>
		{@render children?.()}
	</svelte:element>
{/if}
