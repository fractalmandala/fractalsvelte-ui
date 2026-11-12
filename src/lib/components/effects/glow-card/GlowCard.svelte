<!-- @component A card with a rotating conic-gradient border and a soft outer glow. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Seconds for one full rotation of the gradient border. */
		speed?: number;
		/** Colour of the rotating border: the theme accent, a hue-swept rainbow, or a quieter wash. */
		variant?: 'theme' | 'rainbow' | 'subtle';
		/** When true, the border always rotates; when false, it rotates only on hover or focus within. */
		active?: boolean;
		/** The card's content. */
		children?: Snippet;
	}

	let {
		speed = 8,
		variant = 'theme',
		active = false,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const variantClass = { theme: 'ring-theme', rainbow: 'ring-rainbow', subtle: 'ring-subtle' };
</script>

<div
	class={[
		'ring-grad',
		'halo',
		'spin',
		!active && 'spin-hover',
		'card',
		'box',
		'bg-surface',
		'border-subtle',
		'curved',
		'pad-lg',
		'gap-sm',
		variantClass[variant],
		klass
	]}
	{@attach vars({ spin: speed })}
	{...rest}
>
	{@render children?.()}
</div>
