<!-- @component Responsive data table supporting declarative columns and rows sorting or compound children. -->

<script lang="ts" generics="T = any">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLTableAttributes, 'border'> {
		columns?: Column<T>[];
		rows?: T[];
		caption?: string;
		striped?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		cell?: Snippet<[T, Column<T>]>;
		empty?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		columns = [],
		rows = [],
		caption,
		striped = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		cell,
		empty,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	let sortKey = $state<string | null>(null);
	let dir = $state<1 | -1>(1);

	const sorted = $derived.by(() => {
		if (!sortKey) return rows;
		const k = sortKey;
		return [...rows].sort((a, b) =>
			String((a as Record<string, any>)[k] ?? '').localeCompare(
				String((b as Record<string, any>)[k] ?? ''),
				undefined,
				{ numeric: true }
			) * dir
		);
	});

	function toggleSort(k: string) {
		if (sortKey === k) {
			dir = dir === 1 ? -1 : 1;
		} else {
			sortKey = k;
			dir = 1;
		}
	}
</script>

<div class="table-container {surface} {border} {shape} {shadow} {textsize}">
	<table class="table-element {striped ? 'striped' : ''} {className}" {...restProps}>
		{#if caption}
			<caption class="text-secondary text-sm font-medium">{caption}</caption>
		{/if}

		{#if children}
			{@render children()}
		{:else}
			<thead>
				<tr>
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
				{#each sorted as r, i (i)}
					<tr>
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
						<td colspan={columns.length || 1} class="empty-cell text-center text-secondary">
							{#if empty}
								{@render empty()}
							{:else}
								No data available
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	.table-element {
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

	.striped tbody tr:nth-child(even) td {
		background: var(--bg-sunken, #f9fafb);
	}

	.empty-cell {
		padding: 2.5rem 1rem;
	}
</style>
