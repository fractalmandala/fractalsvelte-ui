<!-- @component A button that fires `onconfirm` only after being held for `holdTime` ms. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import type { Variant, Size, Shape, Message } from '../types';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Milliseconds the pointer (or Space/Enter) must be held. */
		holdTime?: number;
		/** `danger` (a Message) paints it as a destructive action. */
		variant?: Variant | Extract<Message, 'danger'>;
		size?: Size;
		shape?: Shape;
		disabled?: boolean;
		confirmedLabel?: string;
		class?: string;
		onconfirm?: () => void;
		children?: Snippet;
	}

	let {
		holdTime = 1200,
		variant = 'danger',
		size = 'h-md',
		shape = 'modern',
		disabled = false,
		confirmedLabel = 'Confirmed',
		class: className = '',
		onconfirm,
		children,
		...restProps
	}: Props = $props();

	let progress = $state(0);
	let holding = $state(false);
	let confirmed = $state(false);
	let frame: number | null = null;

	// Progress ring geometry (viewBox 24, r 9)
	const CIRC = 2 * Math.PI * 9;

	function startHold() {
		if (disabled || confirmed || holding) return;
		holding = true;
		const start = performance.now();
		const tick = (now: number) => {
			progress = Math.min(1, (now - start) / holdTime);
			if (progress >= 1) {
				frame = null;
				holding = false;
				confirmed = true;
				onconfirm?.();
				setTimeout(() => {
					confirmed = false;
					progress = 0;
				}, 1500);
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	function stopHold() {
		if (frame !== null) cancelAnimationFrame(frame);
		frame = null;
		if (!confirmed) {
			holding = false;
			progress = 0;
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
			e.preventDefault();
			startHold();
		}
	}

	function onkeyup(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') stopHold();
	}
</script>

<button
	type="button"
	class="row ycenter gap-xs el-shape el-size el-variant {variant} {size} {shape} {className}"
	{disabled}
	aria-live="polite"
	onpointerdown={startHold}
	onpointerup={stopHold}
	onpointerleave={stopHold}
	onpointercancel={stopHold}
	{onkeydown}
	{onkeyup}
	{...restProps}
>
	{#if confirmed}
		<Icon icon={luCheck} />
		<span>{confirmedLabel}</span>
	{:else}
		<!-- Hold progress is drawn as SVG stroke geometry, not a CSS width. -->
		<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true" class="shrink-0">
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.3" />
			<circle
				cx="12"
				cy="12"
				r="9"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-dasharray={CIRC}
				stroke-dashoffset={CIRC * (1 - progress)}
				transform="rotate(-90 12 12)"
			/>
		</svg>
		{#if holding}
			<span class="tabular-nums">Holding… {String(Math.round(progress * 100)).padStart(3, '\u2007')}%</span>
		{:else if children}
			{@render children()}
		{:else}
			<span>Hold to confirm</span>
		{/if}
	{/if}
</button>
