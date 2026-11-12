<!-- @component A film-grain overlay drawn from layered repeating gradients, without images or SVG. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Strength of the grain, from 0 (none) to 1 (strong). */
		opacity?: number;
		/** How the grain mixes with what is behind it. */
		blend?: 'overlay' | 'soft-light' | 'multiply';
	}

	let {
		opacity = 0.18,
		blend = 'overlay',
		class: klass,
		...rest
	}: Props = $props();
</script>

<div
	class={['grain', 'pointer-none', klass]}
	aria-hidden="true"
	{@attach vars({ 'grain-opacity': opacity, 'grain-blend': blend })}
	{...rest}
></div>
