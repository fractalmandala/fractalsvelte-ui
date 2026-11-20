<!-- @component A swatch grid of the named themes, each previewing its accent, with a spring-in selected ring. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/helpers.js';
import { type Size } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { theme, themes, type ThemeName } from '../../../theme/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: ThemeName;
		onValueChange?: (value: ThemeName) => void;
		size?: Size;
		showLabels?: boolean;
		label?: string;
	}

	let {
		value = $bindable(),
		onValueChange,
		size = 'h-lg',
		showLabels = false,
		label = 'Theme',
		class: className,
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
	class={['row wrap gap-sm', size, className]}
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
