<!-- @component A slide-to-unlock track that fires `onunlock` when the handle is dragged to the end. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText, Size, Shape, Shadow } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		unlocked?: boolean;
		label?: string;
		successLabel?: string;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		/** Colour of the fill and handle; defaults to the current text colour. */
		messageText?: MessageText;
		disabled?: boolean;
		class?: string;
		onunlock?: () => void;
		onreset?: () => void;
	}

	let {
		unlocked = $bindable(false),
		label = 'Slide to confirm',
		successLabel = 'Confirmed',
		size = 'h-lg',
		shape = 'round',
		shadow = 'shad-none',
		messageText,
		disabled = false,
		class: className = '',
		onunlock,
		onreset,
		...restProps
	}: Props = $props();

	// Measured, never written: the track geometry lives in the SVG's own coordinates.
	let width = $state(0);
	let height = $state(0);
	let offset = $state(0);
	let dragging = $state(false);
	let grabX = 0;

	const pad = 3;
	const knob = $derived(Math.max(0, height - pad * 2));
	const maxDrag = $derived(Math.max(0, width - knob - pad * 2));
	const x = $derived(unlocked ? maxDrag : offset);
	// Track radius per shape (as in .el-shape), less the inset, so the thumb nests concentrically.
	const RADIUS: Record<Shape, number> = { square: 0, min: 4, modern: 8, curved: 16, round: 9999 };
	// Small radii keep their full value, or min would read as square.
	const rx = $derived(Math.min(knob / 2, RADIUS[shape] <= pad * 2 ? RADIUS[shape] : RADIUS[shape] - pad));

	function unlock() {
		offset = maxDrag;
		unlocked = true;
		onunlock?.();
	}

	function reset() {
		offset = 0;
		unlocked = false;
		onreset?.();
	}

	function onpointerdown(e: PointerEvent) {
		if (disabled) return;
		if (unlocked) return reset();
		dragging = true;
		grabX = e.clientX - offset;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (!dragging) return;
		offset = Math.min(maxDrag, Math.max(0, e.clientX - grabX));
	}

	function onpointerup() {
		if (!dragging) return;
		dragging = false;
		if (offset >= maxDrag * 0.85) unlock();
		else offset = 0;
	}

	function onkeydown(e: KeyboardEvent) {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'End') {
			e.preventDefault();
			if (!unlocked) unlock();
		} else if ((e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'Escape') && unlocked) {
			e.preventDefault();
			reset();
		}
	}
</script>

<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="slide-unlock relative row xcenter ycenter ta-c el-size el-shape {size} {shape} {shadow} bg-sunken border {messageText} {className}"
	style:padding-inline="{height}px {pad}px"
	role="slider"
	tabindex={disabled ? -1 : 0}
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={unlocked ? 100 : Math.round((offset / (maxDrag || 1)) * 100)}
	aria-valuetext={unlocked ? successLabel : label}
	aria-disabled={disabled || undefined}
	{onpointerdown}
	{onpointermove}
	{onpointerup}
	onpointercancel={onpointerup}
	{onkeydown}
	{...restProps}
>
	{#if width > 0 && height > 0}
		<!-- Absolute with no offsets sits at its static position: the full box. -->
		<svg class="absolute full" style="left: 0" viewBox="0 0 {width} {height}" aria-hidden="true">
			<rect
				x={pad}
				y={pad}
				width={x + knob}
				height={knob}
				{rx}
				fill="currentColor"
				opacity="0.25"
			/>
			<g transform="translate({pad + x} {pad})">
				<rect width={knob} height={knob} {rx} fill="currentColor" />
				<g
					transform="translate({knob / 2 - 6} {knob / 2 - 6}) scale(0.5)"
					class="text-white"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					{#if unlocked}
						<polyline points="20 6 9 17 4 12" />
					{:else}
						<polyline points="9 6 15 12 9 18" />
					{/if}
				</g>
			</g>
		</svg>
	{/if}
	<span class="ta-c text-sm weight-500 {unlocked ? 'text-primary' : 'text-muted'}">
		{unlocked ? successLabel : label}
	</span>
</div>
