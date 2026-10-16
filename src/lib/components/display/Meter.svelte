<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

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

	const percentage = $derived(
		Math.min(100, Math.max(0, ((value - min) / ((max - min) || 100)) * 100))
	);

	const zone = $derived.by<MeterZone>(() => {
		const effLow = low ?? min;
		const effHigh = high ?? max;
		const effOpt = optimum ?? (min + max) / 2;

		if (effOpt >= effHigh) {
			if (value >= effHigh) return 'optimum';
			if (value >= effLow) return 'sub-optimum';
			return 'critical';
		} else if (effOpt <= effLow) {
			if (value <= effLow) return 'optimum';
			if (value <= effHigh) return 'sub-optimum';
			return 'critical';
		} else {
			if (value >= effLow && value <= effHigh) return 'optimum';
			return 'sub-optimum';
		}
	});

	const displayValue = $derived(
		formatValue ? formatValue(value) : `${Math.round(value)} / ${max}`
	);
</script>

<div
	class="f-meter {className}"
	data-size={size}
	data-zone={zone}
	{...restProps}
>
	{#if label || showValue}
		<div class="f-meter-header">
			{#if label}
				<span class="f-meter-label">{label}</span>
			{/if}
			{#if showValue}
				<span class="f-meter-value">{displayValue}</span>
			{/if}
		</div>
	{/if}

	<div
		role="meter"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label}
		class="f-meter-track"
	>
		<div
			class="f-meter-bar"
			style="width: {percentage}%"
		></div>

		{#if low !== undefined}
			<span
				class="f-meter-marker"
				title="Low threshold"
				style="left: {((low - min) / (max - min)) * 100}%"
			></span>
		{/if}
		{#if high !== undefined}
			<span
				class="f-meter-marker"
				title="High threshold"
				style="left: {((high - min) / (max - min)) * 100}%"
			></span>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-meter {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			box-sizing: border-box;
			font-family: inherit;
		}

		.f-meter-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: var(--f-text-xs);
			font-weight: 500;
			color: var(--f-text-muted);
		}

		.f-meter-track {
			position: relative;
			width: 100%;
			background: var(--f-sunken);
			border-radius: var(--f-radius-full);
			overflow: hidden;
		}

		.f-meter-bar {
			height: 100%;
			border-radius: var(--f-radius-full);
			transition: width var(--f-duration-normal) var(--f-ease),
				background-color var(--f-duration-normal) var(--f-ease);
		}

		.f-meter-marker {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 2px;
			background: var(--f-surface);
			opacity: 0.7;
			pointer-events: none;
		}

		/* Sizes */
		.f-meter[data-size='sm'] .f-meter-track {
			height: 6px;
		}
		.f-meter[data-size='md'] .f-meter-track {
			height: 8px;
		}
		.f-meter[data-size='lg'] .f-meter-track {
			height: 12px;
		}

		/* Zones */
		.f-meter[data-zone='optimum'] .f-meter-bar {
			background-color: var(--f-success);
		}
		.f-meter[data-zone='sub-optimum'] .f-meter-bar {
			background-color: var(--f-warning);
		}
		.f-meter[data-zone='critical'] .f-meter-bar {
			background-color: var(--f-danger);
		}
	}
</style>
