<!-- @component A nested, expandable tree of items. -->

<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface TreeItem {
		id: string;
		label: string;
		icon?: Snippet;
		children?: TreeItem[];
		expanded?: boolean;
		selected?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronRight, luChevronDown } from '@fractaldesign/icons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: TreeItem[];
		selectedId?: string;
		expandedIds?: string[];
		label?: string;
		class?: string;
		item?: Snippet<[{ item: TreeItem; level: number; expanded: boolean; selected: boolean }]>;
		icon?: Snippet<[{ item: TreeItem; expanded: boolean; isFolder: boolean }]>;
	}

	let {
		items = [],
		selectedId = $bindable(''),
		expandedIds = $bindable([]),
		label = 'Tree',
		class: className = '',
		item,
		icon,
		...restProps
	}: Props = $props();

	// Items marked expanded start open, once.
	let seeded = false;
	$effect.pre(() => {
		if (seeded) return;
		seeded = true;
		const walk = (nodes: TreeItem[]): string[] =>
			nodes.flatMap((n) => [...(n.expanded ? [n.id] : []), ...walk(n.children ?? [])]);
		const initial = walk(items).filter((id) => !expandedIds.includes(id));
		if (initial.length) expandedIds = [...expandedIds, ...initial];
	});

	const isOpen = (id: string) => expandedIds.includes(id);
	function toggle(id: string) {
		expandedIds = isOpen(id) ? expandedIds.filter((x) => x !== id) : [...expandedIds, id];
	}

	function onkeydown(e: KeyboardEvent, node: TreeItem, hasChildren: boolean) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (!node.disabled) selectedId = node.id;
		} else if (e.key === 'ArrowRight' && hasChildren && !isOpen(node.id)) {
			e.preventDefault();
			toggle(node.id);
		} else if (e.key === 'ArrowLeft' && hasChildren && isOpen(node.id)) {
			e.preventDefault();
			toggle(node.id);
		}
	}
</script>

<!-- Indentation comes from nesting: every child group adds .pl-md, so depth
     accumulates without a computed width. -->
{#snippet branch(nodes: TreeItem[], level: number)}
	{#each nodes as node (node.id)}
		{@const hasChildren = Boolean(node.children?.length)}
		{@const expanded = hasChildren && isOpen(node.id)}
		{@const selected = node.id === selectedId}
		<div
			role="treeitem"
			aria-expanded={hasChildren ? expanded : undefined}
			aria-selected={selected}
			aria-disabled={node.disabled || undefined}
			tabindex={node.disabled ? -1 : 0}
			class="box"
			onkeydown={(e) => {
				if (e.target === e.currentTarget) onkeydown(e, node, hasChildren);
			}}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (keys live on the treeitem) -->
			<div
				class="row ycenter gap-xs px-xs py-xs radius-sm text-sm {selected
					? 'bg-sunken text-theme weight-500'
					: node.disabled
						? 'text-muted'
						: 'text-primary'}"
				onclick={() => !node.disabled && (selectedId = node.id)}
			>
				{#if hasChildren}
					<button
						type="button"
						data-variant="iconbox"
						data-size="sm"
						class="px-xs text-muted"
						tabindex="-1"
						aria-label={expanded ? 'Collapse' : 'Expand'}
						onclick={(e) => {
							e.stopPropagation();
							toggle(node.id);
						}}
					>
						<Icon icon={expanded ? luChevronDown : luChevronRight} />
					</button>
				{:else}
					<span class="frame-1-1 h-sm shrink-0" aria-hidden="true"></span>
				{/if}
				{#if item}
					{@render item({ item: node, level, expanded, selected })}
				{:else}
					{#if icon}
						{@render icon({ item: node, expanded, isFolder: hasChildren })}
					{:else if node.icon}
						<span class="row ycenter shrink-0 text-muted">{@render node.icon()}</span>
					{/if}
					<span class="truncate">{node.label}</span>
				{/if}
			</div>
			{#if expanded}
				<div role="group" class="box pl-md">
					{@render branch(node.children!, level + 1)}
				</div>
			{/if}
		</div>
	{/each}
{/snippet}

<div role="tree" aria-label={label} class="box {className}" {...restProps}>
	{@render branch(items, 0)}
</div>
