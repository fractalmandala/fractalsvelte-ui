<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface BottomNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: Snippet;
		badge?: string | number;
		active?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: BottomNavItem[];
		activeId?: string;
		class?: string;
		children?: Snippet;
		item?: Snippet<[{ item: BottomNavItem; active: boolean }]>;
	}

	let { items = [], activeId = $bindable(''), class: className = '', children, item, ...restProps }: Props = $props();

	const isActive = (entry: BottomNavItem) => (activeId ? entry.id === activeId : Boolean(entry.active));
</script>

{#snippet body(entry: BottomNavItem)}
	<span class="row ycenter gap-xs text-lg">
		{@render entry.icon?.()}
		{#if entry.badge !== undefined}<span class="chip bg-danger text-white">{entry.badge}</span>{/if}
	</span>
	<span class="text-sm weight-500">{entry.label}</span>
{/snippet}

<!-- fractalstyler has no offset utilities, so the bar does not pin itself to
     the viewport; place it at the bottom of your layout (e.g. AppShell footer). -->
<nav class="wfull bt bg-surface {className}" aria-label="Bottom navigation" {...restProps}>
	<div role="list" class="row xaround ycenter py-xs">
		{#each items as entry (entry.id)}
			{@const active = isActive(entry)}
			<div role="listitem" class="row">
				{#if item}
					{@render item({ item: entry, active })}
				{:else if entry.href}
					<a
						href={entry.disabled ? undefined : entry.href}
						class="box xcenter gap-xs px-sm py-xs radius-sm {active ? 'text-theme' : entry.disabled ? 'text-muted' : 'text-secondary'}"
						aria-current={active ? 'page' : undefined}
						aria-disabled={entry.disabled || undefined}
						onclick={() => !entry.disabled && (activeId = entry.id)}
					>
						{@render body(entry)}
					</a>
				{:else}
					<button
						type="button"
						data-variant="ghost"
						data-shape="modern"
						class="h-lg px-sm"
						disabled={entry.disabled}
						aria-current={active ? 'page' : undefined}
						onclick={() => (activeId = entry.id)}
					>
						<!-- Ink lives on the inner box: button[data-variant] would override it. -->
						<span class="box xcenter gap-xs {active ? 'text-theme' : 'text-secondary'}">{@render body(entry)}</span>
					</button>
				{/if}
			</div>
		{/each}
	</div>
	{@render children?.()}
</nav>
