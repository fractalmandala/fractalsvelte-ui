<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	export interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
		group?: string;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string | number;
		options?: SelectOption[];
		placeholder?: string;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		searchable?: boolean;
		searchPlaceholder?: string;
		clearable?: boolean;
		size?: Size;
		leading?: Snippet;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(undefined),
		options = [],
		placeholder = 'Select an option',
		label,
		description,
		helperText,
		error,
		disabled = false,
		searchable = false,
		searchPlaceholder = 'Search options...',
		clearable = false,
		size = 'md',
		leading,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let highlightedIndex = $state(-1);
	let containerEl: HTMLDivElement | null = $state(null);
	let searchInputEl: HTMLInputElement | null = $state(null);
	let triggerBtnEl: HTMLButtonElement | null = $state(null);

	const autoId = 'f-sel-' + Math.random().toString(36).slice(2, 9);
	const selectId = $derived(id || autoId);
	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	const filteredOptions = $derived(
		searchable && searchQuery.trim()
			? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim()))
			: options
	);

	const selectedOption = $derived(options.find((opt) => opt.value === value));
	const canClear = $derived(clearable && value !== undefined && !disabled);

	function openMenu() {
		if (disabled) return;
		isOpen = true;
		searchQuery = '';
		const currentIdx = filteredOptions.findIndex((o) => o.value === value);
		highlightedIndex = currentIdx >= 0 ? currentIdx : 0;
		if (searchable) {
			setTimeout(() => searchInputEl?.focus(), 10);
		}
	}

	function closeMenu() {
		isOpen = false;
		searchQuery = '';
		highlightedIndex = -1;
		triggerBtnEl?.focus();
	}

	function toggleMenu() {
		if (isOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	function selectOption(opt: SelectOption) {
		if (opt.disabled) return;
		value = opt.value;
		closeMenu();
	}

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		value = undefined;
	}

	function handleTriggerKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openMenu();
		}
	}

	function handleMenuKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeMenu();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const len = filteredOptions.length;
			if (len > 0) {
				highlightedIndex = (highlightedIndex + 1) % len;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const len = filteredOptions.length;
			if (len > 0) {
				highlightedIndex = (highlightedIndex - 1 + len) % len;
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
				selectOption(filteredOptions[highlightedIndex]);
			}
		} else if (e.key === 'Tab') {
			closeMenu();
		}
	}

	// Click outside listener
	$effect(() => {
		if (!isOpen) return;
		function handleClickOutside(event: MouseEvent) {
			if (containerEl && !containerEl.contains(event.target as Node)) {
				closeMenu();
			}
		}
		document.addEventListener('pointerdown', handleClickOutside);
		return () => {
			document.removeEventListener('pointerdown', handleClickOutside);
		};
	});
</script>

