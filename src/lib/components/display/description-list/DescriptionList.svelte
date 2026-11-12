<!-- @component A list of term and definition pairs, laid out as a stack or as aligned rows. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../../../internal/tokens.js';

	interface DescriptionItem {
		/** The term. */
		term: string;
		/** The definition. */
		description: string;
	}

	interface Props extends HTMLAttributes<HTMLDListElement> {
		/** Term and definition pairs. When omitted, `children` are rendered inside the list. */
		items?: DescriptionItem[];
		/** `vertical` stacks the term over the definition; `horizontal` places them on one row. */
		orientation?: Orientation;
		/** How many columns of pairs to lay out. */
		columns?: '1' | '2' | '3' | '4';
		/** Draws a hairline between pairs. */
		dividers?: boolean;
		/** Custom terms and definitions, used when `items` is omitted. */
		children?: Snippet;
	}

	let {
		items,
		orientation = 'vertical',
		columns = '1',
		dividers = false,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const columnClass = {
		'1': 'box',
		'2': 'grid-2',
		'3': 'grid-3',
		'4': 'grid-4'
	} as const;

	const classes = $derived([
		'pairs',
		columnClass[columns],
		columns === '1' ? 'gap-sm' : 'gap-lg',
		dividers && 'divided',
		klass
	]);

	const pairClass = $derived(orientation === 'horizontal' ? 'pair-row' : 'box gap-xs');
</script>

<dl class={classes} {...rest}>
	{#if items}
		{#each items as item, i (item.term + String(i))}
			<div class={pairClass}>
				<dt class="text-sm text-secondary weight-500">{item.term}</dt>
				<dd class="text-md text-primary">{item.description}</dd>
			</div>
		{/each}
	{:else}
		{@render children?.()}
	{/if}
</dl>
