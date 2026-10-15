<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Number of grid columns (defaults to 12-column bento system) */
		columns?: number | string;
		/** Row track sizing (e.g. minmax(180px, auto)) */
		autoRows?: string;
		/** Universal grid gap token */
		gap?: Space;
		/** Use CSS dense packing to backfill grid holes */
		dense?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Bento cells */
		children?: Snippet;
	}

	let {
		columns = 3,
		autoRows = 'minmax(180px, auto)',
		gap = 'md',
		dense = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const gridTemplateColumns = $derived(
		typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns
	);
</script>

<div
	class="f-bento-grid {className}"
	data-dense={dense ? 'true' : 'false'}
	data-gap={gap}
	style:grid-template-columns={gridTemplateColumns}
	style:grid-auto-rows={autoRows}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-bento-grid {
			display: grid;
			width: 100%;
			box-sizing: border-box;
		}

		.f-bento-grid[data-dense='true'] {
			grid-auto-flow: row dense;
		}

		.f-bento-grid[data-dense='false'] {
			grid-auto-flow: row;
		}

		/* Gaps */
		.f-bento-grid[data-gap='none'] {
			gap: 0;
		}
		.f-bento-grid[data-gap='3xs'] {
			gap: var(--f-space-3xs);
		}
		.f-bento-grid[data-gap='2xs'] {
			gap: var(--f-space-2xs);
		}
		.f-bento-grid[data-gap='xs'] {
			gap: var(--f-space-xs);
		}
		.f-bento-grid[data-gap='sm'] {
			gap: var(--f-space-sm);
		}
		.f-bento-grid[data-gap='md'] {
			gap: var(--f-space-md);
		}
		.f-bento-grid[data-gap='lg'] {
			gap: var(--f-space-lg);
		}
		.f-bento-grid[data-gap='xl'] {
			gap: var(--f-space-xl);
		}
		.f-bento-grid[data-gap='2xl'] {
			gap: var(--f-space-2xl);
		}

		/* Responsive fallback for smaller screens */
		@media (max-width: 768px) {
			.f-bento-grid {
				grid-template-columns: 1fr !important;
			}
		}
	}
</style>
