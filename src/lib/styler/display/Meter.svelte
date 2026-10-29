<!-- @component A gauge bar for a value in a known range, coloured by low, high and optimum zones. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, MessageText } from '../types';
	import Bar, { type BarMarker } from './Bar.svelte';

	export type MeterZone = 'optimum' | 'sub-optimum' | 'critical';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value: number;
		min?: number;
		max?: number;
		low?: number;
		high?: number;
		optimum?: number;
		label?: string;
		showValue?: boolean;
		size?: Size;
		/** Bar colour. Unset, it follows the zone: text-success, text-warning or text-danger. */
		tone?: MessageText;
		direction?: 'horizontal' | 'vertical';
		formatValue?: (val: number) => string;
		class?: string;
	}

	let {
		value,
		min = 0,
		max = 100,
		low,
		high,
		optimum,
		label,
		showValue = false,
		size = 'h-md',
		tone,
		direction = 'horizontal',
		formatValue,
		class: className = '',
		...restProps
	}: Props = $props();

	const span = $derived(max - min || 100);
	const fraction = $derived(Math.min(1, Math.max(0, (value - min) / span)));

	// Same zone rules as the native <meter> element.
	const zone = $derived.by<MeterZone>(() => {
		const effLow = low ?? min;
		const effHigh = high ?? max;
		const effOpt = optimum ?? (min + max) / 2;
		if (effOpt >= effHigh) {
			if (value >= effHigh) return 'optimum';
			if (value >= effLow) return 'sub-optimum';
			return 'critical';
		}
		if (effOpt <= effLow) {
			if (value <= effLow) return 'optimum';
			if (value <= effHigh) return 'sub-optimum';
			return 'critical';
		}
		return value >= effLow && value <= effHigh ? 'optimum' : 'sub-optimum';
	});

	const ZONE_TONE: Record<MeterZone, MessageText> = {
		optimum: 'text-success',
		'sub-optimum': 'text-warning',
		critical: 'text-danger'
	};

	const markers = $derived<BarMarker[]>([
		...(low !== undefined ? [{ at: (low - min) / span, label: 'Low threshold' }] : []),
		...(high !== undefined ? [{ at: (high - min) / span, label: 'High threshold' }] : [])
	]);

	const displayValue = $derived(formatValue ? formatValue(value) : `${Math.round(value)} / ${max}`);
</script>

<div class="box gap-xs {direction === 'vertical' ? 'xcenter' : ''} {className}" {...restProps}>
	{#if label || showValue}
		<div class="{direction === 'vertical' ? 'box xcenter' : 'row ycenter xbetween'} gap-sm">
			{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValue}<span class="text-sm tabular-nums text-muted">{displayValue}</span>{/if}
		</div>
	{/if}
	<div
		role="meter"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label}
		aria-valuetext="{displayValue} ({zone})"
		class={direction === 'vertical' ? 'row xcenter' : 'wfull'}
	>
		<Bar {fraction} tone={tone ?? ZONE_TONE[zone]} {size} {markers} {direction} />
	</div>
</div>
