<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TreeItem {
		id: string;
		label: string;
		icon?: Snippet;
		children?: TreeItem[];
		expanded?: boolean;
		selected?: boolean;
		disabled?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Hierarchical nested items representing tree hierarchy */
		items?: TreeItem[];
		/** Identifier of the currently selected tree leaf or node */
		selectedId?: string;
		/** Array of item identifiers whose children are expanded */
		expandedIds?: string[];
		/** Additional CSS classes */
		class?: string;
		/** Custom renderer snippet for each tree item row */
		item?: Snippet<[{ item: TreeItem; level: number; expanded: boolean; selected: boolean }]>;
		/** Custom icon renderer snippet */
		icon?: Snippet<[{ item: TreeItem; expanded: boolean; isFolder: boolean }]>;
	}

	let {
		items = [],
		selectedId = $bindable(''),
		expandedIds = $bindable([]),
		class: className = '',
		item,
		icon,
		...restProps
	}: Props = $props();

	function isExpanded(id: string, defaultExpanded?: boolean): boolean {
		if (expandedIds.includes(id)) return true;
		return Boolean(defaultExpanded && !expandedIds.length);
	}

	function toggleExpand(id: string, defaultExpanded?: boolean) {
		const currentlyExpanded = isExpanded(id, defaultExpanded);
		if (currentlyExpanded) {
			expandedIds = expandedIds.filter((x) => x !== id);
		} else {
			expandedIds = [...expandedIds, id];
		}
	}

	function selectItem(entry: TreeItem) {
		if (entry.disabled) return;
		selectedId = entry.id;
	}
</script>

<div
	class="f-tree {className}"
	role="tree"
	aria-label="Hierarchical Tree"
	{...restProps}
>
	{#snippet renderTree(nodes: TreeItem[], level: number)}
		<ul class="f-tree-group" role="group">
			{#each nodes as node (node.id)}
				{@const hasChildren = Boolean(node.children && node.children.length > 0)}
				{@const expandedState = isExpanded(node.id, node.expanded)}
				{@const isSelected = node.id === selectedId}

				<li
					class="f-tree-node"
					role="treeitem"
					aria-expanded={hasChildren ? expandedState : undefined}
					aria-selected={isSelected}
					aria-disabled={node.disabled || undefined}
				>
					<div
						class="f-tree-row"
						class:is-selected={isSelected}
						class:is-disabled={node.disabled}
						style="--tree-level: {level};"
						onclick={() => selectItem(node)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								selectItem(node);
							}
						}}
						tabindex={node.disabled ? -1 : 0}
						role="button"
					>
						<!-- Indent Spacer -->
						<span
							class="f-tree-indent"
							style="width: calc(var(--tree-level) * var(--f-space-md));"
							aria-hidden="true"
						></span>

						<!-- Expand / Collapse Arrow -->
						{#if hasChildren}
							<button
								type="button"
								class="f-tree-arrow"
								class:is-open={expandedState}
								aria-label={expandedState ? 'Collapse' : 'Expand'}
								tabindex="-1"
								onclick={(e) => {
									e.stopPropagation();
									toggleExpand(node.id, node.expanded);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</button>
						{:else}
							<span class="f-tree-arrow-placeholder" aria-hidden="true"></span>
						{/if}

						<!-- Custom or Default Item -->
						{#if item}
							{@render item({
								item: node,
								level,
								expanded: expandedState,
								selected: isSelected
							})}
						{:else}
							{#if icon}
								{@render icon({ item: node, expanded: expandedState, isFolder: hasChildren })}
							{:else if node.icon}
								<span class="f-tree-icon">
									{@render node.icon()}
								</span>
							{/if}

							<span class="f-tree-label">{node.label}</span>
						{/if}
					</div>

					<!-- Child Nodes -->
					{#if hasChildren && expandedState}
						<div class="f-tree-children">
							{@render renderTree(node.children!, level + 1)}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/snippet}

	{#if items.length > 0}
		{@render renderTree(items, 0)}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-tree {
			display: flex;
			flex-direction: column;
			width: 100%;
			box-sizing: border-box;
			user-select: none;
		}

		.f-tree-group {
			margin: 0;
			padding: 0;
			list-style: none;
			display: flex;
			flex-direction: column;
		}

		.f-tree-node {
			display: flex;
			flex-direction: column;
		}

		.f-tree-row {
			display: flex;
			align-items: center;
			gap: var(--f-space-2xs);
			padding: var(--f-space-2xs) var(--f-space-xs);
			border-radius: var(--f-radius-sm);
			cursor: pointer;
			color: var(--f-text);
			font-size: var(--f-text-sm);
			box-sizing: border-box;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-tree-row:hover:not(.is-disabled) {
			background: var(--f-hover);
		}

		.f-tree-row:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: -1px;
		}

		.f-tree-row.is-selected {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			font-weight: 600;
		}

		.f-tree-row.is-disabled {
			opacity: 0.45;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-tree-indent {
			display: inline-block;
			flex-shrink: 0;
		}

		.f-tree-arrow {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			background: transparent;
			border: none;
			color: var(--f-text-muted);
			cursor: pointer;
			padding: 0;
			border-radius: var(--f-radius-xs);
			transition: transform var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
			flex-shrink: 0;
		}

		.f-tree-arrow:hover {
			color: var(--f-text);
			background: var(--f-sunken);
		}

		.f-tree-arrow.is-open {
			transform: rotate(90deg);
		}

		.f-tree-arrow-placeholder {
			width: 20px;
			height: 20px;
			flex-shrink: 0;
		}

		.f-tree-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 18px;
			height: 18px;
			flex-shrink: 0;
			color: var(--f-text-muted);
		}

		.f-tree-label {
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.f-tree-children {
			position: relative;
		}

		.f-tree-children::before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 8px;
			left: calc(var(--tree-level, 0) * var(--f-space-md) + 9px);
			width: 1px;
			background: var(--f-border-subtle);
		}
	}
</style>
