<!-- @component A start or end cluster of icons, text or buttons. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the addon sits at the start or the end of the group. Visual order still follows source order. */
		side?: 'start' | 'end';
		/** Icons, text or buttons that belong to this side of the field. */
		children?: Snippet;
	}

	let { side = 'start', class: klass, children, ...rest }: Props = $props();
</script>

<div class={['row ycenter shrink-0 gap-xs', klass]} data-side={side} {...rest}>
	{@render children?.()}
</div>
