<!-- @component Multi-value selection input with chips, search filtering, and keyboard navigation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import Tag from '../display/Tag.svelte';
	import { klCheck, klChevronDown } from '$lib/icons/keylinestroke.js';
	import type { SelectOption, Variant, Size, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		options: SelectOption[];
		/** Bindable list of the selected option values. */
		value?: (string | number)[];
		placeholder?: string;
		label?: string;
		/** Most options that can be selected at once. */
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
		size = 'h-lg',
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

<div bind:this={root} class="box gap-xs {textsize} {className}" {...restProps}>
	{#if label}
		<label for={inputId} class="text-xs weight-500 text-secondary">{label}</label>
	{/if}
	<!-- The panel is .absolute with no offsets, so it sits at its static
	     position: directly under the field, full width via .wfull. -->
	<div class="relative">
		<!-- svelte-ignore a11y_click_events_have_key_events (the input inside takes the keys) -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="field row ycenter wrap gap-xs px-sm py-xs hgrow {variant} {size} {shape} {shadow}"
			onclick={() => {
				if (!disabled) {
					open = true;
					inputEl?.focus();
				}
			}}
		>
			{#each selectedOptions as opt (opt.value)}
				<Tag removable={!disabled} removeLabel="Remove {opt.label}" onremove={() => removeValue(opt.value)}>{opt.label}</Tag>
			{/each}
			<input
				bind:this={inputEl}
				id={inputId}
				type="text"
				role="combobox"
				aria-expanded={open}
				aria-controls="{inputId}-listbox"
				aria-activedescendant={open && filtered[active] ? `${inputId}-opt-${active}` : undefined}
				aria-autocomplete="list"
				{disabled}
				placeholder={selectedOptions.length === 0 ? placeholder : ''}
				bind:value={query}
				class="input grow min0 px-xs border-none bg-none"
				onfocus={() => {
					if (!disabled) open = true;
				}}
				onkeydown={onKeyDown}
			/>
			<Icon icon={klChevronDown} class="text-muted" />
		</div>
		{#if open}
			<ul
				id="{inputId}-listbox"
				role="listbox"
				aria-multiselectable="true"
				tabindex="-1"
				class="absolute wfull z-raised box gap-xs pad-xs mt-xs scroll-menu bg-overlay border shad-md {shape}"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events (keys are handled on the input) -->
				{#each filtered as opt, i (opt.value)}
					{@const isSelected = value.includes(opt.value)}
					{@const blocked = opt.disabled || (isFull && !isSelected)}
					<li
						role="option"
						id="{inputId}-opt-{i}"
						aria-selected={isSelected}
						aria-disabled={blocked || undefined}
						class="row ycenter xbetween gap-sm px-sm py-xs mincurved text-sm {i === active
							? 'state-hover'
							: ''} {blocked ? 'text-muted' : isSelected ? 'pointer text-theme weight-600' : 'pointer text-primary'}"
						onclick={() => toggleOption(opt)}
						onpointerenter={() => !blocked && (active = i)}
					>
						<span class="truncate">{opt.label}</span>
						{#if isSelected}<Icon icon={klCheck} />{/if}
					</li>
				{:else}
					<li class="pad-bs text-sm text-muted ta-c">No options match</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
