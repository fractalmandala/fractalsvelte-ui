<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { TEXT_SIZE, type FsTextSize } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value: number;
		prefix?: string;
		suffix?: string;
		decimals?: number;
		size?: FsTextSize;
		/** Count-up duration in ms; 0 jumps straight to the value. */
		duration?: number;
		class?: string;
	}

	let {
		value = 0,
		prefix = '',
		suffix = '',
		decimals = 0,
		size = '3xl',
		duration = 600,
		class: className = '',
		...restProps
	}: Props = $props();

	// The motion is the number itself counting, not a CSS transform: each frame
	// writes text content, never style.
	let shown = $state(0);
	let from = 0;

	$effect(() => {
		const target = value;
		const start = performance.now();
		const origin = from;
		if (duration <= 0 || typeof requestAnimationFrame === 'undefined') {
			shown = from = target;
			return;
		}
		let raf = requestAnimationFrame(function step(now) {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			shown = from = origin + (target - origin) * eased;
			if (t < 1) raf = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(raf);
	});

	const text = $derived(decimals > 0 ? shown.toFixed(decimals) : Math.round(shown).toString());
</script>

<div
	class="row ybot gap-xs mono weight-600 lh11 {TEXT_SIZE[size]} {className}"
	role="status"
	aria-live="polite"
	aria-label="{prefix}{value}{suffix}"
	{...restProps}
>
	{#if prefix}<span class="text-muted">{prefix}</span>{/if}
	<span aria-hidden="true">{text}</span>
	{#if suffix}<span class="text-muted">{suffix}</span>{/if}
</div>
