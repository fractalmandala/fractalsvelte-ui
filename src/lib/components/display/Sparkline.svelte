<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<SVGElement> {
		data: number[];
		width?: number;
		height?: number;
		strokeWidth?: number;
		color?: string;
		fill?: boolean;
		class?: string;
	}

	let {
		data = [10, 25, 18, 30, 45, 38, 55, 62],
		width = 120,
		height = 36,
		strokeWidth = 2,
		color = 'var(--f-primary)',
		fill = true,
		class: className = '',
		...restProps
	}: Props = $props();

	const pathData = $derived.by(() => {
		if (data.length < 2) return { line: '', area: '' };

		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const padding = 2;

		const points = data.map((val, idx) => {
			const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
			const y = height - padding - ((val - min) / range) * (height - padding * 2);
			return `${x},${y}`;
		});

		const line = `M ${points.join(' L ')}`;
		const area = `${line} L ${width - padding},${height} L ${padding},${height} Z`;

		return { line, area };
	});
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	class="f-sparkline {className}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	<defs>
		<linearGradient id="f-spark-grad-{Math.abs(width + height)}" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.3" />
			<stop offset="100%" stop-color={color} stop-opacity="0.0" />
		</linearGradient>
	</defs>

	{#if fill && pathData.area}
		<path
			d={pathData.area}
			fill="url(#f-spark-grad-{Math.abs(width + height)})"
		/>
	{/if}

	{#if pathData.line}
		<path
			d={pathData.line}
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}
</svg>

<style>
	@layer fractalsvelte-ui.components {
		.f-sparkline {
			display: inline-block;
			vertical-align: middle;
			overflow: visible;
		}
	}
</style>
