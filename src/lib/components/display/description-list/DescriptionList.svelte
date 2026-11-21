<!-- @component A list of term and definition pairs, laid out as a stack or as aligned rows. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  ChildTextColor, ChildTextSize, Orientation, TextSize  } from '../../../internal/tokens.js';

	interface DescriptionItem {
		term: string;
		description: string;
	}

	interface Props extends HTMLAttributes<HTMLDListElement> {
		items?: DescriptionItem[];
		orientation?: Orientation;
		columns?: '1' | '2' | '3' | '4';
		dividers?: boolean;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		children?: Snippet;
	}

	let {
		items,
		orientation = 'vertical',
		columns = '1',
		dividers = false,
		textSize = 'text-md',
		childTextSize = 'text-sm',
		childTextColor = 'text-secondary',
		class: className,
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
		className
	]);

	const pairClass = $derived(orientation === 'horizontal' ? 'pair-row' : 'box gap-xs');
</script>

<dl class={classes} {...rest}>
	{#if items}
		{#each items as item, i (item.term + String(i))}
			<div class={pairClass}>
				<dt class={['weight-500', childTextSize, childTextColor]}>{item.term}</dt>
				<dd class={textSize}>{item.description}</dd>
			</div>
		{/each}
	{:else}
		{@render children?.()}
	{/if}
</dl>
