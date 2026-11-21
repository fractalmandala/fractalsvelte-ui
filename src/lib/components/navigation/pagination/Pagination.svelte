<!-- @component Moves through a long list a page at a time, as buttons or as real links. -->

<script lang="ts">
	import type {   HTMLAttributes  } from 'svelte/elements';
	import type {  IconData  } from '@fractaldesign/icons';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronLeft, luChevronRight, luChevronsLeft, luChevronsRight, luEllipsis } from '@fractaldesign/icons/lucide';
	import { type Gap, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';
	import { pageSlots } from './pages.js';

	type PaginationVariant = 'numbers' | 'simple' | 'compact';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'disabled'> {
		page?: number;
		onPageChange?: (page: number) => void;
		count?: number;
		total?: number;
		pageSize?: number;
		siblings?: number;
		boundaries?: number;
		gap?: Gap;
		form?: PaginationVariant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: TextColor;
		href?: (page: number) => string;
		label?: string;
			disabled?: boolean | null;
}

	let {
		page = $bindable(1),
		onPageChange,
		count,
		total,
		pageSize = 10,
		siblings = 1,
		boundaries = 1,
		form = 'numbers',
		size = 'h-lg',
		textSize,
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		href,
		label = 'Pagination',
		class: className,
		gap = 'gap-xs',
		...rest

	}: Props = $props();

	const pages = $derived(
		count !== undefined ? Math.max(0, Math.floor(count)) : Math.max(0, Math.ceil((total ?? 0) / Math.max(1, pageSize)))
	);
	const current = $derived(pages === 0 ? 0 : Math.min(Math.max(1, page), pages));
	const slots = $derived(pageSlots(current, pages, siblings, boundaries));

	function go(next: number) {
		if (pages === 0) return;
		const clamped = Math.min(Math.max(1, next), pages);
		if (clamped === page) return;
		page = clamped;
		onPageChange?.(clamped);
	}

	const btn = $derived(['button modern ghost no-scaling', size, textSize]);
	const iconBtn = $derived([...btn, 'btn-icon inline-flex']);
</script>

{#snippet control(target: number, name: string, icon: IconData)}
	{#if href}
		<a
			class={iconBtn}
			href={target === current || (target < 1 || target > pages) ? undefined : href(target)}
			aria-label={name}
			aria-disabled={target < 1 || target > pages || target === current ? 'true' : undefined}
			onclick={(event) => {
				if (target < 1 || target > pages || target === current) event.preventDefault();
				else go(target);
			}}
		>
			<Icon {icon} />
		</a>
	{:else}
		<button type="button" class={iconBtn} aria-label={name} disabled={target < 1 || target > pages} onclick={() => go(target)}>
			<Icon {icon} />
		</button>
	{/if}
{/snippet}

<nav aria-label={label} class={['row ycenter wrap', gap, className]} {...rest}>
	{@render control(1, 'First page', luChevronsLeft)}
	{@render control(current - 1, 'Previous page', luChevronLeft)}

	{#if form === 'numbers'}
		{#each slots as slot, i (typeof slot === 'number' ? slot : `e-${i}`)}
			{#if slot === 'ellipsis'}
				<span class={['inline-flex xcenter ycenter', childTextColor, size, textSize]} aria-hidden="true">
					<Icon icon={luEllipsis} />
				</span>
			{:else if href}
				<a
					class={[...btn, 'px-md', slot === current && 'selected']}
					href={href(slot)}
					aria-label="Page {slot}"
					aria-current={slot === current ? 'page' : undefined}
					onclick={() => go(slot)}
				>
					<span class="tabular-nums">{slot}</span>
				</a>
			{:else}
				<button
					type="button"
					class={[...btn, 'px-md', slot === current && 'selected']}
					aria-label="Page {slot}"
					aria-current={slot === current ? 'page' : undefined}
					onclick={() => go(slot)}
				>
					<span class="tabular-nums">{slot}</span>
				</button>
			{/if}
		{/each}
	{:else if form === 'simple'}
		<p class={['tabular-nums px-sm', textColor, size, textSize, 'row ycenter']} aria-live="polite">
			Page {current} of {pages}
		</p>
	{:else}
		<p class={['tabular-nums px-sm', textColor, size, textSize, 'row ycenter']} aria-live="polite">
			{current}
			<span class={childTextColor}>/</span>
			{pages}
		</p>
	{/if}

	{@render control(current + 1, 'Next page', luChevronRight)}
	{@render control(pages, 'Last page', luChevronsRight)}
</nav>
