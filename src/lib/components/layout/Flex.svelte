<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space, Align, Justify } from '../../types';
	import type { StackDirection } from './Stack.svelte';

	export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Flex flow direction */
		direction?: StackDirection;
		/** Flex wrap behavior */
		wrap?: FlexWrap;
		/** Universal gap token across both axes */
		gap?: Space;
		/** Horizontal column gap token */
		gapX?: Space;
		/** Vertical row gap token */
		gapY?: Space;
		/** Cross-axis alignment */
		align?: Align;
		/** Main-axis distribution */
		justify?: Justify;
		/** Render as inline-flex container */
		inline?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Slotted child elements */
		children?: Snippet;
	}

	let {
		direction = 'row',
		wrap = 'nowrap',
		gap = 'none',
		gapX,
		gapY,
		align = 'stretch',
		justify = 'start',
		inline = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	function getSpaceVar(token?: Space): string | undefined {
		if (!token || token === 'none') return undefined;
		return `var(--f-space-${token})`;
	}

	const computedColumnGap = $derived(getSpaceVar(gapX) ?? getSpaceVar(gap));
	const computedRowGap = $derived(getSpaceVar(gapY) ?? getSpaceVar(gap));
</script>

<div
	class="f-flex {className}"
	data-direction={direction}
	data-wrap={wrap}
	data-align={align}
	data-justify={justify}
	data-inline={inline ? 'true' : 'false'}
	style:column-gap={computedColumnGap}
	style:row-gap={computedRowGap}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-flex {
			display: flex;
			box-sizing: border-box;
		}

		.f-flex[data-inline='true'] {
			display: inline-flex;
		}

		/* Directions */
		.f-flex[data-direction='row'] {
			flex-direction: row;
		}
		.f-flex[data-direction='column'] {
			flex-direction: column;
		}
		.f-flex[data-direction='row-reverse'] {
			flex-direction: row-reverse;
		}
		.f-flex[data-direction='column-reverse'] {
			flex-direction: column-reverse;
		}

		/* Wrap */
		.f-flex[data-wrap='nowrap'] {
			flex-wrap: nowrap;
		}
		.f-flex[data-wrap='wrap'] {
			flex-wrap: wrap;
		}
		.f-flex[data-wrap='wrap-reverse'] {
			flex-wrap: wrap-reverse;
		}

		/* Alignment */
		.f-flex[data-align='start'] {
			align-items: flex-start;
		}
		.f-flex[data-align='center'] {
			align-items: center;
		}
		.f-flex[data-align='end'] {
			align-items: flex-end;
		}
		.f-flex[data-align='stretch'] {
			align-items: stretch;
		}
		.f-flex[data-align='baseline'] {
			align-items: baseline;
		}

		/* Distribution */
		.f-flex[data-justify='start'] {
			justify-content: flex-start;
		}
		.f-flex[data-justify='center'] {
			justify-content: center;
		}
		.f-flex[data-justify='end'] {
			justify-content: flex-end;
		}
		.f-flex[data-justify='between'] {
			justify-content: space-between;
		}
		.f-flex[data-justify='around'] {
			justify-content: space-around;
		}
		.f-flex[data-justify='evenly'] {
			justify-content: space-evenly;
		}
	}
</style>
