<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space, Align, Justify } from '../../types';

	export type GridColumns = number | 'auto-fit' | 'auto-fill' | string;
	export type GridJustify = Justify | 'stretch';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Number of columns (1-12), auto-fit, auto-fill, or custom grid template */
		columns?: GridColumns;
		/** Minimum item width for responsive auto-fit/auto-fill modes */
		minColumnWidth?: string;
		/** Universal grid gap token */
		gap?: Space;
		/** Horizontal grid column gap */
		gapX?: Space;
		/** Vertical grid row gap */
		gapY?: Space;
		/** Grid item alignment along the block axis */
		align?: Align;
		/** Grid track distribution along the inline axis */
		justify?: GridJustify;
		/** Additional CSS classes */
		class?: string;
		/** Slotted child elements */
		children?: Snippet;
	}

	let {
		columns = 1,
		minColumnWidth = '240px',
		gap = 'md',
		gapX,
		gapY,
		align = 'stretch',
		justify = 'start',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	function getSpaceVar(token?: Space): string | undefined {
		if (!token || token === 'none') return undefined;
		return `var(--f-space-${token})`;
	}

	const gridTemplateColumns = $derived.by(() => {
		if (typeof columns === 'number') {
			return `repeat(${columns}, minmax(0, 1fr))`;
		}
		if (columns === 'auto-fit') {
			return `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`;
		}
		if (columns === 'auto-fill') {
			return `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`;
		}
		return columns;
	});

	const computedColumnGap = $derived(getSpaceVar(gapX) ?? getSpaceVar(gap));
	const computedRowGap = $derived(getSpaceVar(gapY) ?? getSpaceVar(gap));
</script>

<div
	class="f-grid {className}"
	data-align={align}
	data-justify={justify}
	style:grid-template-columns={gridTemplateColumns}
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
		.f-grid {
			display: grid;
			box-sizing: border-box;
			width: 100%;
		}

		/* Align items */
		.f-grid[data-align='start'] {
			align-items: start;
		}
		.f-grid[data-align='center'] {
			align-items: center;
		}
		.f-grid[data-align='end'] {
			align-items: end;
		}
		.f-grid[data-align='stretch'] {
			align-items: stretch;
		}
		.f-grid[data-align='baseline'] {
			align-items: baseline;
		}

		/* Justify items */
		.f-grid[data-justify='start'] {
			justify-items: start;
		}
		.f-grid[data-justify='center'] {
			justify-items: center;
		}
		.f-grid[data-justify='end'] {
			justify-items: end;
		}
		.f-grid[data-justify='stretch'] {
			justify-items: stretch;
		}
	}
</style>
