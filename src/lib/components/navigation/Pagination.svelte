<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Variant } from '../../types';

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Currently active page index (1-based) */
		currentPage?: number;
		/** Total number of pages */
		totalPages?: number;
		/** Number of sibling page buttons displayed on each side of the current page */
		siblingCount?: number;
		/** Whether to always render first and last edge page buttons */
		showEdges?: boolean;
		/** Button size scale */
		size?: Size;
		/** Visual variant for inactive page buttons */
		variant?: Variant;
		/** Additional CSS classes */
		class?: string;
		/** Callback triggered when active page changes */
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(1),
		totalPages = 1,
		siblingCount = 1,
		showEdges = true,
		size = 'md',
		variant = 'ghost',
		class: className = '',
		onPageChange,
		...restProps
	}: Props = $props();

	type PageItem = number | 'dots-left' | 'dots-right';

	const pages = $derived.by<PageItem[]>(() => {
		if (totalPages <= 1) return [1];

		const totalNumbers = siblingCount * 2 + 3; // current + siblings + first + last
		const totalBlocks = totalNumbers + 2; // with both dots

		if (totalPages <= totalBlocks) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const leftSibling = Math.max(currentPage - siblingCount, 1);
		const rightSibling = Math.min(currentPage + siblingCount, totalPages);

		const shouldShowLeftDots = leftSibling > 2;
		const shouldShowRightDots = rightSibling < totalPages - 2;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
			return showEdges ? [...leftRange, 'dots-right', totalPages] : [...leftRange, 'dots-right'];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = Array.from(
				{ length: rightItemCount },
				(_, i) => totalPages - rightItemCount + i + 1
			);
			return showEdges ? [1, 'dots-left', ...rightRange] : ['dots-left', ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = Array.from(
				{ length: rightSibling - leftSibling + 1 },
				(_, i) => leftSibling + i
			);
			return showEdges
				? [1, 'dots-left', ...middleRange, 'dots-right', totalPages]
				: ['dots-left', ...middleRange, 'dots-right'];
		}

		return [1];
	});

	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onPageChange?.(page);
	}
</script>

<nav
	class="f-pagination {className}"
	data-size={size}
	data-variant={variant}
	aria-label="Pagination Navigation"
	{...restProps}
>
	<button
		type="button"
		class="f-pagination-btn f-pagination-prev"
		disabled={currentPage <= 1}
		aria-label="Previous page"
		onclick={() => goToPage(currentPage - 1)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	</button>

	<div class="f-pagination-pages">
		{#each pages as p, i (typeof p === 'number' ? `page-${p}` : `dots-${p}-${i}`)}
			{#if typeof p === 'number'}
				{@const isCurrent = p === currentPage}
				<button
					type="button"
					class="f-pagination-btn f-pagination-page"
					class:is-active={isCurrent}
					aria-current={isCurrent ? 'page' : undefined}
					aria-label={`Page ${p}`}
					onclick={() => goToPage(p)}
				>
					{p}
				</button>
			{:else}
				<span class="f-pagination-dots" aria-hidden="true">&hellip;</span>
			{/if}
		{/each}
	</div>

	<button
		type="button"
		class="f-pagination-btn f-pagination-next"
		disabled={currentPage >= totalPages}
		aria-label="Next page"
		onclick={() => goToPage(currentPage + 1)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	</button>
</nav>

<style>
	@layer fractalsvelte-ui.components {
		.f-pagination {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-2xs);
			box-sizing: border-box;
			user-select: none;
		}

		.f-pagination-pages {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-3xs);
		}

		.f-pagination-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--f-radius-md);
			border: 1px solid transparent;
			background: transparent;
			color: var(--f-text-muted);
			font-family: inherit;
			font-weight: 500;
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		.f-pagination-btn:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-pagination-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-pagination-btn:disabled {
			opacity: 0.35;
			cursor: not-allowed;
		}

		.f-pagination-btn.is-active {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-color: var(--f-primary);
			font-weight: 600;
		}

		.f-pagination-dots {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0 var(--f-space-2xs);
			color: var(--f-text-subtle);
			font-size: var(--f-text-sm);
		}

		/* Sizes */
		.f-pagination[data-size='xs'] .f-pagination-btn {
			width: 24px;
			height: 24px;
			font-size: var(--f-text-xs);
		}

		.f-pagination[data-size='sm'] .f-pagination-btn {
			width: 32px;
			height: 32px;
			font-size: var(--f-text-sm);
		}

		.f-pagination[data-size='md'] .f-pagination-btn {
			width: 40px;
			height: 40px;
			font-size: var(--f-text-base);
		}

		.f-pagination[data-size='lg'] .f-pagination-btn {
			width: 48px;
			height: 48px;
			font-size: var(--f-text-lg);
		}

		.f-pagination[data-size='xl'] .f-pagination-btn {
			width: 56px;
			height: 56px;
			font-size: var(--f-text-xl);
		}
	}
</style>
