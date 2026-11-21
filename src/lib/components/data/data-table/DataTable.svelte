<!-- @component A data grid with client-side sort, filter, selection, pagination and expandable rows. -->

<script lang="ts" generics="T extends object">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import {
		luCheck,
		luChevronDown,
		luChevronLeft,
		luChevronRight,
		luChevronsLeft,
		luChevronsRight,
		luChevronsUpDown,
		luColumns3,
		luMinus,
		luSearch
	} from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { anchor, floating } from '../../../internal/helpers.js';
	import type {  ChildTextColor, ChildTextSize, Gap, Measure, Pad, Shape, Size, Surface, TextColor, TextSize  } from '../../../internal/tokens.js';
	import { createFlip, vars } from '../../../motion/index.js';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '../table/index.js';
	import type {  Density  } from '../table/table.js';
	import {
		cycleSort,
		getValue,
		matchesFilter,
		pageWindow,
		rangeKeys,
		rowId,
		selectionStatus,
		setKeys,
		sortRows,
		toggleKey,
		type Column,
		type SortRule
	} from './table-state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns: Column<T>[];
		rows: T[];
		rowKey: keyof T | ((row: T) => string);
		sort?: SortRule[];
		onSortChange?: (sort: SortRule[]) => void;
		filter?: string;
		onFilterChange?: (filter: string) => void;
		selection?: Set<string>;
		onSelectionChange?: (selection: Set<string>) => void;
		page?: number;
		onPageChange?: (page: number) => void;
		pageSize?: number;
		onPageSizeChange?: (pageSize: number) => void;
		loading?: boolean;
		empty?: Snippet;
		onRowClick?: (row: T, event: MouseEvent) => void;
		detail?: Snippet<[T]>;
		expanded?: Set<string>;
		onExpandedChange?: (expanded: Set<string>) => void;
		hiddenColumns?: Set<string>;
		onHiddenColumnsChange?: (hidden: Set<string>) => void;
		striped?: boolean;
		hoverable?: boolean;
		density?: Density;
		stickyHeader?: boolean;
		maxHeight?: Size | string;
		label?: string;
		framed?: boolean;
		caption?: string;
		captionHidden?: boolean;
		surface?: Surface;
		menuSurface?: Surface;
		shape?: Shape;
		measure?: Measure;
		gap?: Gap;
		size?: Size;
		skeletonSize?: Size;
		textSize?: TextSize;
		metaTextSize?: TextSize;
		childTextSize?: ChildTextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		stepButtonProps?: ComponentProps<typeof Button>;
		pageButtonProps?: ComponentProps<typeof Button>;
	}

	let {
		columns,
		rows,
		rowKey,
		sort = $bindable([]),
		onSortChange,
		filter = $bindable(''),
		onFilterChange,
		selection = $bindable(new Set()),
		onSelectionChange,
		page = $bindable(1),
		onPageChange,
		pageSize = $bindable(10),
		onPageSizeChange,
		loading = false,
		empty,
		onRowClick,
		detail,
		expanded = $bindable(new Set()),
		onExpandedChange,
		hiddenColumns = $bindable(undefined),
		onHiddenColumnsChange,
		striped = false,
		hoverable = true,
		density = 'cozy',
		stickyHeader = false,
		maxHeight,
		label,
		framed = true,
		caption,
		captionHidden = false,
		surface = 'outlined',
		menuSurface = 'glass',
		shape = 'modern',
		measure = 'measure-xs',
		gap = 'gap-sm',
		size = 'h-lg',
		skeletonSize = 'h-md',
		textSize = 'text-md',
		metaTextSize = 'text-sm',
		childTextSize = 'text-xs',
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		stepButtonProps,
		pageButtonProps,
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const flip = createFlip({ spring: 'snappy' });
	let lastClicked: string | null = $state(null);
	let columnsOpen = $state(false);

	const hiddenSet = $derived.by(() => {
		if (hiddenColumns) return hiddenColumns;
		return new Set(columns.filter((col) => col.hidden).map((col) => col.key));
	});

	const visibleColumns = $derived(columns.filter((col) => !hiddenSet.has(col.key)));
	const colCount = $derived(visibleColumns.length + 1 + (detail ? 1 : 0));

	const filtered = $derived(filter.trim() ? rows.filter((row) => matchesFilter(row, columns, filter)) : rows);
	const sorted = $derived(sortRows(filtered, sort, columns));

	const pageCount = $derived(Math.max(1, Math.ceil(sorted.length / Math.max(1, pageSize))));
	const safePage = $derived(Math.min(page, pageCount));
	const paged = $derived.by(() => {
		const start = (safePage - 1) * pageSize;
		return sorted.slice(start, start + pageSize);
	});
	const pageKeys = $derived(paged.map((row, i) => rowId(row, rowKey, (safePage - 1) * pageSize + i)));
	const filteredKeys = $derived(sorted.map((row, i) => rowId(row, rowKey, i)));
	const selectState = $derived(selectionStatus(pageKeys, selection));
	const pages = $derived(pageWindow(safePage, pageCount));
	const from = $derived(sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1);
	const to = $derived(Math.min(sorted.length, safePage * pageSize));
	const heading = $derived(caption ?? label ?? 'Data table');
	const skeletonCount = $derived(Math.max(3, Math.min(pageSize, 8)));

	function setSort(next: SortRule[]) {
		void flip.run(() => {
			sort = next;
			onSortChange?.(next);
		});
	}

	function setFilter(next: string) {
		filter = next;
		onFilterChange?.(next);
		if (page !== 1) {
			page = 1;
			onPageChange?.(1);
		}
	}

	function setSelection(next: Set<string>) {
		selection = next;
		onSelectionChange?.(next);
	}

	function setPage(next: number) {
		const clamped = Math.min(Math.max(1, next), pageCount);
		page = clamped;
		onPageChange?.(clamped);
	}

	function setHidden(next: Set<string>) {
		hiddenColumns = next;
		onHiddenColumnsChange?.(next);
	}

	function setExpanded(next: Set<string>) {
		expanded = next;
		onExpandedChange?.(next);
	}

	function onSortClick(key: string, event: MouseEvent) {
		setSort(cycleSort(sort, key, event.shiftKey));
	}

	function onSelectAll(event: Event) {
		const on = selectState !== 'all';
		setSelection(setKeys(selection, pageKeys, on));
		void event;
	}

	function onSelectRow(key: string, event: { shiftKey: boolean }) {
		if (event.shiftKey && lastClicked) {
			const keys = rangeKeys(filteredKeys, lastClicked, key);
			setSelection(setKeys(selection, keys, true));
		} else {
			setSelection(toggleKey(selection, key));
		}
		lastClicked = key;
	}

	function onToggleDetail(key: string) {
		setExpanded(toggleKey(expanded, key));
	}

	function onToggleColumn(key: string) {
		setHidden(toggleKey(hiddenSet, key));
	}

	function ariaSort(key: string): 'ascending' | 'descending' | 'none' {
		const rule = sort.find((item) => item.key === key);
		if (!rule) return 'none';
		return rule.direction === 'asc' ? 'ascending' : 'descending';
	}

	function headerText(col: Column<T>): string {
		return typeof col.header === 'string' ? col.header : col.key;
	}
</script>

<div class={['box', gap, className]} {@attach flip.attach} {...rest}>
	<div class="row xbetween ycenter gap-sm wrap">
		<label class="row ycenter gap-sm grow">
			<span class="sr-only">Filter {heading}</span>
			<span class={['row ycenter gap-sm grow field', surface, shape, 'pad-sm']}>
				<Icon icon={luSearch} class={['shrink-0', childTextColor]} />
				<input
					class={['input bare grow', size, textSize]}
					type="search"
					placeholder="Filter {heading.toLowerCase()}"
					value={filter}
					oninput={(event) => setFilter(event.currentTarget.value)}
				/>
			</span>
		</label>
		<div class="relative">
			<button
				type="button"
				class={['button ghost gap-sm', shape, size, metaTextSize]}
				popovertarget="{uid}-columns"
				aria-haspopup="dialog"
				aria-expanded={columnsOpen}
				{@attach anchor(uid)}
			>
				<Icon icon={luColumns3} />
				Columns
			</button>
			<div
				id="{uid}-columns"
				class={['floating at-bottom-end pop enter-scale', menuSurface, shape, 'pad-sm', measure]}
				popover="auto"
				{@attach floating(uid)}
				ontoggle={(event) => (columnsOpen = event.newState === 'open')}
			>
				<p class={[childTextSize, textColor, 'weight-600', 'pad-sm']}>Visible columns</p>
				{#each columns as col (col.key)}
					<label class="item">
						<span class="checkbox-box">
							<input
								type="checkbox"
								checked={!hiddenSet.has(col.key)}
								onchange={() => onToggleColumn(col.key)}
							/>
							{#if !hiddenSet.has(col.key)}
								<Icon icon={luCheck} />
							{/if}
						</span>
						{headerText(col)}
					</label>
				{/each}
			</div>
		</div>
	</div>

	<Table
		{striped}
		{hoverable}
		{density}
		{stickyHeader}
		{maxHeight}
		{label}
		{framed}
	>
		<TableCaption visuallyHidden={captionHidden || !caption}>{heading}</TableCaption>
		<TableHead>
			<TableRow>
				<TableHeader class="data-table-select">
					<label class="checkbox-box">
						<span class="sr-only">Select all rows on this page</span>
						<input
							type="checkbox"
							checked={selectState === 'all'}
							indeterminate={selectState === 'some'}
							disabled={loading || pageKeys.length === 0}
							onchange={onSelectAll}
						/>
						{#if selectState === 'all'}
							<Icon icon={luCheck} />
						{:else if selectState === 'some'}
							<Icon icon={luMinus} />
						{/if}
					</label>
				</TableHeader>
				{#if detail}
					<TableHeader class="data-table-select"><span class="sr-only">Expand row</span></TableHeader>
				{/if}
				{#each visibleColumns as col (col.key)}
					<TableHeader
						align={col.align}
						width={col.width}
						aria-sort={col.sortable ? ariaSort(col.key) : undefined}
					>
						{#if col.sortable}
							<button
								type="button"
								class={['bare row ycenter gap-sm pointer focus-ring weight-600', childTextSize]}
								onclick={(event) => onSortClick(col.key, event)}
							>
								{#if typeof col.header === 'string'}
									{col.header}
								{:else}
									{@render col.header()}
								{/if}
								<span
									class={[
										'caret spring spring-snappy',
										ariaSort(col.key) === 'descending' && 'open'
									]}
								>
									{#if ariaSort(col.key) === 'none'}
										<Icon icon={luChevronsUpDown} />
									{:else}
										<Icon icon={luChevronDown} />
									{/if}
								</span>
							</button>
						{:else if typeof col.header === 'string'}
							{col.header}
						{:else}
							{@render col.header()}
						{/if}
					</TableHeader>
				{/each}
			</TableRow>
		</TableHead>
		<TableBody>
			{#if loading}
				{#each Array.from({ length: skeletonCount }, (_, i) => i) as i (i)}
					<TableRow>
						<TableCell class="data-table-select"></TableCell>
						{#if detail}
							<TableCell class="data-table-select"></TableCell>
						{/if}
						{#each visibleColumns as col, c (col.key)}
							<TableCell>
								<span
									class={['block bone anim-pulse', skeletonSize, shape]}
									{@attach vars({ w: ['40%', '70%', '55%', '85%'][(i + c) % 4] })}
								></span>
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{:else if paged.length === 0}
				<TableRow>
					<TableCell class={['data-table-empty', textColor]} colspan={colCount}>
						{#if empty}
							{@render empty()}
						{:else}
							No {heading.toLowerCase()} match this filter.
						{/if}
					</TableCell>
				</TableRow>
			{:else}
				{#each paged as row, i (rowId(row, rowKey, (safePage - 1) * pageSize + i))}
					{@const key = rowId(row, rowKey, (safePage - 1) * pageSize + i)}
					{@const selected = selection.has(key)}
					{@const open = expanded.has(key)}
					<TableRow
						{selected}
						class={['motion', onRowClick && 'pointer']}
						data-flip-id={key}
						onclick={(event) => {
							const target = event.target as HTMLElement;
							if (target.closest('button, input, label, a')) return;
							onRowClick?.(row, event);
						}}
					>
						<TableCell class="data-table-select" onclick={(event) => event.stopPropagation()}>
							<label class="checkbox-box">
								<span class="sr-only">Select row {key}</span>
								<input
									type="checkbox"
									checked={selected}
									onclick={(event) => onSelectRow(key, event)}
								/>
								{#if selected}
									<Icon icon={luCheck} />
								{/if}
							</label>
						</TableCell>
						{#if detail}
							<TableCell class="data-table-select">
								<button
									type="button"
									class={['bare focus-ring caret spring spring-snappy', open && 'open']}
									aria-expanded={open}
									aria-controls="{uid}-detail-{key}"
									aria-label={open ? 'Collapse row' : 'Expand row'}
									onclick={(event) => {
										event.stopPropagation();
										onToggleDetail(key);
									}}
								>
									<Icon icon={luChevronDown} />
								</button>
							</TableCell>
						{/if}
						{#each visibleColumns as col (col.key)}
							{@const value = getValue(row, col)}
							<TableCell align={col.align} numeric={col.align === 'right'}>
								{#if col.cell}
									{@render col.cell({ row, value, index: (safePage - 1) * pageSize + i })}
								{:else}
									{value == null ? '' : String(value)}
								{/if}
							</TableCell>
						{/each}
					</TableRow>
					{#if detail}
						<TableRow>
							<TableCell class="flush" colspan={colCount}>
								<div
									id="{uid}-detail-{key}"
									class={['collapse spring spring-snappy', open && 'open']}
								>
									<div>
										<div>{@render detail(row)}</div>
									</div>
								</div>
							</TableCell>
						</TableRow>
					{/if}
				{/each}
			{/if}
		</TableBody>
	</Table>

	<div class="row xbetween ycenter gap-sm wrap">
		<p class={[metaTextSize, childTextColor, 'tabular-nums']}>
			{from}–{to} of {sorted.length}
			{#if selection.size > 0}
				· {selection.size} selected
			{/if}
		</p>
		<div class="row gap-xs ycenter">
			<Button
				variant="ghost"
				size="h-sm"
				icon={luChevronsLeft}
				disabled={safePage <= 1}
				aria-label="First page"
				onclick={() => setPage(1)}
				{...stepButtonProps}
				class="btn-icon {stepButtonProps?.class ?? ''}"
			/>
			<Button
				variant="ghost"
				size="h-sm"
				icon={luChevronLeft}
				disabled={safePage <= 1}
				aria-label="Previous page"
				onclick={() => setPage(safePage - 1)}
				{...stepButtonProps}
				class="btn-icon {stepButtonProps?.class ?? ''}"
			/>
			{#each pages as n (n)}
				<Button
					variant={n === safePage ? 'secondary' : 'ghost'}
					size="h-sm"
					aria-label="Page {n}"
					aria-current={n === safePage ? 'page' : undefined}
					onclick={() => setPage(n)}
					{...pageButtonProps}
				>
					{n}
				</Button>
			{/each}
			<Button
				variant="ghost"
				size="h-sm"
				icon={luChevronRight}
				disabled={safePage >= pageCount}
				aria-label="Next page"
				onclick={() => setPage(safePage + 1)}
				{...stepButtonProps}
				class="btn-icon {stepButtonProps?.class ?? ''}"
			/>
			<Button
				variant="ghost"
				size="h-sm"
				icon={luChevronsRight}
				disabled={safePage >= pageCount}
				aria-label="Last page"
				onclick={() => setPage(pageCount)}
				{...stepButtonProps}
				class="btn-icon {stepButtonProps?.class ?? ''}"
			/>
		</div>
	</div>
</div>
