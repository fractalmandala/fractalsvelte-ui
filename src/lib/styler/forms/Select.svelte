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
	import { Icon } from 'fractalicons';
	import { luX, luCheck, luSearch, luChevronDown } from 'fractalicons/lucide';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_PAINT, FIELD_HEIGHT, SHAPE_RADIUS } from '../classes';

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
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
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
		searchPlaceholder = 'Search options…',
		clearable = false,
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const selectId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
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
			<select
				id={selectId}
				class="select grow min0"
				data-variant={variant}
				data-size={size}
				data-shape={shape}
				{disabled}
				aria-invalid={error ? true : undefined}
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
			{#if canClear}
				<button type="button" data-variant="iconbox" class="px-xs text-muted" aria-label="Clear selection" onclick={() => (value = undefined)}>
					<Icon icon={luX} />
				</button>
			{/if}
		</div>
	{:else}
		<!-- The panel is .absolute with no offsets, so it sits at its static
		     position: directly under the trigger, full width via .wfull. -->
		<div class="relative">
			<div class="row ycenter gap-xs pr-xs {FIELD_PAINT[variant]} {FIELD_HEIGHT[size]} {SHAPE_RADIUS[shape]}">
				<button
					bind:this={triggerEl}
					id={selectId}
					type="button"
					role="combobox"
					class="row xbetween grow min0 hfull {SHAPE_RADIUS[shape]}"
					data-variant="ghost"
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls="{selectId}-listbox"
					aria-invalid={error ? true : undefined}
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
					<button type="button" data-variant="iconbox" class="px-xs text-muted" aria-label="Clear selection" onclick={() => (value = undefined)}>
						<Icon icon={luX} />
					</button>
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
							class="input grow min0"
							data-variant="ghost"
							data-size="lg"
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
