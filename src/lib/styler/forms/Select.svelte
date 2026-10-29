<!-- @component A select menu, native or as a filterable listbox, with option groups. -->

<script lang="ts" module>
	export interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
		group?: string;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luSearch, luChevronDown } from '@fractaldesign/icons/lucide';
	import type { Variant, Surface, Size, Shape, Shadow } from '../types';
	import { getFieldLook } from './field-context';
	import CloseButton from '../actions/CloseButton.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string | number;
		options?: SelectOption[];
		placeholder?: string;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		/** Filterable listbox. Off renders the native <select class="select">. */
		searchable?: boolean;
		searchPlaceholder?: string;
		clearable?: boolean;
		variant?: Variant;
		/** Fill; overrides the variant's background. */
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		id?: string;
		class?: string;
	}

	const field = getFieldLook();

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
		searchPlaceholder = 'Search options…',
		clearable = false,
		variant = field.variant ?? 'outline',
		surface = field.surface,
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const selectId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error) || Boolean(field.invalid));
	const fill = $derived([surface && `el-surface ${surface}`, invalid && 'is-invalid'].filter(Boolean).join(' '));
	const canClear = $derived(clearable && value !== undefined && !disabled);
	const selected = $derived(options.find((o) => o.value === value));

	// Native path: optgroups from option.group, in first-seen order.
	const grouped = $derived.by(() => {
		const out: { group?: string; items: SelectOption[] }[] = [];
		for (const opt of options) {
			const last = out[out.length - 1];
			if (last && last.group === opt.group) last.items.push(opt);
			else out.push({ group: opt.group, items: [opt] });
		}
		return out;
	});

	function onNativeChange(e: Event) {
		const raw = (e.currentTarget as HTMLSelectElement).value;
		value = options.find((o) => String(o.value) === raw)?.value;
	}

	// Searchable path: a combobox + listbox panel.
	let open = $state(false);
	let query = $state('');
	let highlighted = $state(-1);
	let containerEl: HTMLDivElement | null = $state(null);
	let searchEl: HTMLInputElement | null = $state(null);
	let triggerEl: HTMLButtonElement | null = $state(null);

	const filtered = $derived(
		query.trim() ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase().trim())) : options
	);

	function openMenu() {
		if (disabled) return;
		open = true;
		query = '';
		highlighted = Math.max(0, filtered.findIndex((o) => o.value === value));
		queueMicrotask(() => searchEl?.focus());
	}

	function closeMenu(refocus = true) {
		open = false;
		query = '';
		highlighted = -1;
		if (refocus) triggerEl?.focus();
	}

	function choose(opt: SelectOption) {
		if (opt.disabled) return;
		value = opt.value;
		closeMenu();
	}

	function onMenuKeydown(e: KeyboardEvent) {
		const len = filtered.length;
		if (e.key === 'Escape') {
			e.preventDefault();
			closeMenu();
		} else if (e.key === 'ArrowDown' && len) {
			e.preventDefault();
			highlighted = (highlighted + 1) % len;
		} else if (e.key === 'ArrowUp' && len) {
			e.preventDefault();
			highlighted = (highlighted - 1 + len) % len;
		} else if (e.key === 'Enter' && filtered[highlighted]) {
			e.preventDefault();
			choose(filtered[highlighted]);
		} else if (e.key === 'Tab') {
			closeMenu(false);
		}
	}

	$effect(() => {
		if (!open) return;
		const away = (event: PointerEvent) => {
			if (containerEl && !containerEl.contains(event.target as Node)) closeMenu(false);
		};
		document.addEventListener('pointerdown', away);
		return () => document.removeEventListener('pointerdown', away);
	});
</script>

