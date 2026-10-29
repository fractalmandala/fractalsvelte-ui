<!-- @component Simple flex col and row element to contain buttons. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Lay the buttons out in a row or a column. */
		direction?: Orientation;
		/** Attached buttons share borders (.button-group); detached ones sit apart on a gap. */
		attached?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'horizontal',
		attached = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const vertical = $derived(direction === 'vertical');
</script>

{#if attached}
	<div
		class="button-group {vertical ? 'vertical' : ''} {className}"
		role="group"
		{...restProps}
	>
		{@render children?.()}
	</div>
{:else}
	<div
		class="{vertical ? 'box' : 'row ycenter wrap'} gap-xs {className}"
		role="group"
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}
