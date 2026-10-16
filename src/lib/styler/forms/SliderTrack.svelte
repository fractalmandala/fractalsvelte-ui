<script lang="ts">
	// Shared SVG drawing for Slider and RangeSlider. Values arrive as 0–1
	// fractions; the track lives in the SVG's own pixel box, which the parent
	// measures with bind:clientWidth, so nothing writes a CSS position.
	import type { FsTone } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props {
		width: number;
		height: number;
		/** One fraction draws a fill from 0; two draw the span between them. */
		values: number[];
		tone?: FsTone;
		focused?: number | null;
		disabled?: boolean;
	}

	let { width, height, values, tone = 'theme', focused = null, disabled = false }: Props = $props();

	const r = $derived(Math.max(4, height / 2 - 2));
	const trackH = $derived(Math.max(2, height / 5));
	const usable = $derived(Math.max(0, width - r * 2));
	const xs = $derived(values.map((v) => r + Math.max(0, Math.min(1, v)) * usable));
	const fillFrom = $derived(xs.length > 1 ? xs[0] : r);
	const fillTo = $derived(xs[xs.length - 1]);
</script>

{#if width > 0 && height > 0}
	<svg
		class="absolute full {disabled ? 'text-muted' : TONE_TEXT[tone]}"
		viewBox="0 0 {width} {height}"
		aria-hidden="true"
	>
		<rect x={r} y={(height - trackH) / 2} width={usable} height={trackH} rx={trackH / 2} class="text-muted" fill="currentColor" opacity="0.35" />
		<rect
			x={fillFrom}
			y={(height - trackH) / 2}
			width={Math.max(0, fillTo - fillFrom)}
			height={trackH}
			rx={trackH / 2}
			fill="currentColor"
		/>
		{#each xs as x, i (i)}
			{#if focused === i}
				<circle cx={x} cy={height / 2} r={r + 2} fill="currentColor" opacity="0.25" />
			{/if}
			<circle cx={x} cy={height / 2} r={r - 1} class="text-white" fill="currentColor" />
			<circle cx={x} cy={height / 2} r={r - 1} fill="none" stroke="currentColor" stroke-width="2" />
		{/each}
	</svg>
{/if}