<div
	bind:this={containerEl}
	class="f-select-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label}
		<label class="f-select-label" for={selectId}>
			{label}
		</label>
	{/if}

	{#if description}
		<span class="f-select-desc" id="{selectId}-desc">
			{description}
		</span>
	{/if}

	<div class="f-select-wrapper">
		<button
			bind:this={triggerBtnEl}
			id={selectId}
			type="button"
			role="combobox"
			class="f-select-trigger"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-controls="{selectId}-listbox"
			aria-invalid={hasError || undefined}
			aria-describedby={description ? `${selectId}-desc` : undefined}
			{disabled}
			onclick={toggleMenu}
			onkeydown={handleTriggerKeyDown}
		>
			<div class="f-select-trigger-content">
				{#if leading}
					<span class="f-select-leading" aria-hidden="true">
						{@render leading()}
					</span>
				{/if}
				{#if selectedOption}
					<span class="f-select-value">{selectedOption.label}</span>
				{:else}
					<span class="f-select-placeholder">{placeholder}</span>
				{/if}
			</div>

			<div class="f-select-actions">
				{#if canClear}
					<span
						role="button"
						tabindex="0"
						class="f-select-clear"
						onclick={handleClear}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.stopPropagation();
								value = undefined;
							}
						}}
						aria-label="Clear selection"
					>
						<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</span>
				{/if}
				<span class="f-select-chevron" class:open={isOpen} aria-hidden="true">
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</span>
			</div>
		</button>

		{#if isOpen}
			<div
				class="f-select-dropdown"
				role="listbox"
				tabindex="-1"
				onkeydown={handleMenuKeyDown}
			>
				{#if searchable}
					<div class="f-select-search-box">
						<svg class="f-select-search-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						<input
							bind:this={searchInputEl}
							bind:value={searchQuery}
							type="text"
							class="f-select-search-input"
							placeholder={searchPlaceholder}
							onclick={(e) => e.stopPropagation()}
						/>
					</div>
				{/if}

				<ul id="{selectId}-listbox" class="f-select-options">
					{#if filteredOptions.length === 0}
						<li class="f-select-empty">No options found</li>
					{:else}
						{#each filteredOptions as opt, idx}
							<li
								class="f-select-option"
								class:selected={opt.value === value}
								class:highlighted={idx === highlightedIndex}
								class:disabled={opt.disabled}
								role="option"
								tabindex={opt.disabled ? -1 : 0}
								aria-selected={opt.value === value}
								onclick={() => selectOption(opt)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										selectOption(opt);
									}
								}}
								onmouseenter={() => {
									if (!opt.disabled) highlightedIndex = idx;
								}}
							>
								<span class="f-select-option-label">{opt.label}</span>
								{#if opt.value === value}
									<span class="f-select-check" aria-hidden="true">
										<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>
								{/if}
							</li>
						{/each}
					{/if}
				</ul>
			</div>
		{/if}
	</div>

	{#if errorMessage}
		<p class="f-select-error-msg" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="f-select-helper-msg">{helperText}</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-select-container {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-select-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-select-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-select-wrapper {
			position: relative;
			width: 100%;
		}

		.f-select-trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			color: var(--f-text);
			cursor: pointer;
			font-family: inherit;
			text-align: left;
			padding: 0 var(--f-space-md);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-select-trigger:hover:not(:disabled) {
			border-color: var(--f-border-strong);
		}

		.f-select-trigger:focus-visible {
			outline: none;
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-select-trigger-content {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			flex: 1;
			min-width: 0;
		}

		.f-select-leading {
			display: inline-flex;
			align-items: center;
			color: var(--f-text-muted);
			flex-shrink: 0;
		}

		.f-select-value {
			font-size: var(--f-text-base);
			color: var(--f-text);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.f-select-placeholder {
			font-size: var(--f-text-base);
			color: var(--f-text-subtle);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.f-select-actions {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			margin-left: var(--f-space-sm);
			flex-shrink: 0;
		}

		.f-select-clear {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text-muted);
			padding: 2px;
			border-radius: var(--f-radius-xs);
			cursor: pointer;
		}

		.f-select-clear:hover {
			color: var(--f-text);
			background: var(--f-hover);
		}

		.f-select-chevron {
			display: inline-flex;
			align-items: center;
			color: var(--f-text-muted);
			transition: transform var(--f-duration-fast) var(--f-ease);
		}

		.f-select-chevron.open {
			transform: rotate(180deg);
		}

		/* Dropdown */
		.f-select-dropdown {
			position: absolute;
			top: calc(100% + 4px);
			left: 0;
			right: 0;
			z-index: var(--f-z-select, 1000);
			background: var(--f-panel);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			box-shadow: var(--f-shadow-lg);
			padding: var(--f-space-2xs);
			box-sizing: border-box;
			animation: f-drop-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
		}

		@keyframes f-drop-in {
			from {
				opacity: 0;
				transform: translateY(-4px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		.f-select-search-box {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			padding: var(--f-space-2xs) var(--f-space-sm);
			margin-bottom: var(--f-space-2xs);
			background: var(--f-sunken);
			border-radius: var(--f-radius-sm);
		}

		.f-select-search-icon {
			color: var(--f-text-muted);
			flex-shrink: 0;
		}

		.f-select-search-input {
			width: 100%;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-sm);
		}

		.f-select-search-input::placeholder {
			color: var(--f-text-subtle);
		}

		.f-select-options {
			list-style: none;
			margin: 0;
			padding: 0;
			max-height: 220px;
			overflow-y: auto;
		}

		.f-select-option {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: var(--f-space-xs) var(--f-space-sm);
			border-radius: var(--f-radius-sm);
			font-size: var(--f-text-sm);
			color: var(--f-text);
			cursor: pointer;
			user-select: none;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-select-option.highlighted {
			background: var(--f-hover);
		}

		.f-select-option.selected {
			color: var(--f-primary);
			font-weight: 500;
		}

		.f-select-option.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.f-select-check {
			color: var(--f-primary);
			display: flex;
			align-items: center;
		}

		.f-select-empty {
			padding: var(--f-space-md);
			text-align: center;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		/* Sizes */
		.f-select-container[data-size='sm'] .f-select-trigger {
			height: 32px;
			border-radius: var(--f-radius-sm);
			font-size: var(--f-text-sm);
			padding: 0 var(--f-space-sm);
		}
		.f-select-container[data-size='sm'] .f-select-value,
		.f-select-container[data-size='sm'] .f-select-placeholder {
			font-size: var(--f-text-sm);
		}

		.f-select-container[data-size='md'] .f-select-trigger {
			height: 40px;
			border-radius: var(--f-radius-md);
			font-size: var(--f-text-base);
			padding: 0 var(--f-space-md);
		}

		.f-select-container[data-size='lg'] .f-select-trigger {
			height: 48px;
			border-radius: var(--f-radius-lg);
			font-size: var(--f-text-lg);
			padding: 0 var(--f-space-lg);
		}
		.f-select-container[data-size='lg'] .f-select-value,
		.f-select-container[data-size='lg'] .f-select-placeholder {
			font-size: var(--f-text-lg);
		}

		/* Invalid state */
		.f-select-container[data-invalid='true'] .f-select-trigger {
			border-color: var(--f-danger);
		}
		.f-select-container[data-invalid='true'] .f-select-trigger:focus-visible {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}

		/* Disabled */
		.f-select-container[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-select-container[data-disabled='true'] .f-select-trigger {
			background: var(--f-sunken);
			cursor: not-allowed;
		}

		.f-select-helper-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		.f-select-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}
	}
</style>
