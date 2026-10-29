<!-- @component A horizontal or vertical rule, with optional label. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Border, Space } from '../types';

	export type DividerLabelPosition = 'start' | 'center' | 'end';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: 'horizontal' | 'vertical';
		/** Line colour, from the border tokens */
		border?: Exclude<Border, 'border-none'>;
		spacing?: Space;
		label?: string;
		labelPosition?: DividerLabelPosition;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'horizontal',
		border = 'border',
		spacing = 'md',
		label,
		labelPosition = 'center',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const line = $derived(`1px solid var(--${border})`);
	const hasContent = $derived(Boolean(label || children));
</script>

{#if direction === 'vertical'}
	<div role="separator" aria-orientation="vertical" class="shrink-0 hfull mx-{spacing} {className}" style:border-right={line} {...restProps}></div>
{:else if hasContent}
	<div role="separator" class="row ycenter gap-sm wfull my-{spacing} {className}" {...restProps}>
		{#if labelPosition !== 'start'}<span class="grow" style:border-bottom={line}></span>{/if}
		<span class="text-sm text-muted shrink-0">{#if children}{@render children()}{:else}{label}{/if}</span>
		{#if labelPosition !== 'end'}<span class="grow" style:border-bottom={line}></span>{/if}
	</div>
{:else}
	<div role="separator" class="wfull my-{spacing} {className}" style:border-bottom={line} {...restProps}></div>
{/if}