<div bind:this={containerEl} class="box gap-xs {className}" {...restProps}>
	{#if label}
		<label class="text-xs weight-500 text-secondary" for={selectId}>{label}</label>
	{/if}
	{#if description}
		<span id="{selectId}-desc" class="text-body-sm text-muted">{description}</span>
	{/if}

	{#if !searchable}
		<div class="row ycenter gap-xs">
			<div class="select-wrap relative row ycenter grow min0">
			<select
				id={selectId}
				class="select grow min0 el-variant el-size el-shape {variant} {size} {shape} {shadow} {fill}"
				{disabled}
				aria-invalid={invalid || undefined}
				aria-describedby={description ? `${selectId}-desc` : undefined}
				onchange={onNativeChange}
			>
				<option value="" disabled selected={value === undefined}>{placeholder}</option>
				{#each grouped as block, b (b)}
					{#if block.group}
						<optgroup label={block.group}>
							{#each block.items as opt (opt.value)}
								<option value={String(opt.value)} disabled={opt.disabled} selected={opt.value === value}>{opt.label}</option>
							{/each}
						</optgroup>
					{:else}
						{#each block.items as opt (opt.value)}
							<option value={String(opt.value)} disabled={opt.disabled} selected={opt.value === value}>{opt.label}</option>
						{/each}
					{/if}
				{/each}
			</select>
			<!-- our own chevron (not fractalstyler's fixed-grey arrow) so it follows the fill's ink -->
			<Icon
				icon={luChevronDown}
				class="select-chevron shrink-0 {surface ? 'ink-auto' : 'text-muted'}"
				style={surface ? `--ink-bg: var(--${surface === 'bg-main' ? 'bg' : surface})` : undefined}
			/>
			</div>
			{#if canClear}
				<CloseButton label="Clear selection" size="h-sm" onclick={() => (value = undefined)} />
			{/if}
		</div>
	{:else}
		<!-- The panel is .absolute with no offsets, so it sits at its static
		     position: directly under the trigger, full width via .wfull. -->
		<div class="relative">
			<div class="row ycenter gap-xs pr-xs el-variant el-size el-shape {variant} {size} {shape} {shadow} {fill}">
				<button
					bind:this={triggerEl}
					id={selectId}
					type="button"
					role="combobox"
					class="row xbetween grow min0 hfull px-sm el-shape {shape}"
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls="{selectId}-listbox"
					aria-invalid={invalid || undefined}
					{disabled}
					onclick={() => (open ? closeMenu() : openMenu())}
					onkeydown={(e) => {
						if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
							e.preventDefault();
							openMenu();
						}
					}}
				>
					<span class="truncate {selected ? 'text-primary' : 'text-muted'}">{selected?.label ?? placeholder}</span>
					<Icon icon={luChevronDown} class="text-muted shrink-0" />
				</button>
				{#if canClear}
					<CloseButton label="Clear selection" size="h-sm" onclick={() => (value = undefined)} />
				{/if}
			</div>
			{#if open}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="absolute wfull box gap-xs pad-xs mt-xs bg-surface border shadow-md radius-md" onkeydown={onMenuKeydown}>
					<div class="row ycenter gap-xs px-xs bb-sub">
						<Icon icon={luSearch} class="text-muted shrink-0" />
						<input
							bind:this={searchEl}
							bind:value={query}
							type="text"
							class="input grow min0 h-lg border-none"
							style:background="transparent"
							placeholder={searchPlaceholder}
							aria-label={searchPlaceholder}
							aria-controls="{selectId}-listbox"
							aria-activedescendant={highlighted >= 0 ? `${selectId}-opt-${highlighted}` : undefined}
						/>
					</div>
					<div id="{selectId}-listbox" role="listbox" class="box">
						{#each filtered as opt, i (opt.value)}
							<div
								id="{selectId}-opt-{i}"
								role="option"
								tabindex="-1"
								aria-selected={opt.value === value}
								aria-disabled={opt.disabled || undefined}
								class="row ycenter xbetween gap-sm px-sm py-xs radius-sm text-sm {i === highlighted
									? 'bg-sunken'
									: ''} {opt.disabled ? 'text-muted' : opt.value === value ? 'text-theme' : 'text-primary'}"
								onclick={() => choose(opt)}
								onkeydown={() => {}}
								onpointerenter={() => !opt.disabled && (highlighted = i)}
							>
								<span class="truncate">{opt.label}</span>
								{#if opt.value === value}<Icon icon={luCheck} class="shrink-0" />{/if}
							</div>
						{:else}
							<div class="px-sm py-xs text-sm text-muted">No options found</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if errorMessage}
		<p class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
