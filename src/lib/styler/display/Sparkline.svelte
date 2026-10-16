<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'fill'> {
		data: number[];
		/** Drawing size in px (the SVG's own coordinate box). */
		width?: number;
		height?: number;
		strokeWidth?: number;
		tone?: FsTone;
		fill?: boolean;
		class?: string;
	}

	let {
		data = [10, 25, 18, 30, 45, 38, 55, 62],
		width = 120,
		height = 36,
		strokeWidth = 2,
		tone = 'theme',
		fill = true,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();

	const paths = $derived.by(() => {
		if (data.length < 2) return { line: '', area: '' };
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const pad = strokeWidth;
		const points = data.map((val, idx) => {
			const x = (idx / (data.length - 1)) * (width - pad * 2) + pad;
			const y = height - pad - ((val - min) / range) * (height - pad * 2);
			return `${x},${y}`;
		});
		const line = `M ${points.join(' L ')}`;
		return { line, area: `${line} L ${width - pad},${height} L ${pad},${height} Z` };
	});
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	fill="none"
	class="shrink-0 {TONE_TEXT[tone]} {className}"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	{#if fill && paths.area}
		<defs>
			<linearGradient id="{uid}-grad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="currentColor" stop-opacity="0.3" />
				<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
			</linearGradient>
		</defs>
		<path d={paths.area} fill="url(#{uid}-grad)" />
	{/if}
	{#if paths.line}
		<path
			d={paths.line}
			stroke="currentColor"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}
</svg>
