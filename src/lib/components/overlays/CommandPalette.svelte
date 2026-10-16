<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface CommandItem {
		id: string;
		label: string;
		description?: string;
		icon?: string;
		shortcut?: string;
		onselect?: () => void;
	}

	export interface CommandGroup {
		category: string;
		items: CommandItem[];
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
		/** Bindable visibility state */
		open?: boolean;
		/** Shortcut key character paired with ⌘/Ctrl to open */
		shortcut?: string;
		/** Search input placeholder text */
		placeholder?: string;
		/** Empty state feedback when search yields no matches */
		emptyMessage?: string;
		/** Categorized command action groups */
		groups?: CommandGroup[];
		/** Additional CSS classes for dialog panel */
		class?: string;
		/** Selection callback receiving the selected item ID */
		onselect?: (itemId: string) => void;
		/** Trigger element snippet */
		trigger?: Snippet<[{ open: () => void }]>;
		/** Custom command body slot replacing static search */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		shortcut = 'k',
		placeholder = 'Type a command or search...',
		emptyMessage = 'No results found.',
		groups = [],
		class: className = '',
		onselect,
		trigger,
		children,
		...restProps
	}: Props = $props();

	let searchQuery = $state('');
	let selectedFlatIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	const filteredGroups = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return groups;

		return groups
			.map((group) => {
				const filteredItems = group.items.filter(
					(item) =>
						item.label.toLowerCase().includes(q) ||
						item.description?.toLowerCase().includes(q)
				);
				return { category: group.category, items: filteredItems };
			})
			.filter((group) => group.items.length > 0);
	});

	const flatItems = $derived(filteredGroups.flatMap((g) => g.items));

	function openPalette() {
		open = true;
		searchQuery = '';
		selectedFlatIndex = 0;
	}

	function closePalette() {
		open = false;
		searchQuery = '';
	}

	function selectItem(item: CommandItem) {
		item.onselect?.();
		onselect?.(item.id);
		closePalette();
	}

	function handleGlobalKeyDown(event: KeyboardEvent) {
		if (
			(event.metaKey || event.ctrlKey) &&
			event.key.toLowerCase() === shortcut.toLowerCase()
		) {
			event.preventDefault();
			if (open) {
				closePalette();
			} else {
				openPalette();
			}
			return;
		}

		if (open) {
			if (event.key === 'Escape') {
				event.preventDefault();
				closePalette();
			} else if (event.key === 'ArrowDown') {
				event.preventDefault();
				if (flatItems.length > 0) {
					selectedFlatIndex = (selectedFlatIndex + 1) % flatItems.length;
				}
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				if (flatItems.length > 0) {
					selectedFlatIndex = (selectedFlatIndex - 1 + flatItems.length) % flatItems.length;
				}
			} else if (event.key === 'Enter') {
				event.preventDefault();
				const item = flatItems[selectedFlatIndex];
				if (item) {
					selectItem(item);
				}
			}
		}
	}

	$effect(() => {
		if (open) {
			requestAnimationFrame(() => {
				inputEl?.focus();
			});
		}
	});

	$effect(() => {
		// Reset selected index when search changes
		if (searchQuery) {
			selectedFlatIndex = 0;
		}
	});
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

