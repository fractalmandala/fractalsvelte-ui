<!-- @component Searchable combobox input with dropdown suggestions, keyboard navigation, and custom empty state. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import Icon from './Icon.svelte';
	import { klCheck, klChevronDown, klSearch } from '$lib/icons/keylinestroke.js';
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
		size = 'h-lg',
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

<div bind:this={root} class="box gap-xs {textsize} {className}">
	{#if label}
		<label for={inputId} class="text-xs weight-500 text-secondary">{label}</label>
	{/if}
	<!-- The panel is .absolute with no offsets, so it sits at its static
	     position: directly under the field, full width via .wfull. -->
	<div class="relative">
		<div class="field row ycenter gap-xs px-sm {variant} {size} {shape} {shadow} {error ? 'is-invalid' : ''}">
			<Icon icon={klSearch} class="text-muted" />
			<input
				{...restProps}
				id={inputId}
				type="text"
				role="combobox"
				aria-expanded={open}
				aria-controls="{inputId}-listbox"
				aria-activedescendant={open && filtered[active] ? `${inputId}-opt-${active}` : undefined}
				aria-autocomplete="list"
				aria-haspopup="listbox"
				aria-invalid={error ? true : undefined}
				{disabled}
				{placeholder}
				bind:value={query}
				class="input grow min0 hfull px-xs border-none bg-none"
				onfocus={() => {
					if (!disabled) open = true;
				}}
				oninput={() => {
					open = true;
					active = 0;
				}}
				onkeydown={onKeyDown}
			/>
			<Icon icon={klChevronDown} class="text-muted" />
		</div>
		{#if open}
			<ul
				id="{inputId}-listbox"
				role="listbox"
				tabindex="-1"
				class="absolute wfull z-raised box gap-xs pad-xs mt-xs scroll-menu bg-overlay border shad-md {shape}"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events (keys are handled on the input) -->
				{#each filtered as opt, i (opt.value)}
					<li
						role="option"
						id="{inputId}-opt-{i}"
						aria-selected={value === opt.value}
						aria-disabled={opt.disabled || undefined}
						class="row ycenter xbetween gap-sm px-sm py-xs mincurved text-sm {i === active
							? 'state-hover'
							: ''} {opt.disabled ? 'text-muted' : value === opt.value ? 'pointer text-theme weight-600' : 'pointer text-primary'}"
						onclick={() => choose(opt)}
						onpointerenter={() => !opt.disabled && (active = i)}
					>
						<span class="truncate">{opt.label}</span>
						{#if value === opt.value}<Icon icon={klCheck} />{/if}
					</li>
				{:else}
					<li class="pad-bs text-sm text-muted ta-c">
						{#if empty}
							{@render empty()}
						{:else}
							{emptyText}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if typeof error === 'string'}
		<p class="text-body-sm text-danger" role="alert">{error}</p>
	{/if}
</div>
