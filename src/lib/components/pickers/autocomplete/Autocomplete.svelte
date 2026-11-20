<!-- @component Free-text input with floating filtered suggestions, keyboard navigation, and clear control. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luLoaderCircle, luSearch, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/helpers.js';
	import { defaultSize, type Shape, type Size, type TextSize } from '../../../internal/tokens.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import { useFieldControl } from '../../inputs/field/field.js';
	import { normalizeAutocompleteOptions, type AutocompleteOption } from './autocomplete.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'children' | 'disabled'> {
		/** Current text input value; bindable. */
		value?: string;
		/** Called whenever typed text or selected suggestion changes `value`. */
		onValueChange?: (value: string) => void;
		/** Called when an option is picked from the list. */
		onSelect?: (item: AutocompleteOption) => void;
		/** Suggestion list (strings or rich objects). */
		options: (string | AutocompleteOption)[];
		/** Placeholder displayed when empty. */
		placeholder?: string;
		/** Control height on the shared size ladder. */
		size?: Size;
		/** Text scale override independent of `size`. */
		textSize?: TextSize;
		/** Corner shape. */
		shape?: Shape;
		/** Input frame visual appearance. */
		look?: 'outline' | 'filled' | 'ghost';
		/** Show a spinner while suggestions are loading asynchronously. */
		loading?: boolean;
		/** Show a clear button when `value` is non-empty. */
		clearable?: boolean;
		/** Disable typing and opening suggestions. */
		disabled?: boolean;
		/** Mark the input invalid. */
		invalid?: boolean;
		/** Text displayed inside the popup when no options match. */
		emptyText?: string;
	}

	let {
		value = $bindable(''),
		onValueChange,
		onSelect,
		options,
		placeholder = 'Type to search…',
		size,
		textSize,
		shape,
		look,
		loading = false,
		clearable = true,
		disabled,
		invalid,
		emptyText = 'No matches found',
		id,
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const listId = `${uid}-list`;
	const control = useFieldControl(uid, () => ({ id, invalid, disabled, size, shape, look }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedLook = $derived(look ?? control.look ?? 'outline');

	let open = $state(false);
	let activeIndex = $state(-1);
	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLDivElement | null>(null);

	const normalized = $derived(normalizeAutocompleteOptions(options));
	const filtered = $derived.by(() => {
		const q = value.trim().toLowerCase();
		if (!q) return normalized;
		return normalized.filter(
			(opt) =>
				opt.label.toLowerCase().includes(q) ||
				opt.value.toLowerCase().includes(q) ||
				(opt.description?.toLowerCase().includes(q) ?? false)
		);
	});

	function setOpen(next: boolean) {
		if (control.disabled) {
			open = false;
			return;
		}
		open = next;
		if (next) activeIndex = filtered.length > 0 ? 0 : -1;
	}

	function choose(item: AutocompleteOption) {
		if (item.disabled || control.disabled) return;
		value = item.label;
		onValueChange?.(item.label);
		onSelect?.(item);
		open = false;
		inputEl?.focus();
	}

	function clear() {
		value = '';
		onValueChange?.('');
		setOpen(true);
		inputEl?.focus();
	}

	function onInput(event: Event) {
		const next = (event.currentTarget as HTMLInputElement).value;
		value = next;
		onValueChange?.(next);
		setOpen(true);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (open) {
				event.preventDefault();
				open = false;
			}
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				return;
			}
			const count = filtered.length;
			if (count > 0) activeIndex = (activeIndex + 1 + count) % count;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				return;
			}
			const count = filtered.length;
			if (count > 0) activeIndex = (activeIndex - 1 + count) % count;
		} else if (event.key === 'Enter' && open && activeIndex >= 0 && activeIndex < filtered.length) {
			const candidate = filtered[activeIndex];
			if (candidate && !candidate.disabled) {
				event.preventDefault();
				choose(candidate);
			}
		}
	}

	function onBlur(event: FocusEvent) {
		const related = event.relatedTarget as Node | null;
		if (related && listEl?.contains(related)) return;
		open = false;
	}

	const frame = $derived(
		frameClasses({
			look: resolvedLook,
			size: resolvedSize,
			textSize,
			shape: resolvedShape,
			invalid: control.invalid,
			disabled: control.disabled
		})
	);
</script>

<div class={['anchor', frame, className]} {@attach anchor(uid)}>
	<span class="pl-sm text-muted row ycenter pointer-none shrink-0" aria-hidden="true">
		{#if loading}
			<Icon icon={luLoaderCircle} class="anim-spin" />
		{:else}
			<Icon icon={luSearch} />
		{/if}
	</span>

	<input
		bind:this={inputEl}
		id={control.id}
		type="text"
		role="combobox"
		autocomplete="off"
		spellcheck="false"
		aria-autocomplete="list"
		aria-expanded={open}
		aria-controls={listId}
		aria-activedescendant={open && activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
		aria-invalid={control.invalid || undefined}
		aria-describedby={control.describedby}
		disabled={control.disabled}
		{placeholder}
		{value}
		class={['cover bare pl-2xl bg-none font-sans focus-none', clearable && value ? 'pr-2xl' : 'pr-md']}
		oninput={onInput}
		onkeydown={onKeyDown}
		onfocus={() => setOpen(true)}
		onblur={onBlur}
		{...rest}
	/>

	{#if clearable && value && !control.disabled}
		<button
			type="button"
			class="relative z-raised btn-icon h-md ghost round mr-xs text-muted"
			aria-label="Clear input"
			onclick={clear}
		>
			<Icon icon={luX} />
		</button>
	{/if}
</div>

<div
	bind:this={listEl}
	id={listId}
	popover="manual"
	role="listbox"
	tabindex="-1"
	class={[
		'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs focus-none',
		textSize
	]}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, (v) => (open = v))}
>
	{#if loading && filtered.length === 0}
		<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">
			<Icon icon={luLoaderCircle} class="anim-spin" />
			Loading suggestions…
		</div>
	{:else if filtered.length === 0}
		<div class="px-sm py-sm text-sm text-muted">{emptyText}</div>
	{:else}
		{#each filtered as option, i (option.value)}
			<button
				id={`${uid}-opt-${i}`}
				type="button"
				role="option"
				tabindex="-1"
				aria-selected={value === option.label}
				aria-disabled={option.disabled || undefined}
				disabled={option.disabled}
				class={['item row ycenter xbetween', i === activeIndex && 'highlighted', option.disabled && 'disabled']}
				onmousedown={(e) => {
					e.preventDefault();
					choose(option);
				}}
			>
				<span class="column xleft min0">
					<span class="truncate weight-500">{option.label}</span>
					{#if option.description}
						<span class="text-xs text-muted truncate">{option.description}</span>
					{/if}
				</span>
			</button>
		{/each}
	{/if}
</div>
