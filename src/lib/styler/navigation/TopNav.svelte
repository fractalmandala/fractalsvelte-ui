<script lang="ts" module>
	export interface NavItem {
		id?: string;
		label: string;
		href?: string;
		active?: boolean;
		disabled?: boolean;
		badge?: string | number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TopNavVariant = 'underline' | 'pills' | 'subtle';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: NavItem[];
		activeId?: string;
		variant?: TopNavVariant;
		/** fractalstyler's .header-nav treatment: uppercased md links */
		uppercase?: boolean;
		class?: string;
		children?: Snippet;
		item?: Snippet<[{ item: NavItem; active: boolean }]>;
	}

	let {
		items = [],
		activeId = $bindable(''),
		variant = 'underline',
		uppercase = false,
		class: className = '',
		children,
		item,
		...restProps
	}: Props = $props();

	const ACTIVE_CLASSES: Record<TopNavVariant, string> = {
		underline: 'text-theme bb-str',
		pills: 'bg-sunken text-primary',
		subtle: 'text-primary weight-600'
	};

	const BUTTON_ACTIVE_CLASSES: Record<TopNavVariant, string> = {
		underline: 'text-theme bb-str',
		pills: 'text-primary',
		subtle: 'text-primary weight-600'
	};

	const keyOf = (entry: NavItem, i: number) => entry.id ?? String(i);
	const isActive = (entry: NavItem, i: number) => (activeId ? keyOf(entry, i) === activeId : Boolean(entry.active));
</script>

<nav class="{uppercase ? 'header-nav' : ''} {className}" aria-label="Main navigation" {...restProps}>
	<div role="list" class="row ycenter gap-xs wrap">
		{#each items as entry, i (keyOf(entry, i))}
			{@const active = isActive(entry, i)}
			<div role="listitem" class="row">
				{#if item}
					{@render item({ item: entry, active })}
				{:else if entry.href}
					<a
						href={entry.disabled ? undefined : entry.href}
						class="nav-link row ycenter gap-xs {active ? ACTIVE_CLASSES[variant] : entry.disabled ? 'text-muted' : 'text-secondary'}"
						aria-current={active ? 'page' : undefined}
						aria-disabled={entry.disabled || undefined}
						onclick={() => !entry.disabled && (activeId = keyOf(entry, i))}
					>
						{entry.label}
						{#if entry.badge !== undefined}<span class="chip bg-sunken text-secondary">{entry.badge}</span>{/if}
					</a>
				{:else}
					<!-- Pills swap the variant for the fill; ink and the underline rule sit
					     on the inner label, where button[data-variant] cannot override them. -->
					<button
						type="button"
						data-variant={active && variant === 'pills' ? 'secondary' : 'ghost'}
						data-size="lg"
						data-shape="modern"
						class="nav-link"
						disabled={entry.disabled}
						aria-current={active ? 'page' : undefined}
						onclick={() => (activeId = keyOf(entry, i))}
					>
						<span class="row ycenter gap-xs {active ? BUTTON_ACTIVE_CLASSES[variant] : 'text-secondary'}">
							{entry.label}
							{#if entry.badge !== undefined}<span class="chip bg-sunken text-secondary">{entry.badge}</span>{/if}
						</span>
					</button>
				{/if}
			</div>
		{/each}
	</div>
	{@render children?.()}
</nav>
