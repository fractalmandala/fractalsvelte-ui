<!-- @component Pulls its child toward the pointer, then springs it back. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { magnetic, type SpringInput } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		strength?: number;
		radius?: number;
		spring?: SpringInput;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		strength = 0.35,
		radius = 40,
		spring = 'snappy',
		disabled = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const attach = $derived(disabled ? undefined : magnetic({ strength, radius, spring }));
</script>

<div class={['motion', className]} {@attach attach} {...rest}>
	{@render children?.()}
</div>
