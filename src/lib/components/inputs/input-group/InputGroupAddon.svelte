<!-- @component A start or end cluster of icons, text or buttons. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the addon sits at the start or the end of the group. Visual order still follows source order. */
		align?: 'start' | 'end';
		/** Icons, text or buttons that belong to this side of the field. */
		children?: Snippet;
	}

	let { align = 'start', class: className, children, ...rest }: Props = $props();
</script>

<div class={['row ycenter shrink-0 gap-xs', className]} data-align={align} {...rest}>
	{@render children?.()}
</div>
