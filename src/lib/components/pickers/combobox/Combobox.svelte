<!-- @component A searchable field with a filtered list of options, following the ARIA 1.2 combobox pattern. -->

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luChevronDown, luLoaderCircle, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { defaultSize, controlSize, textClass, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { groupOptions, valueKey, type SelectOption } from '../select/options.js';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'size' | 'children' | 'type' | 'name' | 'form'> {
		/** The choices. Options sharing a `group` are listed together under that heading. */
		options: SelectOption<T>[];
		/** The chosen value. Bindable. */
		value?: T | null;
		/** Called with the new value whenever the person chooses or clears it. */
		onValueChange?: (value: T | null) => void;
		/** The text in the field. Bindable. */
		inputValue?: string;
		/** Called whenever the person types, with the new field text — useful for loading options asynchronously. */
		onInputChange?: (value: string) => void;
		/** Called whenever `inputValue` changes, including when a choice fills the field. */
		onInputValueChange?: (value: string) => void;
		/** Decides which options match the field text. Defaults to a case-insensitive label match. */
		filter?: (option: SelectOption<T>, query: string) => boolean;
		/** Lets the person commit the typed text as the value, even when it matches no option. */
		allowCustom?: boolean;
		/** Shows a loading indicator in the list, for async option loading. */
		loading?: boolean;
		/** Content shown when the filter matches nothing and the list is not loading. */
		empty?: Snippet;
		/** The text shown while the field is empty. */
		placeholder?: string;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the field. @default 'modern' */
		shape?: Shape;
		/** Marks the field as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** Shows a button that clears the value and the field. */
		clearable?: boolean;
		/** The name of the hidden input that carries the value in a form submission. */
		name?: string;
		/** Whether the list is showing. Bindable. */
		open?: boolean;
		/** Called when the list opens or closes. */
		onOpenChange?: (open: boolean) => void;
	}

	let {
		options,
		value = $bindable(null),
		onValueChange,
		inputValue = $bindable(''),
		onInputChange,
		onInputValueChange,
		filter = defaultFilter,
		allowCustom = false,
		loading = false,
		empty,
		placeholder = 'Search…',
		size,
		textSize,
		shape,
		invalid,
		clearable = false,
		name,
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		id: idProp,
		class: klass,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);

	const uid = $props.id();
	const inputId = $derived(idProp ?? `${uid}-input`);
	const listId = `${uid}-list`;

	let field = $state<HTMLElement>();
	let input = $state<HTMLInputElement>();
	let list = $state<HTMLElement>();
	let activeIndex = $state(0);

	function defaultFilter(option: SelectOption<T>, query: string): boolean {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return option.label.toLowerCase().includes(q) || (option.description?.toLowerCase().includes(q) ?? false);
	}

	const filtered = $derived(options.filter((o) => filter(o, inputValue)));
	const enabled = $derived(filtered.filter((o) => !o.disabled));
	const groups = $derived(groupOptions(filtered));
	const active = $derived(enabled[Math.min(Math.max(activeIndex, 0), Math.max(enabled.length - 1, 0))] ?? null);
	const activeId = $derived(active ? `${uid}-opt-${valueKey(active.value)}` : undefined);
	const hasValue = $derived(value !== null && value !== undefined);

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
		if (next) syncActive();
	}

	function setInput(next: string, fromUser = false) {
		if (inputValue === next) return;
		inputValue = next;
		onInputValueChange?.(next);
		if (fromUser) onInputChange?.(next);
	}

	function commit(next: T | null) {
		value = next;
		onValueChange?.(next);
	}

	function syncActive() {
		const idx = enabled.findIndex((o) => Object.is(o.value, value));
		activeIndex = idx >= 0 ? idx : 0;
	}

	function choose(option: SelectOption<T>) {
		if (option.disabled) return;
		commit(option.value);
		setInput(option.label);
		setOpen(false);
		input?.focus();
	}

	function chooseCustom() {
		if (!allowCustom) return;
		const exact = enabled.find((o) => o.label.toLowerCase() === inputValue.trim().toLowerCase());
		if (exact) {
			choose(exact);
			return;
		}
		const typed = inputValue.trim();
		if (!typed) {
			commit(null);
			setOpen(false);
			return;
		}
		commit(typed as T);
		setOpen(false);
	}

	function clear() {
		commit(null);
		setInput('');
		input?.focus();
		setOpen(true);
	}

	function onFieldInput(event: Event) {
		const next = (event.currentTarget as HTMLInputElement).value;
		setInput(next, true);
		activeIndex = 0;
		setOpen(true);
	}

	function onInputKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				syncActive();
			} else if (enabled.length) {
				activeIndex = Math.min(activeIndex + 1, enabled.length - 1);
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				syncActive();
			} else if (enabled.length) {
				activeIndex = Math.max(activeIndex - 1, 0);
			}
		} else if (event.key === 'Enter') {
			if (!open) return;
			event.preventDefault();
			if (active && !active.disabled) choose(active);
			else if (allowCustom) chooseCustom();
		} else if (event.key === 'Escape') {
			if (open) {
				event.preventDefault();
				setOpen(false);
			}
		}
	}

	function onBlur() {
		const frame = requestAnimationFrame(() => {
			const next = document.activeElement;
			if (field?.contains(next) || list?.contains(next)) return;
			if (!inputValue.trim()) {
				commit(null);
			} else if (allowCustom) {
				const exact = options.find((o) => o.label.toLowerCase() === inputValue.trim().toLowerCase() && !o.disabled);
				if (exact) {
					commit(exact.value);
					setInput(exact.label);
				} else {
					commit(inputValue.trim() as T);
				}
			} else {
				const exact = options.find((o) => Object.is(o.value, value));
				if (exact) setInput(exact.label);
			}
			setOpen(false);
		});
		return () => cancelAnimationFrame(frame);
	}

	function onPopoverChange(next: boolean) {
		setOpen(next);
	}

	$effect(() => {
		if (!open) return;
		const onDown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (field?.contains(target) || list?.contains(target)) return;
			setOpen(false);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});

	function marks(label: string, query: string): { text: string; hit: boolean }[] {
		const q = query.trim();
		if (!q) return [{ text: label, hit: false }];
		const lower = label.toLowerCase();
		const needle = q.toLowerCase();
		const parts: { text: string; hit: boolean }[] = [];
		let cursor = 0;
		while (cursor < label.length) {
			const at = lower.indexOf(needle, cursor);
			if (at < 0) {
				parts.push({ text: label.slice(cursor), hit: false });
				break;
			}
			if (at > cursor) parts.push({ text: label.slice(cursor, at), hit: false });
			parts.push({ text: label.slice(at, at + q.length), hit: true });
			cursor = at + q.length;
		}
		return parts;
	}
