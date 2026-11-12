<!-- @component A swatch grid of the named themes, each previewing its accent, with a spring-in selected ring. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/roving.js';
	import { textClass, type Size } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { theme, themes, type ThemeName } from '../../../theme/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The named theme. Bindable. Leave it undefined to read and write the shared `theme`. */
		value?: ThemeName;
		/** Called with the new theme whenever the person picks one. */
		onValueChange?: (value: ThemeName) => void;
		/** The swatch and label scale. */
		size?: Size;
		/** Draws the theme name under each swatch. */
		showLabels?: boolean;
		/** The accessible name of the group. */
		label?: string;
	}

	let {
		value = $bindable(),
		onValueChange,
		size = 'md',
		showLabels = false,
		label = 'Theme',
		class: klass,
		...rest
	}: Props = $props();

	const current = $derived<ThemeName>(value ?? theme.theme);

	function pick(name: ThemeName): void {
		if (name === current) return;
		if (value === undefined) theme.setTheme(name);
		else value = name;
		onValueChange?.(name);
	}
</script>

<div
	role="radiogroup"
	aria-label={label}
	class={['row wrap gap-sm', textClass[size], klass]}
	{@attach roving({ orientation: 'both', onNavigate: (item) => item.click() })}
	{...rest}
>
	{#each themes as preset (preset.id)}
		{@const on = preset.id === current}
		<button
			type="button"
			role="radio"
			aria-checked={on}
			aria-label={preset.label}
			tabindex={on ? 0 : -1}
			class="bare pick focus-ring box xcenter gap-xs"
			onclick={() => pick(preset.id)}
			{@attach vars({ hue: preset.hue, chroma: preset.chroma })}
		>
			<span class={['orb', on && 'selected']}></span>
			{#if showLabels}
				<span class="text-sm text-secondary">{preset.label}</span>
			{/if}
		</button>
	{/each}
</div>
