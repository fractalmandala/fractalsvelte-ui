<!-- @component Responsive data table supporting declarative columns and rows sorting or compound children. -->

<script lang="ts" generics="T = any">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Column, Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLTableAttributes, 'border'> {
		columns?: Column<T>[];
		/** The records to show, one object per row. */
		rows?: T[];
		caption?: string;
		/** Shades every other row. */
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

<div class="wfull scroll-x {surface} {border} {shape} {shadow} {textsize}">
	<table class="data-table {striped ? 'striped' : ''} {className}" {...restProps}>
		{#if caption}
			<caption class="text-secondary text-sm weight-500">{caption}</caption>
		{/if}

		{#if children}
			{@render children()}
		{:else}
			<thead>
				<tr>
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
				{#each sorted as r, i (i)}
					<tr>
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
						<td colspan={columns.length || 1} class="data-table-empty text-secondary">
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

