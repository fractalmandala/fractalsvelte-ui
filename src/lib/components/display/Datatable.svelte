<!-- @component Rich data table with search filtering, sortable column headers, row selection checkboxes, pagination, and custom cell snippets. -->

<script lang="ts" generics="T = any">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';
	import Checkbox from '../forms/Checkbox.svelte';
	import Pagination from '../navigation/Pagination.svelte';
	import SearchInput from '../forms/SearchInput.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: Column<T>[];
		rows?: T[];
		rowKey?: keyof T & string;
		caption?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		pageSize?: number;
		selectable?: boolean;
		selected?: unknown[];
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
	class="datatable-root box gap-sm {textsize} {className}"
	{...restProps}
>
	{#if searchable || toolbar || (selectable && selected.length)}
		<div class="row ycenter xbetween gap-sm wrap">
			<div class="row ycenter gap-sm grow">
				{#if searchable}
					<div class="search-box">
						<SearchInput
							bind:value={query}
							placeholder={searchPlaceholder}
							size="h-sm"
							oninput={() => (page = 1)}
						/>
					</div>
				{/if}
				{#if selectable && selected.length}
					<span class="selected-badge text-xs font-medium text-secondary">
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

	<div class="table-wrap {surface} {border} {shape} {shadow}">
		<table class="datatable {striped ? 'striped' : ''}">
			{#if caption}
				<caption class="text-secondary text-sm font-medium">{caption}</caption>
			{/if}
			<thead>
				<tr>
					{#if selectable}
						<th class="sel-col">
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
							style:text-align={c.align ?? 'left'}
							aria-sort={sortKey === c.key ? (dir === 1 ? 'ascending' : 'descending') : undefined}
						>
							{#if c.sortable}
								<button
									type="button"
									class="sort-btn row ycenter gap-xs"
									onclick={() => toggleSort(c.key)}
								>
									<span>{c.label}</span>
									<span class="sort-indicator text-xs" aria-hidden="true">
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
							<td class="sel-col">
								<Checkbox
									checked={isSelected}
									aria-label="Select row {String(r[rowKey])}"
									onchange={() => toggleRow(r[rowKey])}
								/>
							</td>
						{/if}
						{#each columns as c (c.key)}
							<td style:text-align={c.align ?? 'left'}>
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
							class="empty-cell text-center text-secondary"
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
			<Pagination bind:currentPage={page} totalPages={pages} size="h-sm" />
		{/if}
	</div>
</div>

<style>
	.datatable-root {
		width: 100%;
	}

	.search-box {
		width: min(18rem, 100%);
	}

	.selected-badge {
		padding: 0.125rem 0.5rem;
		background: var(--bg-sunken, #f4f4f4);
		border-radius: var(--radius-sm, 4px);
	}

	.table-wrap {
		width: 100%;
		overflow-x: auto;
	}

	.datatable {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		color: var(--text-primary, #111);
	}

	caption {
		caption-side: top;
		text-align: left;
		padding: 0.75rem 1rem 0.25rem;
	}

	th {
		padding: 0.625rem 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary, #6b7280);
		border-bottom: 1px solid var(--border, #e5e7eb);
		background: var(--bg-sunken, #f4f4f4);
		white-space: nowrap;
	}

	.sort-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font: inherit;
		color: inherit;
		text-transform: inherit;
		letter-spacing: inherit;
	}

	.sort-indicator {
		opacity: 0.6;
	}

	td {
		padding: 0.625rem 1rem;
		border-bottom: 1px solid var(--border, #e5e7eb);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover td {
		background: var(--state-surface, rgba(0, 0, 0, 0.02));
	}

	tr.selected td {
		background: var(--state-selected, rgba(0, 0, 0, 0.05));
	}

	.striped tbody tr:nth-child(even) td {
		background: var(--bg-sunken, #f9fafb);
	}

	.sel-col {
		width: 2.75rem;
		padding-right: 0;
	}

	.empty-cell {
		padding: 2.5rem 1rem;
	}
</style>
