<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	export interface NavItem {
		id?: string;
		label: string;
		href?: string;
		active?: boolean;
		disabled?: boolean;
		badge?: string | number;
	}

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Array of navigation link items */
		items?: NavItem[];
		/** Identifier of the currently active navigation item */
		activeId?: string;
		/** Visual styling style for navigation links and indicator */
		variant?: 'underline' | 'pills' | 'subtle';
		/** Scale tier for font size and padding */
		size?: Size;
		/** Additional CSS classes */
		class?: string;
		/** Slot for custom navigation link elements */
		children?: Snippet;
		/** Custom renderer for individual navigation items */
		item?: Snippet<[{ item: NavItem; active: boolean }]>;
	}

	let {
		items = [],
		activeId = $bindable(''),
		variant = 'underline',
		size = 'md',
		class: className = '',
		children,
		item,
		...restProps
	}: Props = $props();

	function isItemActive(entry: NavItem, index: number): boolean {
		if (activeId) {
			return (entry.id ?? String(index)) === activeId;
		}
		return Boolean(entry.active);
	}

	function handleItemClick(entry: NavItem, index: number) {
		if (entry.disabled) return;
		activeId = entry.id ?? String(index);
	}
</script>

<nav
	class="f-top-nav {className}"
	data-variant={variant}
	data-size={size}
	aria-label="Main Navigation"
	{...restProps}
>
	{#if items.length > 0}
		<ul class="f-top-nav-list" role="list">
			{#each items as entry, i (entry.id ?? i)}
				{@const active = isItemActive(entry, i)}
				<li class="f-top-nav-item">
					{#if item}
						{@render item({ item: entry, active })}
					{:else if entry.href}
						<a
							href={entry.href}
							class="f-top-nav-link"
							class:is-active={active}
							class:is-disabled={entry.disabled}
							aria-current={active ? 'page' : undefined}
							aria-disabled={entry.disabled || undefined}
							tabindex={entry.disabled ? -1 : undefined}
							onclick={() => handleItemClick(entry, i)}
						>
							<span class="f-top-nav-label">{entry.label}</span>
							{#if entry.badge !== undefined}
								<span class="f-top-nav-badge">{entry.badge}</span>
							{/if}
						</a>
					{:else}
						<button
							type="button"
							class="f-top-nav-link"
							class:is-active={active}
							disabled={entry.disabled}
							aria-current={active ? 'page' : undefined}
							onclick={() => handleItemClick(entry, i)}
						>
							<span class="f-top-nav-label">{entry.label}</span>
							{#if entry.badge !== undefined}
								<span class="f-top-nav-badge">{entry.badge}</span>
							{/if}
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</nav>

<style>
	@layer fractalsvelte-ui.components {
		.f-top-nav {
			display: inline-flex;
			align-items: center;
			box-sizing: border-box;
		}

		.f-top-nav-list {
			display: flex;
			align-items: center;
			margin: 0;
			padding: 0;
			list-style: none;
			gap: var(--f-space-2xs);
		}

		.f-top-nav-item {
			display: inline-flex;
			align-items: center;
			position: relative;
		}

		.f-top-nav-link {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-2xs);
			background: transparent;
			border: none;
			cursor: pointer;
			font-family: inherit;
			text-decoration: none;
			color: var(--f-text-muted);
			font-weight: 500;
			position: relative;
			transition: color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
			user-select: none;
		}

		.f-top-nav-link:hover:not(.is-disabled):not(:disabled) {
			color: var(--f-text);
		}

		.f-top-nav-link:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
			border-radius: var(--f-radius-sm);
		}

		.f-top-nav-link.is-disabled,
		.f-top-nav-link:disabled {
			opacity: 0.45;
			cursor: not-allowed;
			pointer-events: none;
		}

		/* Sizes */
		.f-top-nav[data-size='xs'] .f-top-nav-link {
			font-size: var(--f-text-xs);
			padding: var(--f-space-3xs) var(--f-space-xs);
		}

		.f-top-nav[data-size='sm'] .f-top-nav-link {
			font-size: var(--f-text-sm);
			padding: var(--f-space-2xs) var(--f-space-sm);
		}

		.f-top-nav[data-size='md'] .f-top-nav-link {
			font-size: var(--f-text-base);
			padding: var(--f-space-xs) var(--f-space-md);
		}

		.f-top-nav[data-size='lg'] .f-top-nav-link {
			font-size: var(--f-text-lg);
			padding: var(--f-space-sm) var(--f-space-lg);
		}

		.f-top-nav[data-size='xl'] .f-top-nav-link {
			font-size: var(--f-text-xl);
			padding: var(--f-space-md) var(--f-space-xl);
		}

		/* Underline variant */
		.f-top-nav[data-variant='underline'] .f-top-nav-link {
			border-bottom: 2px solid transparent;
			border-radius: 0;
		}

		.f-top-nav[data-variant='underline'] .f-top-nav-link.is-active {
			color: var(--f-primary);
			border-bottom-color: var(--f-primary);
		}

		/* Pills variant */
		.f-top-nav[data-variant='pills'] .f-top-nav-link {
			border-radius: var(--f-radius-full);
		}

		.f-top-nav[data-variant='pills'] .f-top-nav-link.is-active {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
		}

		/* Subtle variant */
		.f-top-nav[data-variant='subtle'] .f-top-nav-link {
			border-radius: var(--f-radius-md);
		}

		.f-top-nav[data-variant='subtle'] .f-top-nav-link:hover:not(.is-disabled):not(:disabled) {
			background: var(--f-hover);
		}

		.f-top-nav[data-variant='subtle'] .f-top-nav-link.is-active {
			background: var(--f-active);
			color: var(--f-text);
		}

		/* Badge */
		.f-top-nav-badge {
			font-size: var(--f-text-xs);
			padding: 1px 6px;
			border-radius: var(--f-radius-full);
			background: var(--f-sunken);
			color: var(--f-text-muted);
			font-weight: 600;
			line-height: 1.2;
		}

		.f-top-nav-link.is-active .f-top-nav-badge {
			background: var(--f-primary);
			color: var(--f-primary-text);
		}
	}
</style>
