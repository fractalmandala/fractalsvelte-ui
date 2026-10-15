<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SideNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: Snippet;
		badge?: string | number;
		group?: string;
		active?: boolean;
		disabled?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Array of navigation items, optionally grouped */
		items?: SideNavItem[];
		/** Whether the navigation sidebar is in compact collapsed mode */
		collapsed?: boolean;
		/** Identifier of the currently active navigation item */
		activeId?: string;
		/** Additional CSS classes */
		class?: string;
		/** Header slot at the top of the sidebar */
		header?: Snippet;
		/** Fallback or custom content slot */
		children?: Snippet;
		/** Footer slot at the bottom of the sidebar */
		footer?: Snippet;
		/** Custom renderer snippet for individual sidebar items */
		item?: Snippet<[{ item: SideNavItem; active: boolean; collapsed: boolean }]>;
	}

	let {
		items = [],
		collapsed = $bindable(false),
		activeId = $bindable(''),
		class: className = '',
		header,
		children,
		footer,
		item,
		...restProps
	}: Props = $props();

	interface GroupedItems {
		name: string | null;
		items: SideNavItem[];
	}

	const grouped = $derived.by(() => {
		const groups: GroupedItems[] = [];
		const map = new Map<string | null, SideNavItem[]>();

		for (const it of items) {
			const groupKey = it.group ?? null;
			let arr = map.get(groupKey);
			if (!arr) {
				arr = [];
				map.set(groupKey, arr);
				groups.push({ name: groupKey, items: arr });
			}
			arr.push(it);
		}
		return groups;
	});

	function isItemActive(entry: SideNavItem): boolean {
		if (activeId) {
			return entry.id === activeId;
		}
		return Boolean(entry.active);
	}

	function handleItemClick(entry: SideNavItem) {
		if (entry.disabled) return;
		activeId = entry.id;
	}
</script>

<nav
	class="f-sidenav {className}"
	data-collapsed={collapsed}
	aria-label="Sidebar Navigation"
	{...restProps}
>
	{#if header}
		<div class="f-sidenav-header">
			{@render header()}
		</div>
	{/if}

	<div class="f-sidenav-body">
		{#if items.length > 0}
			{#each grouped as g (g.name ?? 'default')}
				<div class="f-sidenav-group">
					{#if g.name && !collapsed}
						<div class="f-sidenav-group-header">
							{g.name}
						</div>
					{/if}

					<ul class="f-sidenav-list" role="list">
						{#each g.items as entry (entry.id)}
							{@const active = isItemActive(entry)}
							<li class="f-sidenav-item">
								{#if item}
									{@render item({ item: entry, active, collapsed })}
								{:else if entry.href}
									<a
										href={entry.href}
										class="f-sidenav-link"
										class:is-active={active}
										class:is-disabled={entry.disabled}
										aria-current={active ? 'page' : undefined}
										aria-disabled={entry.disabled || undefined}
										tabindex={entry.disabled ? -1 : undefined}
										title={collapsed ? entry.label : undefined}
										onclick={() => handleItemClick(entry)}
									>
										{#if entry.icon}
											<span class="f-sidenav-icon">
												{@render entry.icon()}
											</span>
										{/if}
										{#if !collapsed}
											<span class="f-sidenav-label">{entry.label}</span>
											{#if entry.badge !== undefined}
												<span class="f-sidenav-badge">{entry.badge}</span>
											{/if}
										{/if}
									</a>
								{:else}
									<button
										type="button"
										class="f-sidenav-link"
										class:is-active={active}
										disabled={entry.disabled}
										aria-current={active ? 'page' : undefined}
										title={collapsed ? entry.label : undefined}
										onclick={() => handleItemClick(entry)}
									>
										{#if entry.icon}
											<span class="f-sidenav-icon">
												{@render entry.icon()}
											</span>
										{/if}
										{#if !collapsed}
											<span class="f-sidenav-label">{entry.label}</span>
											{#if entry.badge !== undefined}
												<span class="f-sidenav-badge">{entry.badge}</span>
											{/if}
										{/if}
									</button>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if footer}
		<div class="f-sidenav-footer">
			{@render footer()}
		</div>
	{/if}
</nav>

<style>
	@layer fractalsvelte-ui.components {
		.f-sidenav {
			display: flex;
			flex-direction: column;
			height: 100%;
			background: var(--f-panel);
			color: var(--f-text);
			box-sizing: border-box;
			overflow: hidden;
		}

		.f-sidenav-header {
			padding: var(--f-space-md);
			border-bottom: 1px solid var(--f-border-subtle);
			flex-shrink: 0;
		}

		.f-sidenav-body {
			flex: 1;
			padding: var(--f-space-xs);
			overflow-y: auto;
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-md);
		}

		.f-sidenav-footer {
			padding: var(--f-space-md);
			border-top: 1px solid var(--f-border-subtle);
			flex-shrink: 0;
		}

		.f-sidenav-group {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
		}

		.f-sidenav-group-header {
			font-size: var(--f-text-xs);
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--f-text-subtle);
			padding: var(--f-space-2xs) var(--f-space-sm);
		}

		.f-sidenav-list {
			margin: 0;
			padding: 0;
			list-style: none;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
		}

		.f-sidenav-item {
			display: flex;
		}

		.f-sidenav-link {
			width: 100%;
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			padding: var(--f-space-xs) var(--f-space-sm);
			border-radius: var(--f-radius-md);
			border: none;
			background: transparent;
			color: var(--f-text-muted);
			font-family: inherit;
			font-size: var(--f-text-sm);
			font-weight: 500;
			text-decoration: none;
			cursor: pointer;
			user-select: none;
			box-sizing: border-box;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-sidenav-link:hover:not(.is-disabled):not(:disabled) {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-sidenav-link:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-sidenav-link.is-active {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			font-weight: 600;
		}

		.f-sidenav-link.is-disabled,
		.f-sidenav-link:disabled {
			opacity: 0.45;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-sidenav-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			width: 20px;
			height: 20px;
		}

		.f-sidenav-label {
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: left;
		}

		.f-sidenav-badge {
			font-size: var(--f-text-xs);
			padding: 1px 6px;
			border-radius: var(--f-radius-full);
			background: var(--f-sunken);
			color: var(--f-text-muted);
			font-weight: 600;
		}

		.f-sidenav-link.is-active .f-sidenav-badge {
			background: var(--f-primary);
			color: var(--f-primary-text);
		}

		/* Collapsed mode adjustments */
		.f-sidenav[data-collapsed='true'] .f-sidenav-link {
			justify-content: center;
			padding: var(--f-space-sm);
		}

		.f-sidenav[data-collapsed='true'] .f-sidenav-header,
		.f-sidenav[data-collapsed='true'] .f-sidenav-footer {
			padding: var(--f-space-sm);
			display: flex;
			justify-content: center;
		}
	}
</style>
