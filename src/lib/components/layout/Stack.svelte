<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space, Align, Justify } from '../../types';

	export type StackDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Primary flex layout flow direction */
		direction?: StackDirection;
		/** Spacing token between items */
		gap?: Space;
		/** Cross-axis alignment */
		align?: Align;
		/** Main-axis distribution */
		justify?: Justify;
		/** Whether children wrap onto multiple lines */
		wrap?: boolean;
		/** Whether stack is inline-flex */
		inline?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Slotted child elements */
		children?: Snippet;
	}

	let {
		direction = 'column',
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		wrap = false,
		inline = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-stack {className}"
	data-direction={direction}
	data-gap={gap}
	data-align={align}
	data-justify={justify}
	data-wrap={wrap ? 'true' : 'false'}
	data-inline={inline ? 'true' : 'false'}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-stack {
			display: flex;
			box-sizing: border-box;
		}

		.f-stack[data-inline='true'] {
			display: inline-flex;
		}

		/* Directions */
		.f-stack[data-direction='column'] {
			flex-direction: column;
		}
		.f-stack[data-direction='row'] {
			flex-direction: row;
		}
		.f-stack[data-direction='column-reverse'] {
			flex-direction: column-reverse;
		}
		.f-stack[data-direction='row-reverse'] {
			flex-direction: row-reverse;
		}

		/* Wrapping */
		.f-stack[data-wrap='true'] {
			flex-wrap: wrap;
		}
		.f-stack[data-wrap='false'] {
			flex-wrap: nowrap;
		}

		/* Align */
		.f-stack[data-align='start'] {
			align-items: flex-start;
		}
		.f-stack[data-align='center'] {
			align-items: center;
		}
		.f-stack[data-align='end'] {
			align-items: flex-end;
		}
		.f-stack[data-align='stretch'] {
			align-items: stretch;
		}
		.f-stack[data-align='baseline'] {
			align-items: baseline;
		}

		/* Justify */
		.f-stack[data-justify='start'] {
			justify-content: flex-start;
		}
		.f-stack[data-justify='center'] {
			justify-content: center;
		}
		.f-stack[data-justify='end'] {
			justify-content: flex-end;
		}
		.f-stack[data-justify='between'] {
			justify-content: space-between;
		}
		.f-stack[data-justify='around'] {
			justify-content: space-around;
		}
		.f-stack[data-justify='evenly'] {
			justify-content: space-evenly;
		}

		/* Gaps */
		.f-stack[data-gap='none'] {
			gap: 0;
		}
		.f-stack[data-gap='3xs'] {
			gap: var(--f-space-3xs);
		}
		.f-stack[data-gap='2xs'] {
			gap: var(--f-space-2xs);
		}
		.f-stack[data-gap='xs'] {
			gap: var(--f-space-xs);
		}
		.f-stack[data-gap='sm'] {
			gap: var(--f-space-sm);
		}
		.f-stack[data-gap='md'] {
			gap: var(--f-space-md);
		}
		.f-stack[data-gap='lg'] {
			gap: var(--f-space-lg);
		}
		.f-stack[data-gap='xl'] {
			gap: var(--f-space-xl);
		}
		.f-stack[data-gap='2xl'] {
			gap: var(--f-space-2xl);
		}
	}
</style>