</script>

<div
	bind:this={field}
	class={[
		'field anchor relative row ycenter xright bg-input border',
		controlSize(resolvedSize, textSize),
		resolvedShape,
		resolvedInvalid && 'is-invalid',
		disabled && 'disabled',
		klass
	]}
	aria-invalid={resolvedInvalid || undefined}
	{@attach anchor(uid)}
>
	<input
		bind:this={input}
		id={inputId}
		type="text"
		role="combobox"
		class={['cover bare pl-md bg-none text-primary font-sans focus-none', textClass[textSize ?? resolvedSize], resolvedShape, clearable && hasValue ? 'pr-3xl' : 'pr-2xl']}
		autocomplete="off"
		spellcheck="false"
		aria-autocomplete="list"
		aria-expanded={open}
		aria-controls={listId}
		aria-activedescendant={open ? activeId : undefined}
		aria-invalid={resolvedInvalid || undefined}
		{placeholder}
		{disabled}
		value={inputValue}
		oninput={onFieldInput}
		onkeydown={onInputKeydown}
		onfocus={() => setOpen(true)}
		onblur={onBlur}
		{...rest}
	/>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && (hasValue || inputValue) && !disabled}
			<button
				type="button"
				class="pointer-auto btn-icon h-md ghost round text-muted"
				aria-label="Clear"
				onclick={clear}
			>
				<Icon icon={luX} />
			</button>
		{/if}
		<button
			type="button"
			class="pointer-auto btn-icon h-md ghost round text-muted"
			tabindex="-1"
			aria-label={open ? 'Close options' : 'Open options'}
			disabled={disabled}
			onclick={() => {
				setOpen(!open);
				input?.focus();
			}}
		>
			<Icon icon={luChevronDown} class={['caret text-muted', open && 'open']} />
		</button>
	</span>
</div>

<div
	bind:this={list}
	id={listId}
	popover="manual"
	role="listbox"
	tabindex="-1"
	aria-labelledby={inputId}
	class={[
		'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs focus-none',
		textClass[textSize ?? resolvedSize]
	]}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, onPopoverChange)}
>
	{#if loading}
		<div class="row ycenter gap-sm px-sm py-sm text-sm text-muted">
			<Icon icon={luLoaderCircle} class="anim-spin" />
			Searching…
		</div>
	{/if}
	{#each groups as g, gi (g.group ?? `__${gi}`)}
		<div role="group" aria-labelledby={g.group ? `${uid}-g${gi}` : undefined} class="box">
			{#if g.group}
				<div id={`${uid}-g${gi}`} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>
			{/if}
			{#each g.options as option (valueKey(option.value))}
				{@const on = Object.is(value, option.value)}
				{@const isActive = active != null && Object.is(active.value, option.value)}
				<div
					id={`${uid}-opt-${valueKey(option.value)}`}
					role="option"
					tabindex="-1"
					aria-selected={on}
					aria-disabled={option.disabled || undefined}
					class={['item', isActive && 'highlighted']}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => choose(option)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							choose(option);
						}
					}}
				>
					{#if option.icon}
						<Icon icon={option.icon} class="text-secondary shrink-0" />
					{/if}
					<span class="box grow wmin0">
						<span class="truncate">
							{#each marks(option.label, inputValue) as part, i (`${i}:${part.text}`)}
								{#if part.hit}<span class="weight-600 text-theme">{part.text}</span>{:else}{part.text}{/if}
							{/each}
						</span>
						{#if option.description}
							<span class="text-xs text-muted truncate">{option.description}</span>
						{/if}
					</span>
					{#if on}
						<Icon icon={luCheck} class="text-theme shrink-0" />
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		{#if !loading}
			<div class="px-sm py-sm text-sm text-muted">
				{#if empty}{@render empty()}{:else}No matches{/if}
			</div>
		{/if}
	{/each}
</div>

{#if name}
	<input type="hidden" {name} value={valueKey(value)} disabled={disabled || undefined} />
{/if}
