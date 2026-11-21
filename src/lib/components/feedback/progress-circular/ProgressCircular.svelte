<!-- @component Circular progress ring with determinate fill, indeterminate spin, and centered readout. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type Size, type TextColor, type TextSize, type Tone } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number | null;
		min?: number;
		max?: number;
		tone?: Tone;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		showValue?: boolean;
		label?: string;
		children?: Snippet;
	}

	let {
		value = null,
		min = 0,
		max = 100,
		tone = 'info',
		size = 'h-2xl',
		textSize = 'text-xs',
		textColor = 'text-secondary',
		showValue = false,
		label,
		children,
		class: className,
		...rest
	}: Props = $props();

	const indeterminate = $derived(value === null || value === undefined || Number.isNaN(value));
	const span = $derived(Math.max(1e-6, max - min));
	const clamped = $derived(
		indeterminate ? min : Math.min(max, Math.max(min, value as number))
	);
	const fraction = $derived(indeterminate ? 0.25 : (clamped - min) / span);
	const pct = $derived(Math.round(fraction * 100));
	const toneCls = $derived(tone === 'neutral' ? undefined : `tone-${tone}`);
</script>

<div
	role="progressbar"
	aria-label={label}
	aria-valuemin={indeterminate ? undefined : min}
	aria-valuemax={indeterminate ? undefined : max}
	aria-valuenow={indeterminate ? undefined : clamped}
	aria-valuetext={indeterminate || !showValue ? undefined : `${pct}%`}
	class={['relative inline-grid square', size, toneCls, className]}
	{...rest}
>
	<div
		class={['ring full', size, indeterminate && 'anim-spin']}
		{@attach vars({ value: fraction })}
	></div>
	{#if children || (showValue && !indeterminate)}
		<div class={['cover row xcenter ycenter tabular-nums', size, textColor]}>
			{#if children}
				{@render children()}
			{:else}
				<span class={['weight-500', textSize]}>{pct}%</span>
			{/if}
		</div>
	{/if}
</div>
