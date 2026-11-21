<!-- @component Tilts a card in 3D toward the pointer, with an optional glare highlight. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { tilt, type SpringInput } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		max?: number;
		scale?: number;
		glare?: boolean;
		spring?: SpringInput;
		children?: Snippet;
	}

	let {
		max = 10,
		scale = 1.02,
		glare = false,
		spring = 'snappy',
		class: className,
		children,
		...rest
	}: Props = $props();

	const attach = $derived(tilt({ max, scale, spring, glare }));
</script>

<div class={['tilt', 'motion', 'relative', 'overflow-hidden', className]} {@attach attach} {...rest}>
	{@render children?.()}
	{#if glare}
		<div class="cover pointer-none glare"></div>
	{/if}
</div>
