<!-- @component Multi-value selection input with chips, search filtering, and keyboard navigation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown, luCheck, luX } from '@fractaldesign/icons/lucide';
	import type { SelectOption, Variant, Size, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		options: SelectOption[];
		value?: (string | number)[];
		placeholder?: string;
		label?: string;
		max?: number;
		disabled?: boolean;
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
	}

	let {
		options = [],
		value = $bindable([]),
		placeholder = 'Select options…',
		label,
		max,
		disabled = false,
		variant = 'outline',
		size = 'h-md',
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		class: className = '',
		...restProps
	}: Props = $props();

	let open = $state(false);
	let query = $state('');
	let active = $state(0);
	let root: HTMLElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();
	const inputId = $props.id();

	const filtered = $derived(
		options.filter((o) =>
			o.label.toLowerCase().includes(query.trim().toLowerCase())
		)
	);

	const selectedOptions = $derived(
		value
			.map((v) => options.find((o) => o.value === v))
			.filter((o): o is SelectOption => Boolean(o))
	);

	const isFull = $derived(max !== undefined && value.length >= max);

	function toggleOption(o: SelectOption) {
		if (o.disabled) return;
		if (value.includes(o.value)) {
			value = value.filter((v) => v !== o.value);
		} else if (!isFull) {
			value = [...value, o.value];
		}
		query = '';
		inputEl?.focus();
	}

	function removeValue(val: string | number) {
		if (disabled) return;
		value = value.filter((v) => v !== val);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!open) open = true;
			else active = Math.min(active + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter' && open && filtered[active]) {
			e.preventDefault();
			toggleOption(filtered[active]);
		} else if (e.key === 'Escape') {
			open = false;
		} else if (e.key === 'Backspace' && !query && value.length > 0) {
			value = value.slice(0, -1);
		}
	}

	$effect(() => {
		if (!open) return;
		const handler = (e: PointerEvent) => {
			if (root && !root.contains(e.target as Node)) {
				open = false;
			}
		};
		document.addEventListener('pointerdown', handler);
		return () => document.removeEventListener('pointerdown', handler);
	});
</script>

<div
	bind:this={root}
	class="multiselect-root box gap-xs {textsize} {className}"
	{...restProps}
>
	{#if label}
		<label for={inputId} class="multiselect-label font-medium text-xs text-secondary">
			{label}
		</label>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="multiselect-box row ycenter wrap gap-xs variant {variant} size {size} shape {shape} {shadow} {disabled ? 'is-disabled' : ''}"
		onclick={() => {
			if (!disabled) {
				open = true;
				inputEl?.focus();
			}
		}}
	>
		{#each selectedOptions as opt (opt.value)}
			<span class="chip-item row ycenter gap-xs text-xs font-medium shape {shape}">
				<span>{opt.label}</span>
				{#if !disabled}
					<button
						type="button"
						class="chip-close-btn"
						aria-label="Remove {opt.label}"
						onclick={(e) => {
							e.stopPropagation();
							removeValue(opt.value);
						}}
					>
						<Icon icon={luX} />
					</button>
				{/if}
			</span>
		{/each}

		<input
			bind:this={inputEl}
			id={inputId}
			type="text"
			role="combobox"
			aria-expanded={open}
			aria-controls="multi-dropdown-list"
			{disabled}
			placeholder={selectedOptions.length === 0 ? placeholder : ''}
			bind:value={query}
			class="multiselect-input grow min0"
			onfocus={() => {
				if (!disabled) open = true;
			}}
			onkeydown={onKeyDown}
		/>

		<span class="chevron-icon text-secondary" aria-hidden="true">
			<Icon icon={luChevronDown} />
		</span>
	</div>

	{#if open}
		<ul
			id="multi-dropdown-list"
			role="listbox"
			class="multiselect-dropdown box shadow-lg shape {shape}"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			{#each filtered as opt, i (opt.value)}
				{@const isSelected = value.includes(opt.value)}
				<li
					role="option"
					id="multi-opt-{i}"
					aria-selected={isSelected}
					aria-disabled={opt.disabled || (isFull && !isSelected)}
					class="multiselect-option row ycenter xbetween {i === active ? 'active' : ''} {isSelected ? 'selected' : ''} {opt.disabled || (isFull && !isSelected) ? 'disabled' : ''}"
					onclick={() => toggleOption(opt)}
					onmouseenter={() => (active = i)}
				>
					<span class="option-label text-primary">{opt.label}</span>
					{#if isSelected}
						<span class="check-icon text-theme" aria-hidden="true">
							<Icon icon={luCheck} />
						</span>
					{/if}
				</li>
			{:else}
				<li class="empty-item text-secondary text-sm text-center">
					No options match
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.multiselect-root {
		position: relative;
		width: 100%;
	}

	.multiselect-box {
		width: 100%;
		min-height: 2.25rem;
		padding: 0.25rem 0.625rem;
		cursor: text;
		box-sizing: border-box;
	}

	.multiselect-box.is-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chip-item {
		padding: 0.125rem 0.375rem;
		background: var(--bg-sunken, #f0f0f0);
		color: var(--text-primary, #111);
	}

	.chip-close-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary, #666);
	}

	.chip-close-btn:hover {
		color: var(--danger, #ef4444);
	}

	.multiselect-input {
		border: none;
		background: none;
		outline: none;
		font: inherit;
		min-width: 4rem;
		padding: 0;
	}

	.chevron-icon {
		margin-left: auto;
		pointer-events: none;
		font-size: 0.875rem;
	}

	.multiselect-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		z-index: 50;
		max-height: 14rem;
		overflow-y: auto;
		background: var(--bg-surface, #ffffff);
		border: 1px solid var(--border, #e5e7eb);
		list-style: none;
		margin: 0;
		padding: 0.25rem;
	}

	.multiselect-option {
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm, 4px);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.multiselect-option.active {
		background: var(--state-surface, #f4f4f4);
	}

	.multiselect-option.selected {
		font-weight: 600;
	}

	.multiselect-option.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.empty-item {
		padding: 1rem;
	}
</style>
