<!-- @component Horizontal progress indicator with determinate, indeterminate, and striped states. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Shape, type Size, type Tone } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Current progress value, or `null`/`undefined` for indeterminate motion. */
		value?: number | null;
		/** Lower bound of the range. */
		min?: number;
		/** Upper bound of the range. */
		max?: number;
		/** Semantic color accent. */
		tone?: Tone;
		/** Scale controlling label text and track thickness. */
		size?: Size;
		/** Track and fill corner shape. */
		shape?: Shape;
		/** Draw diagonal stripes across the fill bar. */
		striped?: boolean;
		/** Animate the diagonal stripes along the fill. */
		animated?: boolean;
		/** Display formatted progress percentage beside the label. */
		showValue?: boolean;
		/** Visible label and accessible name for the progress bar. */
		label?: string;
		/** Optional formatter for the displayed value readout. */
		formatValue?: (value: number, pct: number) => string;
	}

	let {
		value = null,
		min = 0,
		max = 100,
		tone = 'info',
		size = 'h-bs',
		shape = 'round',
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

<div class={['box gap-xs wfull', size, className]} {...rest}>
	{#if label || (showValue && !indeterminate)}
		<div class="row xbetween ycenter gap-sm">
			{#if label}
				<span class="text-sm text-secondary weight-500">{label}</span>
			{/if}
			{#if showValue && !indeterminate}
				<span class="text-sm text-muted tabular-nums">{readout}</span>
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
