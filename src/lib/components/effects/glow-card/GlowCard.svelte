<!-- @component A card with a rotating conic-gradient border and a soft outer glow. -->

<script lang="ts">
	import type { Gap, Pad, Shape, Surface } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		speed?: number;
		ring?: 'theme' | 'rainbow' | 'subtle';
		active?: boolean;
		surface?: Surface;
		shape?: Shape;
		pad?: Pad;
		gap?: Gap;
		children?: Snippet;
	}

	let {
		speed = 8,
		ring = 'theme',
		active = false,
		surface = 'elevated',
		shape = 'curved',
		pad = 'pad-lg',
		gap = 'gap-sm',
		class: className,
		children,
		...rest
	}: Props = $props();

	const ringClass = { theme: 'ring-theme', rainbow: 'ring-rainbow', subtle: 'ring-subtle' };
</script>

<div
	class={[
		'ring-grad',
		'halo',
		'spin',
		!active && 'spin-hover',
		'box',
		surface,
		shape,
		pad,
		gap,
		ringClass[ring],
		className
	]}
	{@attach vars({ spin: speed })}
	{...rest}
>
	{@render children?.()}
</div>
