<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface MorphingTabItem {
		id: string;
		label: string;
		badge?: string | number;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
		items: MorphingTabItem[];
		value?: string;
		variant?: 'pill' | 'underline' | 'segmented';
		class?: string;
		itemSnippet?: Snippet<[{ item: MorphingTabItem; selected: boolean }]>;
		onselect?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(items[0]?.id ?? ''),
		variant = 'pill',
		class: className = '',
		itemSnippet,
		onselect,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let indicatorLeft = $state(0);
	let indicatorWidth = $state(0);
	let indicatorReady = $state(false);

	function updateIndicator() {
		if (!containerEl) return;
		const activeBtn = containerEl.querySelector(`[data-tab-id="${value}"]`) as HTMLElement;
		if (activeBtn) {
			const containerRect = containerEl.getBoundingClientRect();
			const btnRect = activeBtn.getBoundingClientRect();
			indicatorLeft = btnRect.left - containerRect.left;
			indicatorWidth = btnRect.width;
			indicatorReady = true;
		}
	}

	$effect(() => {
		// Recompute when value or items change
		if (value && containerEl) {
			updateIndicator();
		}
	});

	function handleTabClick(item: MorphingTabItem) {
		if (item.disabled) return;
		value = item.id;
		onselect?.(item.id);
	}
</script>

<svelte:window onresize={updateIndicator} />

<div
	bind:this={containerEl}
	class="f-morphing-tabs {className}"
	data-variant={variant}
	role="tablist"
	{...restProps}
>
	<!-- Morphing highlight pill / underline -->
	<div
		class="f-morphing-indicator"
		class:ready={indicatorReady}
		style="
			transform: translateX({indicatorLeft}px);
			width: {indicatorWidth}px;
		"
		aria-hidden="true"
	></div>

	{#each items as item (item.id)}
		{@const selected = value === item.id}
		<button
			type="button"
			role="tab"
			class="f-morphing-tab"
			data-tab-id={item.id}
			aria-selected={selected}
			disabled={item.disabled}
			onclick={() => handleTabClick(item)}
		>
			{#if itemSnippet}
				{@render itemSnippet({ item, selected })}
			{:else}
				<span class="f-tab-label">{item.label}</span>
				{#if item.badge !== undefined}
					<span class="f-tab-badge" class:selected>{item.badge}</span>
				{/if}
			{/if}
		</button>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-morphing-tabs {
			position: relative;
			display: inline-flex;
			align-items: center;
			padding: 4px;
			border-radius: var(--f-radius-lg);
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			box-sizing: border-box;
			user-select: none;
		}

		/* Indicator */
		.f-morphing-indicator {
			position: absolute;
			top: 4px;
			bottom: 4px;
			left: 0;
			border-radius: var(--f-radius-md);
			background: var(--f-surface);
			box-shadow: var(--f-shadow-sm);
			pointer-events: none;
			opacity: 0;
			transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1),
				width 0.35s cubic-bezier(0.2, 0.9, 0.3, 1),
				opacity 0.15s ease;
			z-index: 1;
		}

		.f-morphing-indicator.ready {
			opacity: 1;
		}

		/* Variant: Underline */
		.f-morphing-tabs[data-variant='underline'] {
			background: transparent;
			border: none;
			border-bottom: 1px solid var(--f-border);
			border-radius: 0;
			padding: 0;
		}

		.f-morphing-tabs[data-variant='underline'] .f-morphing-indicator {
			top: auto;
			bottom: -1px;
			height: 2px;
			background: var(--f-primary);
			border-radius: 0;
			box-shadow: none;
		}

		/* Tabs */
		.f-morphing-tab {
			position: relative;
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 6px 14px;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-md);
			font-family: inherit;
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text-muted);
			cursor: pointer;
			white-space: nowrap;
			z-index: 2;
			transition: color var(--f-duration-fast) var(--f-ease);
		}

		.f-morphing-tab:hover:not(:disabled) {
			color: var(--f-text);
		}

		.f-morphing-tab[aria-selected='true'] {
			color: var(--f-text);
			font-weight: 600;
		}

		.f-morphing-tab:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		.f-morphing-tab:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: -2px;
		}

		.f-tab-badge {
			font-size: 10px;
			font-weight: 700;
			padding: 1px 6px;
			border-radius: 9999px;
			background: var(--f-border);
			color: var(--f-text-muted);
			transition: background var(--f-duration-fast) var(--f-ease), color var(--f-duration-fast) var(--f-ease);
		}

		.f-tab-badge.selected {
			background: var(--f-primary-muted, rgba(99, 102, 241, 0.15));
			color: var(--f-primary);
		}
	}
</style>
