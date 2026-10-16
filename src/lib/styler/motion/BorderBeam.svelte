<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props extends SVGAttributes<SVGSVGElement> {
		/** Beam length as a share of the perimeter (0–1) */
		size?: number;
		/** Seconds per lap */
		duration?: number;
		tone?: FsTone;
		borderWidth?: number;
		/** Corner radius in px, to match the host's rounding */
		radius?: number;
		class?: string;
	}

	let {
		size = 0.2,
		duration = 6,
		tone = 'theme',
		borderWidth = 1.5,
		radius = 8,
		class: className = '',
		...restProps
	}: Props = $props();

	const beam = $derived(Math.max(1, Math.min(99, size * 100)));
	let w = $state(0);
	let h = $state(0);
	let svgEl = $state<SVGSVGElement | null>(null);

	$effect(() => {
		if (!svgEl) return;
		const ro = new ResizeObserver(([entry]) => {
			w = entry.contentRect.width;
			h = entry.contentRect.height;
		});
		ro.observe(svgEl);
		return () => ro.disconnect();
	});
</script>

<!-- Overlay for a padding-free .relative host: a dash of the border's own
     outline travels round it (stroke-dashoffset, animated by SMIL). -->
<svg bind:this={svgEl} class="absolute full {TONE_TEXT[tone]} {className}" pointer-events="none" aria-hidden="true" {...restProps}>
	{#if w > 0 && h > 0}
		<rect
			x={borderWidth / 2}
			y={borderWidth / 2}
			width={w - borderWidth}
			height={h - borderWidth}
			rx={radius}
			fill="none"
			stroke="currentColor"
			stroke-width={borderWidth}
			stroke-linecap="round"
			pathLength="100"
			stroke-dasharray="{beam} {100 - beam}"
		>
			<animate attributeName="stroke-dashoffset" from="100" to="0" dur="{duration}s" repeatCount="indefinite" />
		</rect>
	{/if}
</svg>
