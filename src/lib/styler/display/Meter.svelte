<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSize, FsTone } from '../types';
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
		size?: FsSize;
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
		size = 'md',
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

	const ZONE_TONE: Record<MeterZone, FsTone> = {
		optimum: 'success',
		'sub-optimum': 'warning',
		critical: 'danger'
	};

	const markers = $derived<BarMarker[]>([
		...(low !== undefined ? [{ at: (low - min) / span, label: 'Low threshold' }] : []),
		...(high !== undefined ? [{ at: (high - min) / span, label: 'High threshold' }] : [])
	]);

	const displayValue = $derived(formatValue ? formatValue(value) : `${Math.round(value)} / ${max}`);
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label || showValue}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValue}<span class="text-sm mono text-muted">{displayValue}</span>{/if}
		</div>
	{/if}
	<div
		role="meter"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label}
		aria-valuetext="{displayValue} ({zone})"
		class="wfull"
	>
		<Bar {fraction} tone={ZONE_TONE[zone]} {size} {markers} />
	</div>
</div>
