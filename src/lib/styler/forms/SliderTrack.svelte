<script lang="ts">
	// Shared SVG drawing for Slider and RangeSlider. Values arrive as 0–1
	// fractions; the track lives in the SVG's own pixel box, which the parent
	// measures with bind:clientWidth, so nothing writes a CSS position.
	// Vertical tracks draw the same geometry rotated, with 0 at the bottom.
	import type { MessageText } from '../types';

	interface Props {
		width: number;
		height: number;
		/** One fraction draws a fill from 0; two draw the span between them. */
		values: number[];
		tone?: MessageText;
		direction?: 'horizontal' | 'vertical';
		focused?: number | null;
		disabled?: boolean;
	}

	let { width, height, values, tone, direction = 'horizontal', focused = null, disabled = false }: Props = $props();

	const v = $derived(direction === 'vertical');
	const len = $derived(v ? height : width);
	const thick = $derived(v ? width : height);
	const r = $derived(Math.max(4, thick / 2 - 2));
	const trackH = $derived(Math.max(2, thick / 5));
	const usable = $derived(Math.max(0, len - r * 2));
	const xs = $derived(values.map((val) => r + Math.max(0, Math.min(1, val)) * usable));
	const fillFrom = $derived(xs.length > 1 ? xs[0] : r);
	const fillTo = $derived(xs[xs.length - 1]);
</script>

{#if width > 0 && height > 0}
	<svg
		class="absolute full {disabled ? 'text-muted' : (tone ?? 'text-theme')}"
		viewBox="0 0 {width} {height}"
		aria-hidden="true"
	>
		<g transform={v ? `translate(0 ${height}) rotate(-90)` : undefined}>
			<rect x={r} y={(thick - trackH) / 2} width={usable} height={trackH} rx={trackH / 2} class="text-muted" fill="currentColor" opacity="0.35" />
			<rect
				x={fillFrom}
				y={(thick - trackH) / 2}
				width={Math.max(0, fillTo - fillFrom)}
				height={trackH}
				rx={trackH / 2}
				fill="currentColor"
			/>
			{#each xs as x, i (i)}
				{#if focused === i}
					<circle cx={x} cy={thick / 2} r={r + 2} fill="currentColor" opacity="0.25" />
				{/if}
				<circle cx={x} cy={thick / 2} r={r - 1} class="text-white" fill="currentColor" />
				<circle cx={x} cy={thick / 2} r={r - 1} fill="none" stroke="currentColor" stroke-width="2" />
			{/each}
		</g>
	</svg>
{/if}
