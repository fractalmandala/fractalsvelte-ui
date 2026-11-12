<!-- @component A single-value or range slider with pointer drag, full keyboard control and a springing thumb. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { textClass, type Orientation, type Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The value, or a `[low, high]` pair for a range. Two-way bindable. */
		value?: number | [number, number];
		/** The smallest value. */
		min?: number;
		/** The largest value. */
		max?: number;
		/** The increment values snap to, for pointer and keyboard alike. */
		step?: number;
		/** Lays the track out left to right (`horizontal`) or bottom to top (`vertical`). */
		orientation?: Orientation;
		/** Draws ticks: `true` for one per step, or a list of positions with optional labels. */
		marks?: boolean | { value: number; label?: string }[];
		/** Shows the current value in a bubble above the thumb on hover, focus and drag. */
		showValue?: boolean;
		/** Formats the value for the bubble and for assistive technology. */
		format?: (value: number) => string;
		/** The track thickness, thumb size and text scale. */
		size?: Size;
		/** Accessible name of the slider; a range appends "minimum" and "maximum". */
		label?: string;
		/** Blocks pointer and keyboard input. */
		disabled?: boolean;
		/** The field name; a hidden input per thumb submits the value with a form. */
		name?: string;
		/** Called whenever the value changes, with the new value. */
		onValueChange?: (value: number | [number, number]) => void;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		orientation = 'horizontal',
		marks = false,
		showValue = false,
		format,
		size = 'md',
		label,
		disabled = false,
		name,
		onValueChange,
		class: klass,
		...rest
	}: Props = $props();

	const vertical = $derived(orientation === 'vertical');
	const range = $derived(Array.isArray(value));
	const vals = $derived(Array.isArray(value) ? [value[0], value[1]] : [value]);
	const decimals = $derived((String(step).split('.')[1] ?? '').length);
	const show = (v: number): string => (format ? format(v) : String(v));
	const frac = (v: number): number => (max === min ? 0 : Math.min(1, Math.max(0, (v - min) / (max - min))));
	const big = $derived(Math.max(step, step * Math.round((max - min) / step / 10)));
	const ticks = $derived.by((): { value: number; label?: string }[] => {
		if (!marks) return [];
		if (marks !== true) return marks;
		const out: { value: number; label?: string }[] = [];
		for (let v = min; v <= max + step / 2; v += step) out.push({ value: Number(v.toFixed(decimals)) });
		return out;
	});
	const labelled = $derived(ticks.some((t) => t.label));

	let track = $state<HTMLElement>();
	const thumbs: (HTMLElement | undefined)[] = [];
	let pressed = $state(false);
	let dragging = $state(false);
	let active = $state(0);

	function snap(raw: number): number {
		const n = Math.round((raw - min) / step) * step + min;
		return Math.min(max, Math.max(min, Number(n.toFixed(decimals))));
	}

	function commit(i: number, raw: number): void {
		const v = snap(raw);
		if (!Array.isArray(value)) {
			if (v === value) return;
			value = v;
			onValueChange?.(v);
			return;
		}
		const [a, b] = value;
		const next = i === 0 ? Math.min(v, b) : Math.max(v, a);
		if (next === value[i]) return;
		const pair: [number, number] = i === 0 ? [next, b] : [a, next];
		value = pair;
		onValueChange?.(pair);
	}

	function fromEvent(e: PointerEvent): number {
		const r = track?.getBoundingClientRect();
		if (!r) return min;
		const f = vertical ? 1 - (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
		return min + Math.min(1, Math.max(0, f)) * (max - min);
	}

	function down(e: PointerEvent): void {
		if (disabled || e.button !== 0) return;
		const raw = fromEvent(e);
		let i = 0;
		if (vals.length === 2) {
			const [a, b] = vals;
			i = a === b ? (raw < a ? 0 : 1) : Math.abs(raw - a) <= Math.abs(raw - b) ? 0 : 1;
		}
		active = i;
		pressed = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.preventDefault();
		commit(i, raw);
		thumbs[i]?.focus({ preventScroll: true });
	}

	function move(e: PointerEvent): void {
		if (!pressed) return;
		dragging = true;
		commit(active, fromEvent(e));
	}

	function up(e: PointerEvent): void {
		if (!pressed) return;
		pressed = false;
		dragging = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
	}

	function key(e: KeyboardEvent, i: number): void {
		if (disabled) return;
		const now = vals[i];
		let next: number;
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				next = now + step;
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				next = now - step;
				break;
			case 'PageUp':
				next = now + big;
				break;
			case 'PageDown':
				next = now - big;
				break;
			case 'Home':
				next = min;
				break;
			case 'End':
				next = max;
				break;
			default:
				return;
		}
		e.preventDefault();
		commit(i, next);
	}

	const thumbName = (i: number): string | undefined =>
		label ? (vals.length === 2 ? `${label} ${i === 0 ? 'minimum' : 'maximum'}` : label) : undefined;
</script>

<div
	class={[
		'relative select-none touch-none px-md py-md',
		vertical ? 'inline-flex' : labelled ? 'wfull pb-xl' : 'wfull',
		vertical && labelled && 'pr-2xl',
		textClass[size],
		disabled && 'disabled',
		klass
	]}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={up}
	{...rest}
>
	<div bind:this={track} class={['track slim', vertical ? 'track-v vertical' : 'wfull', disabled ? 'disabled' : 'pointer']}>
		<div
			class={['fill', !dragging && 'glide', 'spring-bouncy']}
			{@attach vars({ value: frac(vals[vals.length - 1]), from: range ? frac(vals[0]) : 0 })}
		></div>
		{#each ticks as tick (tick.value)}
			<span class="tick" {@attach vars({ value: frac(tick.value) })}>
				{#if tick.label}<span class="tick-label text-xs text-muted tabular-nums">{tick.label}</span>{/if}
			</span>
		{/each}
		{#each vals as v, i (i)}
			<div
				bind:this={thumbs[i]}
				role="slider"
				tabindex={disabled ? -1 : 0}
				aria-label={thumbName(i)}
				aria-valuemin={range ? (i === 0 ? min : vals[0]) : min}
				aria-valuemax={range ? (i === 0 ? vals[1] : max) : max}
				aria-valuenow={v}
				aria-valuetext={show(v)}
				aria-orientation={orientation}
				aria-disabled={disabled || undefined}
				data-active={pressed && active === i ? '' : undefined}
				class={['thumb stout focus-ring', !dragging && 'glide', 'spring-bouncy', disabled ? 'disabled' : 'pointer']}
				{@attach vars({ value: frac(v) })}
				onkeydown={(e) => key(e, i)}
			>
				{#if showValue}
					<span class="bubble bg-overlay border rim modern text-xs tabular-nums text-primary" aria-hidden="true">{show(v)}</span>
				{/if}
			</div>
		{/each}
	</div>
	{#if name}
		{#each vals as v, i (i)}
			<input type="hidden" {name} value={v} {disabled} />
		{/each}
	{/if}
</div>
