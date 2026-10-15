<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface BottomNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: Snippet;
		badge?: string | number;
		active?: boolean;
		disabled?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Array of mobile bottom navigation actions */
		items?: BottomNavItem[];
		/** Identifier of the currently active navigation item */
		activeId?: string;
		/** Additional CSS classes */
		class?: string;
		/** Slot for custom navigation elements */
		children?: Snippet;
		/** Custom renderer snippet for individual navigation items */
		item?: Snippet<[{ item: BottomNavItem; active: boolean }]>;
	}

	let {
		items = [],
		activeId = $bindable(''),
		class: className = '',
		children,
		item,
		...restProps
	}: Props = $props();

	function isItemActive(entry: BottomNavItem): boolean {
		if (activeId) {
			return entry.id === activeId;
		}
		return Boolean(entry.active);
	}

	function handleItemClick(entry: BottomNavItem) {
		if (entry.disabled) return;
		activeId = entry.id;
	}
</script>

<nav
	class="f-bottom-nav {className}"
	aria-label="Bottom Navigation"
	{...restProps}
>
	{#if items.length > 0}
		<ul class="f-bottom-nav-list" role="list">
			{#each items as entry (entry.id)}
				{@const active = isItemActive(entry)}
				<li class="f-bottom-nav-item">
					{#if item}
						{@render item({ item: entry, active })}
					{:else if entry.href}
						<a
							href={entry.href}
							class="f-bottom-nav-link"
							class:is-active={active}
							class:is-disabled={entry.disabled}
							aria-current={active ? 'page' : undefined}
							aria-disabled={entry.disabled || undefined}
							tabindex={entry.disabled ? -1 : undefined}
							onclick={() => handleItemClick(entry)}
						>
							<div class="f-bottom-nav-icon-wrapper">
								{#if entry.icon}
									{@render entry.icon()}
								{/if}
								{#if entry.badge !== undefined}
									<span class="f-bottom-nav-badge">{entry.badge}</span>
								{/if}
							</div>
							<span class="f-bottom-nav-label">{entry.label}</span>
						</a>
					{:else}
						<button
							type="button"
							class="f-bottom-nav-link"
							class:is-active={active}
							disabled={entry.disabled}
							aria-current={active ? 'page' : undefined}
							onclick={() => handleItemClick(entry)}
						>
							<div class="f-bottom-nav-icon-wrapper">
								{#if entry.icon}
									{@render entry.icon()}
								{/if}
								{#if entry.badge !== undefined}
									<span class="f-bottom-nav-badge">{entry.badge}</span>
								{/if}
							</div>
							<span class="f-bottom-nav-label">{entry.label}</span>
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
		.f-bottom-nav {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 50;
			background: var(--f-surface);
			border-top: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-md);
			padding: var(--f-space-2xs) var(--f-space-sm) calc(var(--f-space-2xs) + env(safe-area-inset-bottom, 0px));
			box-sizing: border-box;
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
		}

		.f-bottom-nav-list {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin: 0;
			padding: 0;
			list-style: none;
			width: 100%;
		}

		.f-bottom-nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
		}

		.f-bottom-nav-link {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 2px;
			padding: var(--f-space-2xs) var(--f-space-xs);
			background: transparent;
			border: none;
			color: var(--f-text-muted);
			text-decoration: none;
			font-family: inherit;
			cursor: pointer;
			user-select: none;
			border-radius: var(--f-radius-sm);
			transition: color var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
			width: 100%;
			max-width: 90px;
		}

		.f-bottom-nav-link:hover:not(:disabled):not(.is-disabled) {
			color: var(--f-text);
		}

		.f-bottom-nav-link:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-bottom-nav-link.is-active {
			color: var(--f-primary);
			font-weight: 600;
		}

		.f-bottom-nav-link.is-disabled,
		.f-bottom-nav-link:disabled {
			opacity: 0.45;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-bottom-nav-icon-wrapper {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
		}

		.f-bottom-nav-label {
			font-size: var(--f-text-xs);
			line-height: 1.1;
			white-space: nowrap;
		}

		.f-bottom-nav-badge {
			position: absolute;
			top: -4px;
			right: -8px;
			font-size: 10px;
			font-weight: 700;
			line-height: 1;
			padding: 2px 4px;
			border-radius: var(--f-radius-full);
			background: var(--f-danger);
			color: #ffffff;
		}
	}
</style>
