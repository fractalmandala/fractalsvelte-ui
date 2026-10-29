<!-- @component Page number buttons with previous and next controls. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronLeft, luChevronRight } from '@fractaldesign/icons/lucide';
	import type { Variant, Size, Shape } from '../types';

	interface Props extends HTMLAttributes<HTMLElement> {
		currentPage?: number;
		totalPages?: number;
		siblingCount?: number;
		showEdges?: boolean;
		size?: Size;
		/** Paint of the inactive pages; the current page is always primary */
		variant?: Variant;
		shape?: Shape;
		class?: string;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(1),
		totalPages = 1,
		siblingCount = 1,
		showEdges = true,
		size = 'h-lg',
		variant = 'ghost',
		shape = 'modern',
		class: className = '',
		onPageChange,
		...restProps
	}: Props = $props();

	type PageItem = number | 'dots-left' | 'dots-right';

	const pages = $derived.by<PageItem[]>(() => {
		if (totalPages <= 1) return [1];
		const totalBlocks = siblingCount * 2 + 5;
		if (totalPages <= totalBlocks) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const left = Math.max(currentPage - siblingCount, 1);
		const right = Math.min(currentPage + siblingCount, totalPages);
		const leftDots = left > 2;
		const rightDots = right < totalPages - 2;
		const span = 3 + 2 * siblingCount;
		if (!leftDots && rightDots) {
			const range = Array.from({ length: span }, (_, i) => i + 1);
			return showEdges ? [...range, 'dots-right', totalPages] : [...range, 'dots-right'];
		}
		if (leftDots && !rightDots) {
			const range = Array.from({ length: span }, (_, i) => totalPages - span + i + 1);
			return showEdges ? [1, 'dots-left', ...range] : ['dots-left', ...range];
		}
		const middle = Array.from({ length: right - left + 1 }, (_, i) => left + i);
		return showEdges ? [1, 'dots-left', ...middle, 'dots-right', totalPages] : ['dots-left', ...middle, 'dots-right'];
	});

	function go(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onPageChange?.(page);
	}
</script>

<nav class="row ycenter gap-xs wrap {className}" aria-label="Pagination" {...restProps}>
	<button
		type="button"
		class="frame-1-1 px-xs el-variant el-size el-shape {variant} {size} {shape}"
		disabled={currentPage <= 1}
		aria-label="Previous page"
		onclick={() => go(currentPage - 1)}
	>
		<Icon icon={luChevronLeft} />
	</button>
	{#each pages as p, i (typeof p === 'number' ? `p${p}` : `${p}${i}`)}
		{#if typeof p === 'number'}
			<button
				type="button"
				class="px-sm mono el-variant el-size el-shape {p === currentPage ? 'primary' : variant} {size} {shape}"
				aria-current={p === currentPage ? 'page' : undefined}
				aria-label="Page {p}"
				onclick={() => go(p)}
			>
				{p}
			</button>
		{:else}
			<span class="px-xs text-muted" aria-hidden="true">…</span>
		{/if}
	{/each}
	<button
		type="button"
		class="frame-1-1 px-xs el-variant el-size el-shape {variant} {size} {shape}"
		disabled={currentPage >= totalPages}
		aria-label="Next page"
		onclick={() => go(currentPage + 1)}
	>
		<Icon icon={luChevronRight} />
	</button>
</nav>