{#if trigger}
	{@render trigger({ open: openPalette })}
{/if}

{#if open}
	<div
		class="f-command-backdrop"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) closePalette();
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Command Palette"
			class="f-command-panel {className}"
			{...restProps}
		>
			<div class="f-command-search">
				<svg
					class="f-command-search-icon"
					viewBox="0 0 24 24"
					width="18"
					height="18"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>

				<input
					bind:this={inputEl}
					bind:value={searchQuery}
					type="text"
					class="f-command-input"
					{placeholder}
					aria-autocomplete="list"
				/>

				<button type="button" class="f-command-esc-badge" onclick={closePalette}>ESC</button>
			</div>

			<div class="f-command-body">
				{#if children}
					{@render children()}
				{:else if filteredGroups.length === 0}
					<div class="f-command-empty">{emptyMessage}</div>
				{:else}
					{@const _ = (function() { return 0; })()}
					<!-- Track linear index for flat navigation -->
					{#each filteredGroups as group}
						<div class="f-command-group">
							<div class="f-command-category">{group.category}</div>
							{#each group.items as item}
								{@const isSelected = flatItems[selectedFlatIndex]?.id === item.id}
								<button
									type="button"
									class="f-command-item"
									data-selected={isSelected ? 'true' : undefined}
									onclick={() => selectItem(item)}
								>
									{#if item.icon}
										<span class="f-command-item-icon">{item.icon}</span>
									{/if}
									<div class="f-command-item-text">
										<span class="f-command-item-label">{item.label}</span>
										{#if item.description}
											<span class="f-command-item-desc">{item.description}</span>
										{/if}
									</div>
									{#if item.shortcut}
										<kbd class="f-command-shortcut">{item.shortcut}</kbd>
									{/if}
								</button>
							{/each}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-command-backdrop {
			position: fixed;
			inset: 0;
			z-index: 1000;
			background: var(--f-overlay);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding-top: 15vh;
			padding-inline: var(--f-space-md);
			box-sizing: border-box;
			animation: f-command-fade var(--f-duration-normal) var(--f-ease);
		}

		.f-command-panel {
			position: relative;
			width: 100%;
			max-width: 600px;
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xl);
			box-shadow: var(--f-shadow-xl);
			overflow: hidden;
			display: flex;
			flex-direction: column;
			animation: f-command-scale var(--f-duration-normal) var(--f-ease-spring);
		}

		.f-command-search {
			display: flex;
			align-items: center;
			padding: var(--f-space-md) var(--f-space-lg);
			border-bottom: 1px solid var(--f-border);
			gap: var(--f-space-sm);
		}

		.f-command-search-icon {
			color: var(--f-text-muted);
			flex-shrink: 0;
		}

		.f-command-input {
			flex: 1;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-base);
		}

		.f-command-input::placeholder {
			color: var(--f-text-subtle);
		}

		.f-command-esc-badge {
			font-size: var(--f-text-xs);
			font-family: var(--f-font-mono);
			padding: var(--f-space-3xs) var(--f-space-2xs);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xs);
			background: var(--f-sunken);
			color: var(--f-text-muted);
			cursor: pointer;
		}

		.f-command-body {
			max-height: 380px;
			overflow-y: auto;
			padding: var(--f-space-xs);
		}

		.f-command-empty {
			padding: var(--f-space-xl);
			text-align: center;
			color: var(--f-text-muted);
			font-size: var(--f-text-sm);
		}

		.f-command-group {
			margin-bottom: var(--f-space-xs);
		}

		.f-command-category {
			padding: var(--f-space-xs) var(--f-space-sm);
			font-size: var(--f-text-xs);
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--f-text-subtle);
		}

		.f-command-item {
			display: flex;
			align-items: center;
			width: 100%;
			padding: var(--f-space-xs) var(--f-space-sm);
			border: none;
			border-radius: var(--f-radius-md);
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-sm);
			text-align: left;
			cursor: pointer;
			user-select: none;
			box-sizing: border-box;
			gap: var(--f-space-sm);
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-command-item:hover,
		.f-command-item[data-selected='true'] {
			background: var(--f-hover);
		}

		.f-command-item[data-selected='true'] {
			box-shadow: inset 2px 0 0 var(--f-primary);
		}

		.f-command-item-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.f-command-item-text {
			display: flex;
			flex-direction: column;
			gap: 2px;
			flex: 1;
			min-width: 0;
		}

		.f-command-item-label {
			font-weight: 500;
			color: var(--f-text);
		}

		.f-command-item-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		.f-command-shortcut {
			font-size: var(--f-text-xs);
			font-family: var(--f-font-mono);
			padding: var(--f-space-3xs) var(--f-space-2xs);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xs);
			background: var(--f-sunken);
			color: var(--f-text-muted);
			margin-left: auto;
		}

		@keyframes f-command-fade {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes f-command-scale {
			from {
				opacity: 0;
				transform: scale(0.97) translateY(-8px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}
</style>
