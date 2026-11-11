<!-- @component Rich data table with search filtering, sortable column headers, row selection checkboxes, pagination, and custom cell snippets. -->

<script lang="ts" generics="T = any">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';
	import Checkbox from '../core/Checkbox.svelte';
	import Pagination from '../navigation/Pagination.svelte';
	import SearchInput from '../forms/SearchInput.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: Column<T>[];
		/** The records to show, one object per row. */
		rows?: T[];
		rowKey?: keyof T & string;
		caption?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		/** Rows per page; pagination appears when there are more. */
		pageSize?: number;
		selectable?: boolean;
		/** Bindable list of the `rowKey` values of the selected rows. */
		selected?: unknown[];
		/** Shades every other row. */
		striped?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		cell?: Snippet<[T, Column<T>]>;
		toolbar?: Snippet;
		empty?: Snippet;
		class?: string;
	}

	let {
		columns = [],
		rows = [],
		rowKey = 'id' as keyof T & string,
		caption,
		searchable = true,
		searchPlaceholder = 'Search rows…',
		pageSize = 5,
		selectable = false,
		selected = $bindable([]),
		striped = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		cell,
		toolbar,
		empty,
		class: className = '',
		...restProps
	}: Props = $props();

	let query = $state('');
	let sortKey = $state<string | null>(null);
	let dir = $state<1 | -1>(1);
	let page = $state(1);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let out = q
			? rows.filter((r) =>
					columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q))
				)
			: rows;
		if (sortKey) {
			const k = sortKey;
			out = [...out].sort((a, b) =>
				String((a as Record<string, any>)[k] ?? '').localeCompare(
					String((b as Record<string, any>)[k] ?? ''),
					undefined,
					{ numeric: true }
				) * dir
			);
		}
		return out;
	});

	const pages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
	const view = $derived(
		filtered.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize)
	);
	const allOnPage = $derived(
		view.length > 0 && view.every((r) => selected.includes(r[rowKey]))
	);
	const someOnPage = $derived(
		!allOnPage && view.some((r) => selected.includes(r[rowKey]))
	);

	function toggleSort(k: string) {
		if (sortKey === k) {
			dir = dir === 1 ? -1 : 1;
		} else {
			sortKey = k;
			dir = 1;
		}
	}

	function toggleRow(k: unknown) {
		selected = selected.includes(k)
			? selected.filter((x) => x !== k)
			: [...selected, k];
	}

	function togglePage() {
		const keys: unknown[] = view.map((r) => r[rowKey]);
		selected = allOnPage
			? selected.filter((k) => !keys.includes(k))
			: [...new Set([...selected, ...keys])];
	}
</script>

<div
	class="box gap-sm wfull {textsize} {className}"
	{...restProps}
>
	{#if searchable || toolbar || (selectable && selected.length)}
		<div class="row ycenter xbetween gap-sm wrap">
			<div class="row ycenter gap-sm grow">
				{#if searchable}
					<div>
						<SearchInput
							bind:value={query}
							placeholder={searchPlaceholder}
							size="h-bs"
							oninput={() => (page = 1)}
						/>
					</div>
				{/if}
				{#if selectable && selected.length}
					<span class="px-sm mincurved state-hover text-xs weight-500 text-secondary">
						{selected.length} selected
					</span>
				{/if}
			</div>
			{#if toolbar}
				<div class="row ycenter gap-xs">
					{@render toolbar()}
				</div>
			{/if}
		</div>
	{/if}

	<div class="wfull scroll-x {surface} {border} {shape} {shadow}">
		<table class="data-table {striped ? 'striped' : ''}">
			{#if caption}
				<caption class="text-secondary text-sm weight-500">{caption}</caption>
			{/if}
			<thead>
				<tr>
					{#if selectable}
						<th class="data-table-select">
							<Checkbox
								checked={allOnPage}
								indeterminate={someOnPage}
								aria-label="Select all rows on this page"
								onchange={togglePage}
							/>
						</th>
					{/if}
					{#each columns as c (c.key)}
						<th
							scope="col"
							class="{c.align === 'right' ? 'ta-r' : c.align === 'center' ? 'ta-c' : ''}"
							aria-sort={sortKey === c.key ? (dir === 1 ? 'ascending' : 'descending') : undefined}
						>
							{#if c.sortable}
								<button
									type="button"
									class="row ycenter gap-xs pad-none border-none bg-none text-xs weight-600 tt-u"
									onclick={() => toggleSort(c.key)}
								>
									<span>{c.label}</span>
									<span class="text-xs text-muted" aria-hidden="true">
										{sortKey === c.key ? (dir === 1 ? '↑' : '↓') : '↕'}
									</span>
								</button>
							{:else}
								<span>{c.label}</span>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each view as r (r[rowKey])}
					{@const isSelected = selected.includes(r[rowKey])}
					<tr class={isSelected ? 'selected' : ''}>
						{#if selectable}
							<td class="data-table-select">
								<Checkbox
									checked={isSelected}
									aria-label="Select row {String(r[rowKey])}"
									onchange={() => toggleRow(r[rowKey])}
								/>
							</td>
						{/if}
						{#each columns as c (c.key)}
							<td class="{c.align === 'right' ? 'ta-r' : c.align === 'center' ? 'ta-c' : ''}">
								{#if cell}
									{@render cell(r, c)}
								{:else}
									{r[c.key]}
								{/if}
							</td>
						{/each}
					</tr>
				{:else}
					<tr>
						<td
							class="data-table-empty text-secondary"
							colspan={columns.length + (selectable ? 1 : 0)}
						>
							{#if empty}
								{@render empty()}
							{:else}
								No rows match “{query}”.
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="row ycenter xbetween gap-sm text-xs text-secondary pt-xs">
		<span>
			{filtered.length
				? `${(Math.min(page, pages) - 1) * pageSize + 1}–${Math.min(
						Math.min(page, pages) * pageSize,
						filtered.length
					)} of ${filtered.length}`
				: '0 rows'}
		</span>
		{#if pages > 1}
			<Pagination bind:currentPage={page} totalPages={pages} size="h-bs" />
		{/if}
	</div>
</div>

