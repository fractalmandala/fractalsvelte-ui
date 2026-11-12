<!-- @component A gauge for a value on a known range, with optional low, high and optimum thresholds. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { heightClass, textClass, type Size, type Tone } from '../../../internal/tokens.js';
	import { meterScale } from './meter.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The current value, on the range from `min` to `max`. */
		value?: number;
		/** The lower bound of the range. */
		min?: number;
		/** The upper bound of the range. */
		max?: number;
		/** The upper edge of the low region, used with `high` and `optimum` to pick a tone. */
		low?: number;
		/** The lower edge of the high region, used with `low` and `optimum` to pick a tone. */
		high?: number;
		/** The best value on the range. Defaults to the midpoint. */
		optimum?: number;
		/** Forces a tone, instead of the one picked from the low / high / optimum regions. */
		tone?: Tone;
		/** The thickness of a linear track, or the diameter of a ring, scaled with the text size. */
		size?: Size;
		/** `linear` is a bar; `ring` is a circular gauge with a label in the centre. */
		variant?: 'linear' | 'ring';
		/** The stroke thickness of a ring, expressed through the text scale the ring already uses. */
		thickness?: 'sm' | 'md' | 'lg';
		/** A visible name for the meter, such as "Storage used". */
		label?: string;
		/** Shows the numeric value to the right of the label, in tabular numerals. */
		showValue?: boolean;
		/** Accessible value text, and the ring centre when `children` are omitted. Defaults to the value. */
		valueText?: string;
		/** Custom centre content on a ring. Replaces the default centre text when provided. */
		children?: Snippet;
	}

	let {
		value = 0,
		min = 0,
		max = 100,
		low,
		high,
		optimum,
		tone,
		size = 'md',
		variant = 'linear',
		thickness = 'md',
		label,
		showValue = false,
		valueText,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const toneVar: Record<Tone, string> = {
		neutral: 'var(--bg-button)',
		info: 'var(--info)',
		success: 'var(--success)',
		warning: 'var(--warning)',
		danger: 'var(--danger)'
	};

	const regionTone: Record<ReturnType<typeof meterScale>['region'], Tone> = {
		optimum: 'success',
		suboptimum: 'warning',
		'even-less-good': 'danger'
	};

	const thickClass: Record<'sm' | 'md' | 'lg', string> = {
		sm: 'text-xs',
		md: 'text-md',
		lg: 'text-lg'
	};

	const scale = $derived(meterScale({ value, min, max, low, high, optimum }));
	const resolvedTone = $derived(tone ?? regionTone[scale.region]);
	const text = $derived(valueText ?? String(scale.value));
	const colour = $derived({ value: scale.fraction, 'theme-color': toneVar[resolvedTone] });
</script>

{#if variant === 'ring'}
	<div
		class={['relative inline-grid square', heightClass[size], klass]}
		role="meter"
		aria-label={label}
		aria-valuemin={scale.min}
		aria-valuemax={scale.max}
		aria-valuenow={scale.value}
		aria-valuetext={text}
		{...rest}
	>
		<div class={['ring full', thickClass[thickness]]} {@attach vars(colour)}></div>
		{#if children || text}
			<div class={['cover box xcenter ycenter tabular-nums text-secondary', textClass[size]]}>
				{#if children}
					{@render children()}
				{:else}
					{text}
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class={['box gap-xs wfull', textClass[size], klass]} {...rest}>
		{#if label || showValue}
			<div class="row xbetween ycenter gap-sm">
				{#if label}
					<span class="text-sm text-secondary">{label}</span>
				{/if}
				{#if showValue}
					<span class="text-sm text-muted tabular-nums">{text}</span>
				{/if}
			</div>
		{/if}
		<div
			class="track slim wfull overflow-hidden"
			role="meter"
			aria-label={label}
			aria-valuemin={scale.min}
			aria-valuemax={scale.max}
			aria-valuenow={scale.value}
			aria-valuetext={text}
		>
			<div class="fill spring" {@attach vars(colour)}></div>
		</div>
	</div>
{/if}
