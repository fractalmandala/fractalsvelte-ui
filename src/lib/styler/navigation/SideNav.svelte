<!-- @component A vertical navigation list with groups, badges and an icon-only mode. -->

<script lang="ts" module>
	import type { Snippet } from 'svelte';

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
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: SideNavItem[];
		/** Icon-only mode; labels move to the native title tooltip */
		collapsed?: boolean;
		activeId?: string;
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
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

	const grouped = $derived.by(() => {
		const groups: { name: string | null; items: SideNavItem[] }[] = [];
		const map = new Map<string | null, SideNavItem[]>();
		for (const it of items) {
			const key = it.group ?? null;
			let arr = map.get(key);
			if (!arr) {
				arr = [];
				map.set(key, arr);
				groups.push({ name: key, items: arr });
			}
			arr.push(it);
		}
		return groups;
	});

	const isActive = (entry: SideNavItem) => (activeId ? entry.id === activeId : Boolean(entry.active));
</script>

{#snippet linkBody(entry: SideNavItem)}
	{#if entry.icon}<span class="row ycenter shrink-0 text-bs" aria-hidden="true">{@render entry.icon()}</span>{/if}
	{#if !collapsed}
		<span class="grow min0 truncate ta-l">{entry.label}</span>
		{#if entry.badge !== undefined}<span class="chip bg-sunken text-secondary shrink-0">{entry.badge}</span>{/if}
	{/if}
{/snippet}

<nav class="box gap-md {className}" aria-label="Sidebar navigation" {...restProps}>
	{#if header}<div class="row ycenter gap-sm px-sm">{@render header()}</div>{/if}
	<div class="box gap-md grow min0">
		{#each grouped as g (g.name ?? '')}
			<!-- .nav-section is fractalstyler's vertical nav block (xs gap). -->
			<div class="nav-section">
				{#if g.name && !collapsed}<span class="nav-header text-muted tt-u ls-wide-lg">{g.name}</span>{/if}
				<div role="list" class="box gap-xs">
					{#each g.items as entry (entry.id)}
						{@const active = isActive(entry)}
						<div role="listitem" class="box">
							{#if item}
								{@render item({ item: entry, active, collapsed })}
							{:else if entry.href}
								<a
									href={entry.disabled ? undefined : entry.href}
									class="nav-link row ycenter gap-sm {collapsed ? 'xcenter' : ''} {active
										? 'bg-sunken text-theme weight-500'
										: entry.disabled
											? 'text-muted'
											: 'text-secondary'}"
									aria-current={active ? 'page' : undefined}
									aria-disabled={entry.disabled || undefined}
									title={collapsed ? entry.label : undefined}
									onclick={() => !entry.disabled && (activeId = entry.id)}
								>
									{@render linkBody(entry)}
								</a>
							{:else}
								<!-- The active fill is a variant swap (ghost → secondary) and the ink
								     sits on the inner row: button[data-variant] outranks .bg-* / .text-*. -->
								<button
									type="button"
									data-variant={active ? 'secondary' : 'ghost'}
									data-shape="modern"
									class="nav-link row ycenter py-sm px-sm wfull {collapsed ? 'xcenter' : 'xleft'}"
									disabled={entry.disabled}
									aria-current={active ? 'page' : undefined}
									title={collapsed ? entry.label : undefined}
									onclick={() => (activeId = entry.id)}
								>
									<span class="row ycenter gap-sm grow min0 {active ? 'text-theme weight-500' : 'text-secondary'}">
										{@render linkBody(entry)}
									</span>
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
		{@render children?.()}
	</div>
	{#if footer}<div class="box gap-xs pt-sm bt">{@render footer()}</div>{/if}
</nav>
