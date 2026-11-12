<!-- @component A custom single or multiple choice list that opens from a field, with groups, icons and typeahead. -->

<script lang="ts" generics="T">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luChevronDown, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { roving } from '../../../internal/roving.js';
	import { defaultSize, controlSize, textClass, type Shape, type Size } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { groupOptions, valueKey, type SelectOption } from './options.js';

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children' | 'type' | 'name' | 'form'> {
		/** The choices. Options sharing a `group` are listed together under that heading. */
		options: SelectOption<T>[];
		/** The chosen value — an array of values when `multiple` is set. Bindable. */
		value?: T | T[] | null;
		/** Called with the new value whenever the person changes it. */
		onValueChange?: (value: T | T[] | null) => void;
		/** Lets the person choose any number of options; `value` becomes an array and the list stays open. */
		multiple?: boolean;
		/** The text shown while nothing is chosen. */
		placeholder?: string;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the field. @default 'modern' */
		shape?: Shape;
		/** Marks the field as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** Shows a button that clears the value. */
		clearable?: boolean;
		/** The name of the hidden input(s) that carry the value in a form submission. */
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
		multiple = false,
		placeholder = 'Select…',
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
	const triggerId = $derived(idProp ?? `${uid}-trigger`);
	const listId = `${uid}-list`;

	let trigger = $state<HTMLButtonElement>();
	let list = $state<HTMLElement>();

	const selected = $derived<T[]>(
		multiple ? (Array.isArray(value) ? value : []) : value === null || value === undefined || Array.isArray(value) ? [] : [value]
	);
	const isSelected = (v: T) => selected.some((s) => Object.is(s, v));
	const chosen = $derived(options.filter((o) => isSelected(o.value)));
	const groups = $derived(groupOptions(options));
	const hasValue = $derived(selected.length > 0);

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function commit(next: T | T[] | null) {
		value = next;
		onValueChange?.(next);
	}

	function choose(option: SelectOption<T>) {
		if (option.disabled) return;
		if (multiple) {
			commit(isSelected(option.value) ? selected.filter((s) => !Object.is(s, option.value)) : [...selected, option.value]);
		} else {
			commit(option.value);
			setOpen(false);
			trigger?.focus();
		}
	}

	function clear() {
		commit(multiple ? [] : null);
		trigger?.focus();
	}

	/** Move focus into the list: the chosen option, else the first (or last) enabled one. */
	function focusInitial(from: 'start' | 'end' = 'start') {
		if (!list) return;
		const items = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'));
		const target = items.find((el) => el.getAttribute('aria-selected') === 'true') ?? (from === 'end' ? items.at(-1) : items[0]);
		(target ?? list).focus();
	}

	let initialFrom: 'start' | 'end' = 'start';

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			initialFrom = event.key === 'ArrowUp' ? 'end' : 'start';
			setOpen(true);
		}
	}

	function onOptionKeydown(event: KeyboardEvent, option: SelectOption<T>) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			choose(option);
		}
	}

	function onListKeydown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
			trigger?.focus();
		}
	}

	$effect(() => {
		if (!open) return;
		const from = initialFrom;
		initialFrom = 'start';
		const frame = requestAnimationFrame(() => focusInitial(from));
		return () => cancelAnimationFrame(frame);
	});

	function onPopoverChange(next: boolean) {
		setOpen(next);
		// a dismissal (Esc, outside press) from inside the list hands focus back to the field
		if (!next && list && (list.contains(document.activeElement) || document.activeElement === document.body)) trigger?.focus();
	}
</script>

<div
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
	<button
		bind:this={trigger}
		id={triggerId}
		type="button"
		class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans text-primary', textClass[textSize ?? resolvedSize], resolvedShape, clearable && hasValue ? 'pr-3xl' : 'pr-2xl']}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={listId}
		popovertarget={listId}
		{disabled}
		onkeydown={onTriggerKeydown}
		{...rest}
	>
		{#if !multiple && chosen[0]?.icon}
			<Icon icon={chosen[0].icon} class="text-secondary shrink-0" />
		{/if}
		<span class={['truncate grow', !hasValue && 'text-muted']}>
			{hasValue ? chosen.map((o) => o.label).join(', ') : placeholder}
		</span>
		{#if multiple && chosen.length > 1}
			<span class="text-xs text-muted tabular-nums shrink-0">{chosen.length}</span>
		{/if}
	</button>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && hasValue && !disabled}
			<button
				type="button"
				class="pointer-auto btn-icon h-md ghost round text-muted"
				aria-label="Clear selection"
				onclick={clear}
			>
				<Icon icon={luX} />
			</button>
		{/if}
		<Icon icon={luChevronDown} class={['caret text-muted', open && 'open']} />
	</span>
</div>

<div
	bind:this={list}
	id={listId}
	popover="auto"
	role="listbox"
	tabindex="-1"
	aria-labelledby={triggerId}
	aria-multiselectable={multiple || undefined}
	class={[
		'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs focus-none',
		textClass[textSize ?? resolvedSize]
	]}
	onkeydown={onListKeydown}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, onPopoverChange)}
	{@attach roving({ selector: '[role="option"]', loop: false, typeahead: true, tabindex: true })}
>
	{#each groups as g, gi (g.group ?? `__${gi}`)}
		<div role="group" aria-labelledby={g.group ? `${uid}-g${gi}` : undefined} class="box">
			{#if g.group}
				<div id={`${uid}-g${gi}`} class="text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none">{g.group}</div>
			{/if}
			{#each g.options as option (valueKey(option.value))}
				{@const on = isSelected(option.value)}
				<div
					role="option"
					tabindex="-1"
					aria-selected={on}
					aria-disabled={option.disabled || undefined}
					class="item"
					onclick={() => choose(option)}
					onkeydown={(event) => onOptionKeydown(event, option)}
				>
					{#if option.icon}
						<Icon icon={option.icon} class="text-secondary shrink-0" />
					{/if}
					<span class="box grow wmin0">
						<span class="truncate">{option.label}</span>
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
		<div class="px-sm py-sm text-sm text-muted">No options</div>
	{/each}
</div>

{#if name}
	{#each selected.length ? selected : [null] as v, i (i)}
		<input type="hidden" {name} value={valueKey(v)} disabled={disabled || undefined} />
	{/each}
{/if}
