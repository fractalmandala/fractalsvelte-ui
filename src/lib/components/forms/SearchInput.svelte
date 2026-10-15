<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string;
		placeholder?: string;
		shortcut?: string;
		listenForShortcut?: boolean;
		loading?: boolean;
		clearable?: boolean;
		size?: Size;
		disabled?: boolean;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		shortcut = '⌘K',
		listenForShortcut = false,
		loading = false,
		clearable = true,
		size = 'md',
		disabled = false,
		id,
		class: className = '',
		leading,
		trailing,
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	const autoId = 'f-srch-' + Math.random().toString(36).slice(2, 9);
	const searchId = $derived(id || autoId);

	const canClear = $derived(clearable && !disabled && !loading && (value?.length ?? 0) > 0);

	function handleClear(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		value = '';
		inputEl?.focus();
	}

	$effect(() => {
		if (!listenForShortcut) return;

		function handleGlobalKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				inputEl?.focus();
				inputEl?.select();
			}
		}

		window.addEventListener('keydown', handleGlobalKey);
		return () => {
			window.removeEventListener('keydown', handleGlobalKey);
		};
	});
</script>

<div
	class="f-search-wrapper {className}"
	data-size={size}
	data-disabled={disabled || undefined}
>
	<span class="f-search-leading" aria-hidden="true">
		{#if leading}
			{@render leading()}
		{:else}
			<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
		{/if}
	</span>

	<input
		bind:this={inputEl}
		id={searchId}
		type="search"
		bind:value={value}
		{placeholder}
		{disabled}
		class="f-search-input"
		{...restProps}
	/>

	<div class="f-search-actions">
		{#if loading}
			<span class="f-search-spinner" aria-label="Searching..."></span>
		{:else if canClear}
			<button
				type="button"
				class="f-search-clear"
				onclick={handleClear}
				tabindex={-1}
				aria-label="Clear search"
			>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		{:else if shortcut}
			<kbd class="f-search-shortcut" aria-hidden="true">{shortcut}</kbd>
		{/if}

		{#if trailing}
			<span class="f-search-trailing" aria-hidden="true">
				{@render trailing()}
			</span>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-search-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			font-family: inherit;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-search-wrapper:hover:not([data-disabled='true']) {
			border-color: var(--f-border-strong);
		}

		.f-search-wrapper:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-search-leading {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text-muted);
			padding-left: var(--f-space-md);
			flex-shrink: 0;
		}

		.f-search-input {
			flex: 1;
			width: 100%;
			min-width: 0;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-base);
			padding: 0 var(--f-space-sm);
			box-sizing: border-box;
			appearance: none;
			-webkit-appearance: none;
		}

		.f-search-input::-webkit-search-cancel-button,
		.f-search-input::-webkit-search-decoration {
			-webkit-appearance: none;
		}

		.f-search-input::placeholder {
			color: var(--f-text-subtle);
		}

		.f-search-input:disabled {
			cursor: not-allowed;
		}

		.f-search-actions {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			padding-right: var(--f-space-sm);
			flex-shrink: 0;
		}

		.f-search-clear {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: none;
			border: none;
			padding: 3px;
			color: var(--f-text-muted);
			border-radius: var(--f-radius-sm);
			cursor: pointer;
			transition: color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-search-clear:hover {
			color: var(--f-text);
			background: var(--f-hover);
		}

		.f-search-shortcut {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 2px 6px;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xs);
			font-family: var(--f-font-mono);
			font-size: 11px;
			font-weight: 500;
			color: var(--f-text-muted);
			user-select: none;
		}

		.f-search-spinner {
			width: 14px;
			height: 14px;
			border: 2px solid var(--f-border-strong);
			border-top-color: var(--f-primary);
			border-radius: 50%;
			animation: f-srch-spin 0.6s linear infinite;
		}

		@keyframes f-srch-spin {
			to {
				transform: rotate(360deg);
			}
		}

		.f-search-trailing {
			display: inline-flex;
			align-items: center;
			color: var(--f-text-muted);
		}

		/* Sizes */
		.f-search-wrapper[data-size='sm'] {
			min-height: 32px;
			border-radius: var(--f-radius-sm);
		}
		.f-search-wrapper[data-size='sm'] .f-search-leading {
			padding-left: var(--f-space-sm);
		}
		.f-search-wrapper[data-size='sm'] .f-search-input {
			font-size: var(--f-text-sm);
		}

		.f-search-wrapper[data-size='md'] {
			min-height: 40px;
			border-radius: var(--f-radius-md);
		}
		.f-search-wrapper[data-size='md'] .f-search-input {
			font-size: var(--f-text-base);
		}

		.f-search-wrapper[data-size='lg'] {
			min-height: 48px;
			border-radius: var(--f-radius-lg);
		}
		.f-search-wrapper[data-size='lg'] .f-search-leading {
			padding-left: var(--f-space-lg);
		}
		.f-search-wrapper[data-size='lg'] .f-search-input {
			font-size: var(--f-text-lg);
		}

		/* Disabled */
		.f-search-wrapper[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
			background: var(--f-sunken);
		}
		.f-search-wrapper[data-disabled='true'] .f-search-input {
			cursor: not-allowed;
		}
	}
</style>
