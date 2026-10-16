<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { FRAME, type FsRatio } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The ratios fractalstyler generates a .frame-* for. Media children fill and cover. */
		ratio?: FsRatio;
		class?: string;
		children?: Snippet;
	}

	let { ratio = '16/9', class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="wfull {FRAME[ratio]} {className}" {...restProps}>
	{@render children?.()}
</div>
