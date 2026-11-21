<!-- @component Horizontal progress indicator with determinate, indeterminate, and striped states. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type ChildTextColor, type Gap, type Shape, type Size, type TextColor, type TextSize, type Tone } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number | null;
		min?: number;
		max?: number;
		tone?: Tone;
		size?: Size;
		shape?: Shape;
		gap?: Gap;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		striped?: boolean;
		animated?: boolean;
		showValue?: boolean;
		label?: string;
		formatValue?: (value: number, pct: number) => string;
	}

	let {
		value = null,
		min = 0,
		max = 100,
		tone = 'info',
		size = 'h-bs',
		shape = 'round',
		gap = 'gap-xs',
		textSize = 'text-sm',
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		striped = false,
		animated = false,
		showValue = false,
		label,
		formatValue,
		class: className,
		...rest
	}: Props = $props();

	const indeterminate = $derived(value === null || value === undefined || Number.isNaN(value));
	const span = $derived(Math.max(1e-6, max - min));
	const clamped = $derived(
		indeterminate ? min : Math.min(max, Math.max(min, value as number))
	);
	const fraction = $derived(indeterminate ? 0.35 : (clamped - min) / span);
	const pct = $derived(Math.round(fraction * 100));
	const readout = $derived(
		indeterminate ? '' : formatValue ? formatValue(clamped, pct) : `${pct}%`
	);
	const toneCls = $derived(tone === 'neutral' ? undefined : `tone-${tone}`);
</script>

<div class={['box wfull', gap, size, className]} {...rest}>
	{#if label || (showValue && !indeterminate)}
		<div class="row xbetween ycenter gap-sm">
			{#if label}
				<span class={['weight-500', textSize, textColor]}>{label}</span>
			{/if}
			{#if showValue && !indeterminate}
				<span class={['tabular-nums', textSize, childTextColor]}>{readout}</span>
			{/if}
		</div>
	{/if}
	<div
		role="progressbar"
		aria-label={label}
		aria-valuemin={indeterminate ? undefined : min}
		aria-valuemax={indeterminate ? undefined : max}
		aria-valuenow={indeterminate ? undefined : clamped}
		aria-valuetext={indeterminate ? undefined : readout}
		class={['track slim wfull overflow-hidden', shape, toneCls]}
	>
		<div
			class={[
				'fill spring',
				(striped || animated) && 'stripes',
				animated && !indeterminate && 'stripes-anim',
				indeterminate && 'indeterminate'
			]}
			{@attach vars({ value: indeterminate ? undefined : fraction })}
		></div>
	</div>
</div>
