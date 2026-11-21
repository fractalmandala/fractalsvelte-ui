<!-- @component A single beam of light that travels around the border of its parent. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		duration?: number;
		length?: string;
		delay?: number;
		reverse?: boolean;
	}

	let {
		duration = 8,
		length = '8%',
		delay = 0,
		reverse = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<div
	class={['cover', 'pointer-none', 'ring-grad', 'ring-beam', 'spin', reverse && 'reverse', className]}
	aria-hidden="true"
	{@attach vars({ spin: duration, 'spin-delay': delay, 'beam-size': length })}
	{...rest}
></div>
