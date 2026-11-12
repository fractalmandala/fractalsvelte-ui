<!-- @component A hierarchical tree view with keyboard navigation, lazy children and optional checkboxes. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luChevronRight, luLoaderCircle, luMinus } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import {
		asSet,
		checkState,
		childrenOf,
		findItem,
		flattenVisible,
		isExpandable,
		toggleChecked,
		type TreeItem
	} from './tree.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The root nodes of the tree. */
		items: TreeItem[];
		/** The ids of expanded nodes. */
		expanded?: Set<string>;
		/** Called when a node is expanded or collapsed. */
		onExpandedChange?: (expanded: Set<string>) => void;
		/** The selected id (single) or ids (`multiple`). */
		selected?: string | Set<string> | null;
		/** Called when the selection changes. */
		onSelectedChange?: (selected: string | Set<string> | null) => void;
		/** Allow more than one node to be selected. */
		multiple?: boolean;
		/** Show a tri-state checkbox on each node, with parent–child propagation. */
		checkable?: boolean;
		/** The ids of checked nodes. */
		checked?: Set<string>;
		/** Called when a checkbox is toggled. */
		onCheckedChange?: (checked: Set<string>) => void;
		/** Load children when an unloaded expandable node is first opened. */
		loadChildren?: (item: TreeItem) => Promise<TreeItem[]>;
		/** Names the tree for assistive technology. */
		label?: string;
	}

	let {
		items,
		expanded = $bindable(new Set()),
		onExpandedChange,
		selected = $bindable(null),
		onSelectedChange,
		multiple = false,
		checkable = false,
		checked = $bindable(new Set()),
		onCheckedChange,
		loadChildren,
		label,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let loaded = $state(new Map<string, TreeItem[]>());
	let loading = $state(new Set<string>());
	let focused = $state<string | null>(null);
	let typeBuffer = $state('');
	let typeTimer: ReturnType<typeof setTimeout> | undefined;

	const canLoad = $derived(typeof loadChildren === 'function');
	const visible = $derived(flattenVisible(items, expanded, loaded, canLoad));
	const selectedSet = $derived(asSet(selected));

	$effect(() => {
		return () => clearTimeout(typeTimer);
	});

	function setExpanded(next: Set<string>) {
		expanded = next;
		onExpandedChange?.(next);
	}

	function emitSelected(next: Set<string>) {
		if (multiple) {
			selected = next;
			onSelectedChange?.(next);
		} else {
			const value = next.size ? (next.values().next().value ?? null) : null;
			selected = value;
			onSelectedChange?.(value);
		}
	}

	function setChecked(next: Set<string>) {
		checked = next;
		onCheckedChange?.(next);
	}

	function focusId(id: string) {
		focused = id;
		queueMicrotask(() => {
			const el = document.getElementById(`${uid}-${id}`);
			el?.focus();
		});
	}

	async function expandTo(id: string, open: boolean) {
		const next = new Set(expanded);
		if (open) next.add(id);
		else next.delete(id);
		setExpanded(next);
		if (open && loadChildren) {
			const item = findItem(items, id, loaded);
			if (item && childrenOf(item, loaded).length === 0 && isExpandable(item, loaded, canLoad)) {
				const pending = new Set(loading);
				pending.add(id);
				loading = pending;
				try {
					const kids = await loadChildren(item);
					const map = new Map(loaded);
					map.set(id, kids);
					loaded = map;
				} finally {
					const done = new Set(loading);
					done.delete(id);
					loading = done;
				}
			}
		}
	}

	function selectItem(item: TreeItem, event?: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean }) {
		if (item.disabled) return;
		if (multiple && (event?.metaKey || event?.ctrlKey)) {
			const next = new Set(selectedSet);
			if (next.has(item.id)) next.delete(item.id);
			else next.add(item.id);
			emitSelected(next);
		} else if (multiple && event?.shiftKey && focused) {
			const ids = visible.map((node) => node.item.id);
			const a = ids.indexOf(focused);
			const b = ids.indexOf(item.id);
			if (a >= 0 && b >= 0) {
				const next = new Set(selectedSet);
				const [lo, hi] = a < b ? [a, b] : [b, a];
				for (let i = lo; i <= hi; i += 1) next.add(ids[i]!);
				emitSelected(next);
			} else {
				emitSelected(new Set([item.id]));
			}
		} else {
			emitSelected(new Set([item.id]));
		}
		focusId(item.id);
	}

	function onCheck(item: TreeItem, on: boolean) {
		if (item.disabled) return;
		setChecked(toggleChecked(checked, item, items, loaded, on));
	}

	function expandSiblings(id: string) {
		const node = visible.find((entry) => entry.item.id === id);
		if (!node) return;
		const siblings = node.parent ? childrenOf(node.parent, loaded) : items;
		const next = new Set(expanded);
		for (const sib of siblings) {
			if (isExpandable(sib, loaded, canLoad) && !sib.disabled) next.add(sib.id);
		}
		setExpanded(next);
		for (const sib of siblings) {
			if (isExpandable(sib, loaded, canLoad) && !sib.disabled && childrenOf(sib, loaded).length === 0) {
				void expandTo(sib.id, true);
			}
		}
	}

	function typeahead(ch: string) {
		typeBuffer += ch.toLowerCase();
		clearTimeout(typeTimer);
		typeTimer = setTimeout(() => (typeBuffer = ''), 500);
		const ids = visible.filter((node) => !node.item.disabled);
		if (ids.length === 0) return;
		const start = ids.findIndex((node) => node.item.id === focused);
		const ordered = [...ids.slice(start + (typeBuffer.length === 1 ? 1 : 0)), ...ids.slice(0, start + (typeBuffer.length === 1 ? 1 : 0))];
		const match = ordered.find((node) => node.item.label.toLowerCase().startsWith(typeBuffer));
		if (match) {
			selectItem(match.item);
			focusId(match.item.id);
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (visible.length === 0) return;
		const index = visible.findIndex((node) => node.item.id === focused);
		const current = index >= 0 ? visible[index] : visible[0];
		if (!current) return;
		const enabled = (from: number, step: number) => {
			for (let i = from; i >= 0 && i < visible.length; i += step) {
				const node = visible[i];
				if (node && !node.item.disabled) return node;
			}
			return null;
		};

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			const next = enabled(Math.max(index, 0) + 1, 1);
			if (next) focusId(next.item.id);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			const next = enabled((index < 0 ? visible.length : index) - 1, -1);
			if (next) focusId(next.item.id);
		} else if (event.key === 'Home') {
			event.preventDefault();
			const next = enabled(0, 1);
			if (next) focusId(next.item.id);
		} else if (event.key === 'End') {
			event.preventDefault();
			const next = enabled(visible.length - 1, -1);
			if (next) focusId(next.item.id);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (isExpandable(current.item, loaded, canLoad) && !current.item.disabled) {
				if (!expanded.has(current.item.id)) void expandTo(current.item.id, true);
				else {
					const first = childrenOf(current.item, loaded).find((child) => !child.disabled);
					if (first) focusId(first.id);
				}
			}
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			if (expanded.has(current.item.id) && isExpandable(current.item, loaded, canLoad)) {
				void expandTo(current.item.id, false);
			} else if (current.parent) {
				focusId(current.parent.id);
			}
		} else if (event.key === '*') {
			event.preventDefault();
			expandSiblings(current.item.id);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (isExpandable(current.item, loaded, canLoad) && !current.item.disabled) {
				void expandTo(current.item.id, !expanded.has(current.item.id));
			} else {
				selectItem(current.item, event);
			}
		} else if (event.key === ' ') {
			event.preventDefault();
			if (checkable) onCheck(current.item, checkState(current.item, checked, loaded) !== 'checked');
			else selectItem(current.item, event);
		} else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			typeahead(event.key);
		}
	}

	function onFocusIn(event: FocusEvent) {
		const id = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')?.dataset.treeId;
		if (id) focused = id;
	}
