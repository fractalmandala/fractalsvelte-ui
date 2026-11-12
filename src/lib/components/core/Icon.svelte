<!-- @component An SVG icon from the keyline packs, sized in pixels or by a size token. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { IconNode } from '$lib/icons/types.js';
	import { getIconFit } from './icon-context.js';

	interface Props extends SVGAttributes<SVGSVGElement> {
		/** An icon from `$lib/icons/keylinestroke` (kl*) or `$lib/icons/keylinefill` (klf*). */
		icon: IconNode;
		/** Pixels, a CSS length, or a size token. Defaults to 18; inside an IconButton with `fit` it defaults to the button's size. */
		size?: number | string;
		/** Accessible name. Without it the icon is decorative and hidden from screen readers. */
		label?: string;
		/** Overrides the icon's stroke width (the stroke pack draws at 2). */
		strokeWidth?: number;
		/** Crops to the drawn shape, dropping the margin the icon carries on its 24-unit grid. Inside an IconButton with `fit` this is on by default. */
		crop?: boolean;
		class?: string;
	}

	let { icon, size, label, strokeWidth, crop, class: className = '', ...rest }: Props = $props();

	// Inside an IconButton with `fit`, the icon crops to its shape and, unless it has
	// a size of its own, fills the button.
	const fit = getIconFit();
	const inFit = fit?.fit ?? false;
	const cropped = $derived(crop ?? inFit);
	// With no size of its own the icon takes the button's size class, square by its frame class.
	const fillClass = $derived(inFit && size === undefined ? `${fit?.size ?? 'h-md'} frame-1-1` : '');

	const sizePx = $derived.by(() => {
		if (fillClass) return undefined;
		if (typeof size === 'number') return size;
		if (typeof size === 'string') {
			const map: Record<string, number> = {
				'h-xs': 14,
				'h-sm': 16,
				'h-md': 18,
				'h-bs': 20,
				'h-lg': 24,
				'h-xl': 28
			};
			if (map[size]) return map[size];
			const parsed = parseFloat(size);
			if (!isNaN(parsed) && String(parsed) === size) return parsed;
			return size;
		}
		return 18;
	});

	// Rendered in markup, not onMount: icons are in the server HTML, so nothing pops in after hydration.
	const nodes = $derived(
		Array.isArray(icon)
			? icon.map(([tag, attrs]) => ({
					tag,
					attrs: Object.fromEntries(
						Object.entries(attrs ?? {})
							.filter(([k]) => k !== 'key')
							.map(([k, v]) => [k, k === 'stroke-width' && strokeWidth ? strokeWidth : v])
					)
				}))
			: []
	);

	// Cropping measures the drawn shape once it is in the page and tightens the
	// viewBox to it, kept square and padded by half the stroke so line caps stay whole.
	let paintEl = $state<SVGGElement | null>(null);
	let box = $state<string | null>(null);

	$effect(() => {
		void nodes;
		if (!cropped || !paintEl) {
			box = null;
			return;
		}
		const b = paintEl.getBBox();
		if (!b.width && !b.height) return;
		const paint = nodes[0]?.attrs ?? {};
		const stroked = paint.stroke && paint.stroke !== 'none';
		const half = stroked ? Number(paint['stroke-width'] ?? 0) / 2 : 0;
		const side = Math.max(b.width, b.height) + half * 2;
		const x = b.x + b.width / 2 - side / 2;
		const y = b.y + b.height / 2 - side / 2;
		const r = (n: number) => Math.round(n * 100) / 100;
		box = `${r(x)} ${r(y)} ${r(side)} ${r(side)}`;
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={box ?? '0 0 24 24'}
	width={sizePx}
	height={sizePx}
	fill="none"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	focusable="false"
	{...rest}
	class="block shrink-0 {fillClass} {className}"
>
	<!-- The first node is the wrapping g that carries the paint; the rest draw inside it. -->
	{#if nodes[0]?.tag === 'g'}
		<g bind:this={paintEl} {...nodes[0].attrs}>
			{#each nodes.slice(1) as { tag, attrs }, i (i)}
				<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" {...attrs} />
			{/each}
		</g>
	{:else}
		{#each nodes as { tag, attrs }, i (i)}
			<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" {...attrs} />
		{/each}
	{/if}
</svg>

