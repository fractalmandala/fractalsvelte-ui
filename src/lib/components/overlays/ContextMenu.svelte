<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContextMenuItem {
		id: string;
		label: string;
		icon?: Snippet;
		shortcut?: string;
		danger?: boolean;
		disabled?: boolean;
		separator?: boolean;
		onselect?: () => void;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: ContextMenuItem[];
		class?: string;
		children?: Snippet;
	}

	let {
		items = [],
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let open = $state(false);
	let x = $state(0);
	let y = $state(0);
	let menuEl: HTMLDivElement | undefined = $state();

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		x = Math.min(e.clientX, window.innerWidth - 220);
		y = Math.min(e.clientY, window.innerHeight - 300);
		open = true;
	}

	function closeMenu() {
		open = false;
	}

	function handleSelect(item: ContextMenuItem) {
		if (item.disabled || item.separator) return;
		item.onselect?.();
		closeMenu();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			closeMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onclick={closeMenu} />

<div
	class="f-context-menu-trigger {className}"
	oncontextmenu={handleContextMenu}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

{#if open}
	<div
		bind:this={menuEl}
		class="f-context-menu"
		style="left: {x}px; top: {y}px;"
		role="menu"
		tabindex="-1"
	>
		{#each items as item}
			{#if item.separator}
				<div class="f-context-separator" role="separator"></div>
			{:else}
				<button
					type="button"
					class="f-context-item"
					class:is-danger={item.danger}
					disabled={item.disabled}
					onclick={(e) => { e.stopPropagation(); handleSelect(item); }}
					role="menuitem"
				>
					{#if item.icon}
						<span class="f-context-icon">
							{@render item.icon()}
						</span>
					{/if}
					<span class="f-context-label">{item.label}</span>
					{#if item.shortcut}
						<span class="f-context-shortcut">{item.shortcut}</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-context-menu-trigger {
			display: contents;
		}

		.f-context-menu {
			position: fixed;
			z-index: var(--f-z-dropdown, 1000);
			min-width: 200px;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			box-shadow: var(--f-shadow-xl);
			padding: var(--f-space-3xs);
			box-sizing: border-box;
			animation: f-context-in var(--f-duration-fast) var(--f-ease);
		}

		.f-context-item {
			display: flex;
			align-items: center;
			width: 100%;
			gap: 0.6rem;
			padding: 0.45rem 0.65rem;
			border: none;
			background: transparent;
			color: var(--f-text);
			font-size: var(--f-text-xs);
			border-radius: var(--f-radius-sm);
			cursor: pointer;
			text-align: left;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-context-item:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-primary);
		}

		.f-context-item.is-danger:hover:not(:disabled) {
			background: var(--f-danger-bg);
			color: var(--f-danger);
		}

		.f-context-item:disabled {
			opacity: 0.45;
			cursor: not-allowed;
		}

		.f-context-icon {
			display: flex;
			align-items: center;
			color: inherit;
		}

		.f-context-label {
			flex: 1;
		}

		.f-context-shortcut {
			font-size: 0.7rem;
			color: var(--f-text-muted);
			font-family: var(--f-font-mono);
		}

		.f-context-separator {
			height: 1px;
			background: var(--f-border-subtle);
			margin: var(--f-space-3xs) 0;
		}

		@keyframes f-context-in {
			from {
				opacity: 0;
				transform: scale(0.97);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}
	}
</style>
