<!-- @component A film-grain overlay drawn from layered repeating gradients, without images or SVG. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		opacity?: number;
		blend?: 'overlay' | 'soft-light' | 'multiply';
	}

	let {
		opacity = 0.18,
		blend = 'overlay',
		class: className,
		...rest
	}: Props = $props();
</script>

<div
	class={['grain', 'pointer-none', className]}
	aria-hidden="true"
	{@attach vars({ 'grain-opacity': opacity, 'grain-blend': blend })}
	{...rest}
></div>
