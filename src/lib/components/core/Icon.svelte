<!-- @component An SVG icon from the keyline packs, sized in pixels or by a size token. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { IconNode } from '$lib/icons/types.js';

	interface Props extends SVGAttributes<SVGSVGElement> {
		/** An icon from `$lib/icons/keylinestroke` (kl*) or `$lib/icons/keylinefill` (klf*). */
		icon: IconNode;
		size?: number | string;
		/** Accessible name. Without it the icon is decorative and hidden from screen readers. */
		label?: string;
		/** Overrides the icon's stroke width (the stroke pack draws at 2). */
		strokeWidth?: number;
		class?: string;
	}

	let { icon, size = 18, label, strokeWidth, class: className = '', ...rest }: Props = $props();

	const sizePx = $derived.by(() => {
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
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width={sizePx}
	height={sizePx}
	fill="none"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	focusable="false"
	{...rest}
	class="block shrink-0 {className}"
>
	<!-- The first node is the wrapping g that carries the paint; the rest draw inside it. -->
	{#if nodes[0]?.tag === 'g'}
		<g {...nodes[0].attrs}>
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

