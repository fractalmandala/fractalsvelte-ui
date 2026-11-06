<!-- @component Searchable combobox input with dropdown suggestions, keyboard navigation, and custom empty state. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { Icon } from '@fractaldesign/icons';
	import { luSearch, luChevronDown, luCheck } from '@fractaldesign/icons/lucide';
	import type { SelectOption, Variant, Size, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'type' | 'role' | 'size'> {
		options: SelectOption[];
		value?: string | number | null;
		placeholder?: string;
		emptyText?: string;
		label?: string;
		error?: boolean | string;
		disabled?: boolean;
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		onchoose?: (option: SelectOption) => void;
		empty?: Snippet;
		class?: string;
	}

	let {
		options = [],
		value = $bindable(null),
		placeholder = 'Search…',
		emptyText = 'No matches found',
		label,
		error,
		disabled = false,
		variant = 'outline',
		size = 'h-md',
		shape = 'modern',
		shadow = 'shad-none',
		textsize = 'text-md',
		onchoose,
		empty,
		class: className = '',
		...restProps
	}: Props = $props();

	let open = $state(false);
	let query = $state(
		untrack(() => options.find((o) => o.value === value)?.label ?? '')
	);
	let active = $state(0);
	let root: HTMLElement | undefined = $state();
	const inputId = $props.id();

	const filtered = $derived(
		options.filter((o) =>
			o.label.toLowerCase().includes(query.trim().toLowerCase())
		)
	);

	function choose(o: SelectOption) {
		if (o.disabled) return;
		value = o.value;
		query = o.label;
		open = false;
		onchoose?.(o);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!open) {
				open = true;
			} else {
				active = Math.min(active + 1, filtered.length - 1);
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter' && open && filtered[active]) {
			e.preventDefault();
			choose(filtered[active]);
		} else if (e.key === 'Escape') {
			if (open) {
				e.preventDefault();
				open = false;
			}
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

<div bind:this={root} class="combobox-root box gap-xs {textsize} {className}">
	{#if label}
		<label for={inputId} class="combobox-label font-medium text-xs text-secondary">
			{label}
		</label>
	{/if}

	<div class="combobox-field relative row ycenter">
		<span class="leading-icon row ycenter xcenter text-secondary" aria-hidden="true">
			<Icon icon={luSearch} />
		</span>

		<input
			{...restProps}
			id={inputId}
			type="text"
			role="combobox"
			aria-expanded={open}
			aria-autocomplete="list"
			aria-haspopup="listbox"
			{disabled}
			{placeholder}
			bind:value={query}
			class="combobox-input variant {variant} size {size} shape {shape} {shadow}"
			onfocus={() => {
				if (!disabled) open = true;
			}}
			oninput={() => {
				open = true;
				active = 0;
			}}
			onkeydown={onKeyDown}
		/>

		<button
			type="button"
			class="chevron-btn row ycenter xcenter text-secondary"
			tabindex="-1"
			aria-hidden="true"
			disabled={disabled}
			onclick={() => {
				if (!disabled) open = !open;
			}}
		>
			<Icon icon={luChevronDown} />
		</button>
	</div>

	{#if open}
		<ul
			role="listbox"
			class="combobox-dropdown box shadow-lg shape {shape}"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			{#each filtered as opt, i (opt.value)}
				<li
					role="option"
					id="combo-opt-{i}"
					aria-selected={value === opt.value}
					aria-disabled={opt.disabled}
					class="combobox-option row ycenter xbetween {i === active ? 'active' : ''} {value === opt.value ? 'selected' : ''} {opt.disabled ? 'disabled' : ''}"
					onclick={() => choose(opt)}
					onmouseenter={() => (active = i)}
				>
					<span class="option-label text-primary">{opt.label}</span>
					{#if value === opt.value}
						<span class="check-icon text-theme" aria-hidden="true">
							<Icon icon={luCheck} />
						</span>
					{/if}
				</li>
			{:else}
				<li class="empty-item text-secondary text-sm text-center">
					{#if empty}
						{@render empty()}
					{:else}
						{emptyText}
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if error && typeof error === 'string'}
		<span class="combobox-error text-danger text-xs">{error}</span>
	{/if}
</div>

<style>
	.combobox-root {
		position: relative;
		width: 100%;
	}

	.combobox-field {
		position: relative;
		width: 100%;
	}

	.leading-icon {
		position: absolute;
		left: 0.75rem;
		pointer-events: none;
		z-index: 1;
		font-size: 0.875rem;
	}

	.chevron-btn {
		position: absolute;
		right: 0.75rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.combobox-input {
		width: 100%;
		padding-left: 2.25rem !important;
		padding-right: 2.25rem !important;
		font: inherit;
		box-sizing: border-box;
	}

	.combobox-dropdown {
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

	.combobox-option {
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm, 4px);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.combobox-option.active {
		background: var(--state-surface, #f4f4f4);
	}

	.combobox-option.selected {
		font-weight: 600;
	}

	.combobox-option.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.empty-item {
		padding: 1rem;
	}
</style>
