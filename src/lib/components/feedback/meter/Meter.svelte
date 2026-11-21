<!-- @component A gauge for a value on a known range, with optional low, high and optimum thresholds. -->

<script lang="ts">
	import type {  Space  } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type ChildTextColor, type Size, type TextColor, type TextSize, type Tone } from '../../../internal/tokens.js';
	import { meterScale } from './meter.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		min?: number;
		max?: number;
		low?: number;
		high?: number;
		optimum?: number;
		tone?: Tone;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		form?: 'linear' | 'ring';
		thickness?: Space;
		indeterminate?: boolean;
		striped?: boolean;
		label?: string;
		showValue?: boolean;
		valueText?: string;
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
		size = 'h-lg',
		textSize = 'text-sm',
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		form = 'linear',
		thickness = 'md',
		indeterminate = false,
		striped = false,
		label,
		showValue = false,
		valueText,
		children,
		class: className,
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

	const thickClass: Partial<Record<Space, string>> = {
		sm: 'text-xs',
		md: 'text-md',
		lg: 'text-lg'
	};

	const scale = $derived(meterScale({ value, min, max, low, high, optimum }));
	const resolvedTone = $derived(tone ?? regionTone[scale.region]);
	const text = $derived(valueText ?? String(scale.value));
	const fillValue = $derived(indeterminate ? (form === 'ring' ? 0.25 : 0.35) : scale.fraction);
	const colour = $derived({ value: fillValue, 'theme-color': toneVar[resolvedTone] });
</script>

{#if form === 'ring'}
	<div
		class={['relative inline-grid square', size, className]}
		role="meter"
		aria-label={label}
		aria-valuemin={indeterminate ? undefined : scale.min}
		aria-valuemax={indeterminate ? undefined : scale.max}
		aria-valuenow={indeterminate ? undefined : scale.value}
		aria-valuetext={indeterminate ? undefined : text}
		{...rest}
	>
		<div
			class={['ring full', thickClass[thickness], indeterminate && 'anim-spin']}
			{@attach vars(colour)}
		></div>
		{#if children || text}
			<div class={['cover box xcenter ycenter tabular-nums', size, textColor]}>
				{#if children}
					{@render children()}
				{:else}
					{text}
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class={['box gap-xs wfull', size, className]} {...rest}>
		{#if label || showValue}
			<div class="row xbetween ycenter gap-sm">
				{#if label}
					<span class={[textSize, textColor]}>{label}</span>
				{/if}
				{#if showValue}
					<span class={[textSize, childTextColor, 'tabular-nums']}>{text}</span>
				{/if}
			</div>
		{/if}
		<div
			class="track slim wfull overflow-hidden"
			role="meter"
			aria-label={label}
			aria-valuemin={indeterminate ? undefined : scale.min}
			aria-valuemax={indeterminate ? undefined : scale.max}
			aria-valuenow={indeterminate ? undefined : scale.value}
			aria-valuetext={indeterminate ? undefined : text}
		>
			<div
				class={['fill spring', striped && 'stripes', indeterminate && 'anim-slide']}
				{@attach vars(colour)}
			></div>
		</div>
	</div>
{/if}
