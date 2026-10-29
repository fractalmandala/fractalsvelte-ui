<!-- @component A two-thumb slider for choosing a min and max value. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText, Size } from '../types';
	import SliderTrack from './SliderTrack.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		minVal?: number;
		maxVal?: number;
		min?: number;
		max?: number;
		step?: number;
		minDistance?: number;
		label?: string;
		description?: string;
		showValues?: boolean;
		formatValue?: (val: number) => string;
		tone?: MessageText;
		/** Thumb diameter / track thickness */
		size?: Size;
		direction?: 'horizontal' | 'vertical';
		disabled?: boolean;
		class?: string;
	}

	let {
		minVal = $bindable(20),
		maxVal = $bindable(80),
		min = 0,
		max = 100,
		step = 1,
		minDistance = 0,
		label,
		description,
		showValues = false,
		formatValue = (v: number) => String(v),
		tone,
		size = 'h-sm',
		direction = 'horizontal',
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const THUMBS = [0, 1] as const;
	const uid = $props.id();
	let width = $state(0);
	let height = $state(0);
	let trackEl: HTMLDivElement | null = $state(null);
	let active: 0 | 1 | null = null;
	let focused = $state<0 | 1 | null>(null);
	let thumbEls: HTMLElement[] = $state([]);

	const toFraction = (v: number) => (max <= min ? 0 : (Math.max(min, Math.min(max, v)) - min) / (max - min));

	function roundToStep(val: number): number {
		const raw = min + Math.round((val - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
	}

	function setThumb(which: 0 | 1, raw: number) {
		const v = roundToStep(raw);
		if (which === 0) minVal = Math.min(v, maxVal - minDistance);
		else maxVal = Math.max(v, minVal + minDistance);
	}

	function valueAt(e: PointerEvent) {
		const rect = trackEl!.getBoundingClientRect();
		const vert = direction === 'vertical';
		const r = (vert ? rect.width : rect.height) / 2;
		const len = vert ? rect.height : rect.width;
		const pos = vert ? rect.bottom - e.clientY : e.clientX - rect.left;
		const ratio = Math.max(0, Math.min(1, (pos - r) / Math.max(1, len - r * 2)));
		return min + ratio * (max - min);
	}

	function onpointerdown(e: PointerEvent) {
		if (disabled || !trackEl) return;
		const raw = valueAt(e);
		active = Math.abs(raw - minVal) <= Math.abs(raw - maxVal) ? 0 : 1;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setThumb(active, raw);
		thumbEls[active]?.focus();
	}

	function onpointermove(e: PointerEvent) {
		if (active === null || !trackEl) return;
		setThumb(active, valueAt(e));
	}

	function keyFor(which: 0 | 1, e: KeyboardEvent) {
		if (disabled) return;
		const cur = which === 0 ? minVal : maxVal;
		const map: Record<string, number> = {
			ArrowRight: cur + step,
			ArrowUp: cur + step,
			ArrowLeft: cur - step,
			ArrowDown: cur - step,
			PageUp: cur + step * 10,
			PageDown: cur - step * 10,
			Home: which === 0 ? min : minVal + minDistance,
			End: which === 0 ? maxVal - minDistance : max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		setThumb(which, map[e.key]);
	}
</script>

<div class="box gap-xs {direction === 'vertical' ? 'xcenter' : ''} {className}" style:min-width={direction === 'vertical' ? undefined : '14em'} {...restProps}>
	{#if label || showValues}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<span id="{uid}-label" class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValues}
				<span class="chip tabular-nums bg-sunken text-secondary">{formatValue(minVal)} – {formatValue(maxVal)}</span>
			{/if}
		</div>
	{/if}
	{#if description}<span class="text-body-sm text-muted">{description}</span>{/if}
	<div
		bind:this={trackEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		class="relative {direction === 'vertical' ? '' : 'wfull'}"
		style:height={direction === 'vertical' ? '10em' : `var(--height-${size.slice(2)})`}
		style:width={direction === 'vertical' ? `var(--height-${size.slice(2)})` : undefined}
		role="group"
		aria-labelledby={label ? `${uid}-label` : undefined}
		{onpointerdown}
		{onpointermove}
		onpointerup={() => (active = null)}
		onpointercancel={() => (active = null)}
	>
		<SliderTrack {width} {height} values={[toFraction(minVal), toFraction(maxVal)]} {tone} {direction} {focused} {disabled} />
		<!-- Two zero-size focus targets carry the slider semantics for each thumb. -->
		{#each THUMBS as which (which)}
			<span
				bind:this={thumbEls[which]}
				class="absolute"
				role="slider"
				tabindex={disabled ? -1 : 0}
				aria-label={which === 0 ? 'Minimum' : 'Maximum'}
				aria-valuemin={which === 0 ? min : minVal + minDistance}
				aria-valuemax={which === 0 ? maxVal - minDistance : max}
				aria-valuenow={which === 0 ? minVal : maxVal}
				aria-valuetext={formatValue(which === 0 ? minVal : maxVal)}
				aria-disabled={disabled || undefined}
				onkeydown={(e) => keyFor(which, e)}
				onfocus={() => (focused = which)}
				onblur={() => (focused = null)}
			></span>
		{/each}
	</div>
</div>
