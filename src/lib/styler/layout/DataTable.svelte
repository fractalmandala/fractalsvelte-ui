<script lang="ts" module>
	export interface DataColumn<T = any> {
		key: keyof T | string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
	}
</script>

<script lang="ts" generics="T extends Record<string, any>">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luChevronUp, luChevronDown, luChevronsUpDown } from 'fractalicons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns: DataColumn<T>[];
		rows: T[];
		striped?: boolean;
		bordered?: boolean;
		class?: string;
		cell?: Snippet<[{ row: T; column: DataColumn<T>; value: any }]>;
	}

	let { columns, rows, striped = true, bordered = true, class: className = '', cell, ...restProps }: Props = $props();

	let sortKey = $state<string | null>(null);
	let sortOrder = $state<'asc' | 'desc'>('asc');

	const ALIGN_CLASSES = { left: 'ta-l', center: 'ta-c', right: 'ta-r' };
	const HEAD_ALIGN_CLASSES = { left: 'row ycenter xleft', center: 'row ycenter xcenter', right: 'row ycenter xright' };

	function toggleSort(col: DataColumn<T>) {
		if (!col.sortable) return;
		const key = String(col.key);
		if (sortKey === key) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		else {
			sortKey = key;
			sortOrder = 'asc';
		}
	}

	const sortedRows = $derived.by(() => {
		const key = sortKey;
		if (!key) return rows;
		return [...rows].sort((a, b) => {
			const va = a[key];
			const vb = b[key];
			if (va === vb) return 0;
			if (va == null) return 1;
			if (vb == null) return -1;
			return (va > vb ? 1 : -1) * (sortOrder === 'asc' ? 1 : -1);
		});
	});
</script>

<!-- fractalstyler has no table classes; cells are padded and ruled with the
     spacing and partition-border utilities. -->
<div class="scroll-x {bordered ? 'border radius-md' : ''} {className}" {...restProps}>
	<table class="wfull text-sm">
		<thead class="bg-sunken">
			<tr>
				{#each columns as col (col.key)}
					{@const key = String(col.key)}
					<th
						scope="col"
						class="px-md py-sm bb weight-600 text-secondary {ALIGN_CLASSES[col.align ?? 'left']}"
						aria-sort={sortKey === key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
					>
						{#if col.sortable}
							<button
								type="button"
								data-variant="ghost"
								data-size="sm"
								class="px-xs gap-xs wfull {HEAD_ALIGN_CLASSES[col.align ?? 'left']}"
								onclick={() => toggleSort(col)}
							>
								<span>{col.label}</span>
								<Icon
									icon={sortKey === key ? (sortOrder === 'asc' ? luChevronUp : luChevronDown) : luChevronsUpDown}
									class={sortKey === key ? 'text-theme' : 'text-muted'}
								/>
							</button>
						{:else}
							{col.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedRows as row, r (r)}
				<tr class={striped && r % 2 === 1 ? 'bg-sunken' : ''}>
					{#each columns as col (col.key)}
						<td class="px-md py-sm bb-sub {ALIGN_CLASSES[col.align ?? 'left']}">
							{#if cell}
								{@render cell({ row, column: col, value: row[col.key as keyof T] })}
							{:else}
								{row[col.key as keyof T]}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