</script>

{#snippet branch(nodes: TreeItem[], level: number)}
	{#each nodes as item (item.id)}
		{@const open = expanded.has(item.id)}
		{@const expandable = isExpandable(item, loaded, canLoad)}
		{@const isSelected = selectedSet.has(item.id)}
		{@const box = checkable ? checkState(item, checked, loaded) : 'unchecked'}
		{@const busy = loading.has(item.id)}
		<div>
			<!-- svelte-ignore a11y_click_events_have_key_events -- keyboard is handled on the tree root -->
			<div
				id="{uid}-{item.id}"
				class={['item indent', item.disabled && 'disabled']}
				role="treeitem"
				data-tree-id={item.id}
				tabindex={focused === item.id || (focused == null && item.id === visible[0]?.item.id) ? 0 : -1}
				aria-level={level + 1}
				aria-selected={isSelected}
				aria-expanded={expandable ? open : undefined}
				aria-disabled={item.disabled || undefined}
				aria-checked={checkable ? (box === 'mixed' ? 'mixed' : box === 'checked') : undefined}
				aria-busy={busy || undefined}
				{@attach vars({ level })}
				onclick={(event) => {
					if (item.disabled) return;
					if ((event.target as HTMLElement).closest('button, input, label, .checkbox-box')) return;
					selectItem(item, event);
				}}
			>
				{#if expandable}
					<button
						type="button"
						class={['bare focus-ring caret quarter spring spring-snappy', open && 'open']}
						tabindex={-1}
						disabled={item.disabled}
						aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
						onclick={(event) => {
							event.stopPropagation();
							void expandTo(item.id, !open);
						}}
					>
						{#if busy}
							<Icon icon={luLoaderCircle} class="anim-spin" />
						{:else}
							<Icon icon={luChevronRight} />
						{/if}
					</button>
				{/if}
				{#if checkable}
					<label class="checkbox-box">
						<span class="sr-only">Check {item.label}</span>
						<input
							type="checkbox"
							checked={box === 'checked'}
							indeterminate={box === 'mixed'}
							disabled={item.disabled}
							tabindex={-1}
							onclick={(event) => {
								event.stopPropagation();
								onCheck(item, box !== 'checked');
							}}
						/>
						{#if box === 'checked'}
							<Icon icon={luCheck} />
						{:else if box === 'mixed'}
							<Icon icon={luMinus} />
						{/if}
					</label>
				{/if}
				{#if item.icon}
					<Icon icon={item.icon} />
				{/if}
				<span class="truncate">{item.label}</span>
			</div>
			{#if expandable}
				<div class={['collapse spring spring-snappy', open && 'open']} role="group">
					<div>
						{@render branch(childrenOf(item, loaded), level + 1)}
					</div>
				</div>
			{/if}
		</div>
	{/each}
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -- the tree handles its own keyboard -->
<div
	class={['box', klass]}
	role="tree"
	aria-label={label}
	aria-multiselectable={multiple || undefined}
	onkeydown={onKeydown}
	onfocusin={onFocusIn}
	{...rest}
>
	{@render branch(items, 0)}
</div>
