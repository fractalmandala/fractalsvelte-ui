<!-- @component Themes a subtree independently of the page, or the whole document with `root`. -->

<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import type { Shape } from '../../../internal/tokens.js';
	import {
		initTheme,
		theme as shared,
		themeInitScript,
		type ThemeDensity,
		type ThemeMode,
		type ThemeMotion,
		type ThemeName,
		type ThemeSettings
	} from '../../../theme/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		theme?: ThemeName;
		mode?: ThemeMode;
		hue?: number;
		chroma?: number;
		tint?: number;
		shape?: Shape;
		density?: ThemeDensity;
		motion?: ThemeMotion;
		as?: 'div' | 'section' | 'article' | 'aside';
		root?: boolean;
		storageKey?: string | false;
		children?: Snippet;
	}

	let {
		theme: themeName,
		mode,
		hue,
		chroma,
		tint,
		shape,
		density,
		motion,
		as: tag = 'div',
		root = false,
		storageKey,
		class: className,
		children,
		...rest
	}: Props = $props();

	if (untrack(() => root)) {
		const defaults: Partial<ThemeSettings> = {};
		untrack(() => {
			if (themeName) defaults.theme = themeName;
			if (mode) defaults.mode = mode;
			if (shape) defaults.shape = shape;
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
		class={className}
		data-theme={name}
		data-mode={dataMode}
		data-shape={shape}
		data-density={density}
		data-motion={motion}
		{@attach vars(numbers)}
		{...rest}
	>
		{@render children?.()}
	</svelte:element>
{/if}
