<!-- @component A card lit by a soft radial light that follows the pointer, on the surface and along the border. -->

<script lang="ts">
	import type { Gap, Pad, Shape, Surface } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { pointer, vars } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
		radius?: string;
		intensity?: number;
		color?: 'theme' | 'neutral';
		surface?: Surface;
		shape?: Shape;
		pad?: Pad;
		gap?: Gap;
		children?: Snippet;
	}

	let {
		radius = '40%',
		intensity = 0.35,
		color = 'theme',
		surface = 'elevated',
		shape = 'curved',
		pad = 'pad-lg',
		gap = 'gap-sm',
		class: className,
		children,
		...rest
	}: Props = $props();

	const colorClass = { theme: 'light-theme', neutral: 'light-neutral' };
</script>

<div
	class={['light', 'box', surface, shape, pad, gap, colorClass[color], className]}
	{@attach pointer()}
	{@attach vars({ 'light-size': radius, 'light-intensity': intensity })}
	{...rest}
>
	{@render children?.()}
</div>
