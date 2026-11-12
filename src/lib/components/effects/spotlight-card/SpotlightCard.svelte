<!-- @component A card lit by a soft radial light that follows the pointer, on the surface and along the border. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { pointer, vars } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
		/** Diameter of the pointer-following light, as a CSS length. */
		size?: string;
		/** Strength of the light, from 0 (none) to 1 (strong). */
		intensity?: number;
		/** Colour of the light: the theme accent, or a neutral white highlight. */
		color?: 'theme' | 'neutral';
		/** The card's content. */
		children?: Snippet;
	}

	let {
		size = '40%',
		intensity = 0.35,
		color = 'theme',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const colorClass = { theme: 'light-theme', neutral: 'light-neutral' };
</script>

<div
	class={['light', 'card', 'box', 'bg-surface', 'border-subtle', 'curved', 'pad-lg', 'gap-sm', colorClass[color], klass]}
	{@attach pointer()}
	{@attach vars({ 'light-size': size, 'light-intensity': intensity })}
	{...rest}
>
	{@render children?.()}
</div>
