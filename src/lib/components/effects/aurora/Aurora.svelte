<!-- @component Slow drifting blurred colour fields, used as a section background, with children on top. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		intensity?: number;
		speed?: number;
		children?: Snippet;
	}

	let {
		intensity = 0.45,
		speed = 18,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={['aurora', className]}
	{@attach vars({ 'aurora-intensity': intensity, aurora: speed })}
	{...rest}
>
	{@render children?.()}
</div>
