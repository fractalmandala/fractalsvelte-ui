<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		unlocked?: boolean;
		label?: string;
		successLabel?: string;
		tone?: FsTone;
		disabled?: boolean;
		class?: string;
		onunlock?: () => void;
		onreset?: () => void;
		children?: Snippet;
	}

	let {
		unlocked = $bindable(false),
		label = 'Slide to confirm',
		successLabel = 'Confirmed',
		tone = 'theme',
		disabled = false,
		class: className = '',
		onunlock,
		onreset,
		children,
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
	class="relative row xcenter ycenter h-lg radius-full bg-sunken border {TONE_TEXT[tone]} {className}"
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
		<svg class="absolute full" viewBox="0 0 {width} {height}" aria-hidden="true">
			<rect
				x={pad}
				y={pad}
				width={x + knob}
				height={knob}
				rx={knob / 2}
				fill="currentColor"
				opacity="0.25"
			/>
			<g transform="translate({pad + x} {pad})">
				<circle cx={knob / 2} cy={knob / 2} r={knob / 2} fill="currentColor" />
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
	<span class="relative text-sm weight-500 {unlocked ? 'text-primary' : 'text-muted'}">
		{unlocked ? successLabel : label}
	</span>
	{@render children?.()}
</div>
