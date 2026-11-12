<!-- @component Pulls its child toward the pointer, then springs it back. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { magnetic, type SpringInput } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** How strongly the element is pulled toward the pointer, from 0 to 1. */
		strength?: number;
		/** How far beyond the element's bounds the pointer still attracts it, in pixels. */
		radius?: number;
		/** The spring used to pull and to return. */
		spring?: SpringInput;
		/** Turns the pull off, leaving the children in place. */
		disabled?: boolean;
		/** The element being pulled. */
		children?: Snippet;
	}

	let {
		strength = 0.35,
		radius = 40,
		spring = 'snappy',
		disabled = false,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const attach = $derived(disabled ? undefined : magnetic({ strength, radius, spring }));
</script>

<div class={['motion', klass]} {@attach attach} {...rest}>
	{@render children?.()}
</div>
