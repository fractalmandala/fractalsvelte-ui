<!-- @component A box that holds a fixed aspect ratio, with media children filling it. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Frame } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The ratios fractalstyler generates a .frame-* for. Media children fill and cover. */
		ratio?: Frame;
		class?: string;
		children?: Snippet;
	}

	let { ratio = 'frame-16-9', class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="wfull {ratio} {className}" {...restProps}>
	{@render children?.()}
</div>
