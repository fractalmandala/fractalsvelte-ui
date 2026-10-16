<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	export interface TabItem {
		id: string;
		label: string;
		icon?: Snippet;
		badge?: string | number;
		disabled?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Array of tab definitions */
		tabs?: TabItem[];
		/** Identifier of the currently active tab */
		activeTab?: string;
		/** Visual presentation variant of the tab navigation */
		variant?: 'underline' | 'pill' | 'bordered';
		/** Size scale tier for tab headers */
		size?: Size;
		/** Additional CSS classes */
		class?: string;
		/** Content panel slot */
		children?: Snippet;
		/** Trailing actions slot positioned adjacent to the tab list */
		extra?: Snippet;
	}

	let {
		tabs = [],
		activeTab = $bindable(''),
		variant = 'underline',
		size = 'md',
		class: className = '',
		children,
		extra,
		...restProps
	}: Props = $props();

	// Initialize activeTab if not provided and tabs exist
	$effect(() => {
		if (!activeTab && tabs.length > 0) {
			const firstEnabled = tabs.find((t) => !t.disabled);
			if (firstEnabled) {
				activeTab = firstEnabled.id;
			}
		}
	});

	function selectTab(id: string) {
		const t = tabs.find((item) => item.id === id);
		if (!t || t.disabled) return;
		activeTab = id;
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (tabs.length === 0) return;
		const enabledTabs = tabs.map((t, idx) => ({ ...t, originalIndex: idx })).filter((t) => !t.disabled);
		const currentEnabledIdx = enabledTabs.findIndex((t) => t.id === tabs[index].id);

		let nextIdx = -1;
		if (event.key === 'ArrowRight') {
			nextIdx = (currentEnabledIdx + 1) % enabledTabs.length;
		} else if (event.key === 'ArrowLeft') {
			nextIdx = (currentEnabledIdx - 1 + enabledTabs.length) % enabledTabs.length;
		} else if (event.key === 'Home') {
			nextIdx = 0;
		} else if (event.key === 'End') {
			nextIdx = enabledTabs.length - 1;
		}

		if (nextIdx !== -1) {
			event.preventDefault();
			const targetTab = enabledTabs[nextIdx];
			selectTab(targetTab.id);
			const btn = document.getElementById(`tab-btn-${targetTab.id}`);
			btn?.focus();
		}
	}
</script>

<div
	class="f-tabs {className}"
	data-variant={variant}
	data-size={size}
	{...restProps}
>
	<div class="f-tabs-header">
		<div class="f-tabs-list" role="tablist" aria-orientation="horizontal">
			{#each tabs as tab, i (tab.id)}
				{@const isActive = tab.id === activeTab}
				<button
					type="button"
					id={`tab-btn-${tab.id}`}
					role="tab"
					class="f-tab-btn"
					class:is-active={isActive}
					disabled={tab.disabled}
					aria-selected={isActive}
					aria-controls={`tab-panel-${tab.id}`}
					tabindex={isActive ? 0 : -1}
					onclick={() => selectTab(tab.id)}
					onkeydown={(e) => handleKeydown(e, i)}
				>
					{#if tab.icon}
						<span class="f-tab-icon">
							{@render tab.icon()}
						</span>
					{/if}
					<span class="f-tab-label">{tab.label}</span>
					{#if tab.badge !== undefined}
						<span class="f-tab-badge">{tab.badge}</span>
					{/if}
				</button>
			{/each}
		</div>

		{#if extra}
			<div class="f-tabs-extra">
				{@render extra()}
			</div>
		{/if}
	</div>

	{#if children}
		<div class="f-tabs-content">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-tabs {
			display: flex;
			flex-direction: column;
			width: 100%;
			box-sizing: border-box;
		}

		.f-tabs-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			gap: var(--f-space-md);
		}

		.f-tabs-list {
			display: inline-flex;
			align-items: center;
			position: relative;
			user-select: none;
		}

		.f-tab-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--f-space-2xs);
			background: transparent;
			border: none;
			color: var(--f-text-muted);
			font-family: inherit;
			font-weight: 500;
			cursor: pointer;
			position: relative;
			white-space: nowrap;
			transition: color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-tab-btn:hover:not(:disabled) {
			color: var(--f-text);
		}

		.f-tab-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-tab-btn:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		.f-tab-btn.is-active {
			color: var(--f-text);
			font-weight: 600;
		}

		.f-tab-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.f-tab-badge {
			font-size: var(--f-text-xs);
			padding: 1px 6px;
			border-radius: var(--f-radius-full);
			background: var(--f-sunken);
			color: var(--f-text-muted);
			font-weight: 600;
		}

		.f-tab-btn.is-active .f-tab-badge {
			background: var(--f-primary);
			color: var(--f-primary-text);
		}

		.f-tabs-extra {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-xs);
		}

		.f-tabs-content {
			padding-top: var(--f-space-md);
		}

		/* Sizes */
		.f-tabs[data-size='xs'] .f-tab-btn {
			font-size: var(--f-text-xs);
			padding: var(--f-space-3xs) var(--f-space-xs);
		}

		.f-tabs[data-size='sm'] .f-tab-btn {
			font-size: var(--f-text-sm);
			padding: var(--f-space-2xs) var(--f-space-sm);
		}

		.f-tabs[data-size='md'] .f-tab-btn {
			font-size: var(--f-text-base);
			padding: var(--f-space-xs) var(--f-space-md);
		}

		.f-tabs[data-size='lg'] .f-tab-btn {
			font-size: var(--f-text-lg);
			padding: var(--f-space-sm) var(--f-space-lg);
		}

		.f-tabs[data-size='xl'] .f-tab-btn {
			font-size: var(--f-text-xl);
			padding: var(--f-space-md) var(--f-space-xl);
		}

		/* Underline variant */
		.f-tabs[data-variant='underline'] .f-tabs-header {
			border-bottom: 1px solid var(--f-border);
		}

		.f-tabs[data-variant='underline'] .f-tabs-list {
			gap: var(--f-space-2xs);
		}

		.f-tabs[data-variant='underline'] .f-tab-btn {
			border-bottom: 2px solid transparent;
			margin-bottom: -1px;
		}

		.f-tabs[data-variant='underline'] .f-tab-btn.is-active {
			border-bottom-color: var(--f-primary);
			color: var(--f-primary);
		}

		/* Pill variant */
		.f-tabs[data-variant='pill'] .f-tabs-list {
			background: var(--f-sunken);
			padding: 4px;
			border-radius: var(--f-radius-full);
			gap: 2px;
		}

		.f-tabs[data-variant='pill'] .f-tab-btn {
			border-radius: var(--f-radius-full);
		}

		.f-tabs[data-variant='pill'] .f-tab-btn.is-active {
			background: var(--f-surface);
			box-shadow: var(--f-shadow-sm);
			color: var(--f-text);
		}

		/* Bordered variant */
		.f-tabs[data-variant='bordered'] .f-tabs-header {
			border-bottom: 1px solid var(--f-border);
		}

		.f-tabs[data-variant='bordered'] .f-tabs-list {
			gap: var(--f-space-3xs);
		}

		.f-tabs[data-variant='bordered'] .f-tab-btn {
			border: 1px solid transparent;
			border-bottom: none;
			border-top-left-radius: var(--f-radius-md);
			border-top-right-radius: var(--f-radius-md);
			margin-bottom: -1px;
		}

		.f-tabs[data-variant='bordered'] .f-tab-btn.is-active {
			border-color: var(--f-border);
			background: var(--f-surface);
			color: var(--f-primary);
		}
	}
</style>
