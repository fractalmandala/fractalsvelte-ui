<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DataColumn<T = any> {
		key: keyof T | string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		width?: string;
	}

	interface Props<T = any> extends HTMLAttributes<HTMLDivElement> {
		columns: DataColumn<T>[];
		rows: T[];
		striped?: boolean;
		bordered?: boolean;
		hoverable?: boolean;
		class?: string;
		cell?: Snippet<[{ row: T; column: DataColumn<T>; value: any }]>;
	}

	let {
		columns,
		rows,
		striped = true,
		bordered = true,
		hoverable = true,
		class: className = '',
		cell,
		...restProps
	}: Props = $props();

	let sortKey = $state<string | null>(null);
	let sortOrder = $state<'asc' | 'desc'>('asc');

	function toggleSort(col: DataColumn) {
		if (!col.sortable) return;
		const key = String(col.key);
		if (sortKey === key) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortOrder = 'asc';
		}
	}

	const sortedRows = $derived.by(() => {
		const key = sortKey;
		if (!key) return rows;
		return [...rows].sort((a: any, b: any) => {
			const valA = a[key];
			const valB = b[key];
			if (valA === valB) return 0;
			if (valA == null) return 1;
			if (valB == null) return -1;
			const cmp = valA > valB ? 1 : -1;
			return sortOrder === 'asc' ? cmp : -cmp;
		});
	});
</script>

<div
	class="f-datatable-wrapper {className}"
	data-bordered={bordered ? 'true' : undefined}
	{...restProps}
>
	<table class="f-datatable" data-striped={striped ? 'true' : undefined} data-hoverable={hoverable ? 'true' : undefined}>
		<thead>
			<tr>
				{#each columns as col}
					<th
						style={col.width ? `width: ${col.width};` : ''}
						data-align={col.align ?? 'left'}
						class:is-sortable={col.sortable}
						onclick={() => toggleSort(col)}
					>
						<div class="f-th-inner">
							<span>{col.label}</span>
							{#if col.sortable}
								<span class="f-sort-icon">
									{#if sortKey === col.key}
										{sortOrder === 'asc' ? '▲' : '▼'}
									{:else}
										<span style="opacity: 0.3;">⇅</span>
									{/if}
								</span>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedRows as row}
				<tr>
					{#each columns as col}
						<td data-align={col.align ?? 'left'}>
							{#if cell}
								{@render cell({ row, column: col, value: row[col.key as keyof typeof row] })}
							{:else}
								{row[col.key as keyof typeof row]}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-datatable-wrapper {
			width: 100%;
			overflow-x: auto;
			border-radius: var(--f-radius-md);
			background: var(--f-surface);
			box-sizing: border-box;
		}

		.f-datatable-wrapper[data-bordered='true'] {
			border: 1px solid var(--f-border);
		}

		.f-datatable {
			width: 100%;
			border-collapse: collapse;
			font-size: var(--f-text-sm);
			text-align: left;
			color: var(--f-text);
		}

		.f-datatable th {
			padding: 0.75rem 1rem;
			font-weight: 600;
			color: var(--f-text-muted);
			background: var(--f-sunken);
			border-bottom: 1px solid var(--f-border);
			user-select: none;
		}

		.f-datatable th.is-sortable {
			cursor: pointer;
		}

		.f-datatable th.is-sortable:hover {
			color: var(--f-text);
		}

		.f-th-inner {
			display: flex;
			align-items: center;
			gap: 0.35rem;
		}

		.f-sort-icon {
			font-size: 0.7rem;
		}

		.f-datatable td {
			padding: 0.75rem 1rem;
			border-bottom: 1px solid var(--f-border-subtle);
		}

		.f-datatable[data-striped='true'] tbody tr:nth-child(even) {
			background: var(--f-sunken);
		}

		.f-datatable[data-hoverable='true'] tbody tr:hover {
			background: var(--f-hover);
		}

		th[data-align='center'], td[data-align='center'] { text-align: center; }
		th[data-align='right'], td[data-align='right'] { text-align: right; }
	}
</style>
