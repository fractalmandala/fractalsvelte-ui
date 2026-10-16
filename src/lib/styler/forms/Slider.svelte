<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import SliderTrack from './SliderTrack.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		description?: string;
		showValue?: boolean;
		formatValue?: (val: number) => string;
		tone?: FsTone;
		disabled?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label,
		description,
		showValue = false,
		formatValue = (v: number) => String(v),
		tone = 'theme',
		disabled = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const sliderId = $derived(id || uid);

	let width = $state(0);
	let height = $state(0);
	let trackEl: HTMLDivElement | null = $state(null);
	let dragging = false;
	let focused = $state(false);

	const fraction = $derived(max <= min ? 0 : (Math.max(min, Math.min(max, value)) - min) / (max - min));

	function roundToStep(val: number): number {
		const raw = min + Math.round((val - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
	}

	function fromPointer(clientX: number) {
		if (!trackEl || disabled) return;
		const rect = trackEl.getBoundingClientRect();
		const r = rect.height / 2;
		const ratio = Math.max(0, Math.min(1, (clientX - rect.left - r) / Math.max(1, rect.width - r * 2)));
		value = roundToStep(min + ratio * (max - min));
	}

	function onpointerdown(e: PointerEvent) {
		if (disabled) return;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		fromPointer(e.clientX);
	}

	function onkeydown(e: KeyboardEvent) {
		if (disabled) return;
		const map: Record<string, number> = {
			ArrowRight: value + step,
			ArrowUp: value + step,
			ArrowLeft: value - step,
			ArrowDown: value - step,
			PageUp: value + step * 10,
			PageDown: value - step * 10,
			Home: min,
			End: max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		value = roundToStep(map[e.key]);
	}
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label || showValue}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValue}<span class="chip mono bg-sunken text-secondary">{formatValue(value)}</span>{/if}
		</div>
	{/if}
	{#if description}<span class="text-body-sm text-muted">{description}</span>{/if}
	<div
		bind:this={trackEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		id={sliderId}
		class="relative wfull h-sm"
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-valuetext={formatValue(value)}
		aria-label={label}
		aria-disabled={disabled || undefined}
		{onpointerdown}
		onpointermove={(e) => dragging && fromPointer(e.clientX)}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		{onkeydown}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
	>
		<SliderTrack {width} {height} values={[fraction]} {tone} focused={focused ? 0 : null} {disabled} />
	</div>
</div>
