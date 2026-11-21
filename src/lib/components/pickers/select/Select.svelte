<!-- @component A custom single or multiple choice list that opens from a field, with groups, icons and typeahead. -->

<script lang="ts" generics="T">
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luChevronDown, luX } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync, roving } from '../../../internal/helpers.js';
	import { defaultSize, type ChildTextSize, type Pad, type Shape, type Size, type Surface, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
import { getFieldContext } from '../../inputs/field/field.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import { groupOptions, valueKey, type SelectOption } from './options.js';

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children' | 'type' | 'name' | 'form' | 'disabled'> {
		options: SelectOption<T>[];
		value?: T | T[] | null;
		onValueChange?: (value: T | T[] | null) => void;
		multiple?: boolean;
		placeholder?: string;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		surface?: Surface;
		invalid?: boolean;
		clearable?: boolean;
		name?: string;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
			disabled?: boolean | null;
}

	let {
		options,
		value = $bindable(null),
		onValueChange,
		multiple = false,
		placeholder = 'Select…',
		size,
		textSize,
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		shape,
		variant,
		surface = 'glass',
		invalid,
		clearable = false,
		name,
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		id: idProp,
		class: className,
		...rest
	}: Props = $props();

	const fieldCtx = getFieldContext();
	const resolvedSize = $derived(size ?? fieldCtx?.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? fieldCtx?.shape ?? 'modern');
	const resolvedVariant = $derived<Variant>(variant ?? fieldCtx?.variant ?? 'outline');
	const resolvedInvalid = $derived(invalid ?? fieldCtx?.invalid ?? false);
	const frame = $derived([
		...frameClasses({
			variant: resolvedVariant,
			size: resolvedSize,
			textSize,
			shape: resolvedShape,
			invalid: resolvedInvalid,
			disabled: Boolean(disabled)
		}),
		'font-sans relative anchor xright',
		className
	]);

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
	class={frame}
	aria-invalid={resolvedInvalid || undefined}
	{@attach anchor(uid)}
>
	<button
		bind:this={trigger}
		id={triggerId}
		type="button"
		class={['cover row ycenter xleft gap-sm pl-md bg-none border-none focus-none font-sans', textSize, resolvedShape, clearable && hasValue ? 'pr-3xl' : 'pr-2xl']}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={listId}
		popovertarget={listId}
		{disabled}
		onkeydown={onTriggerKeydown}
		{...rest}
	>
		{#if !multiple && chosen[0]?.icon}
			<Icon icon={chosen[0].icon} class={['shrink-0', childTextColor]} />
		{/if}
		<span class={['truncate grow', !hasValue && childTextColor]}>
			{hasValue ? chosen.map((o) => o.label).join(', ') : placeholder}
		</span>
		{#if multiple && chosen.length > 1}
			<span class={['tabular-nums shrink-0', childTextSize, childTextColor]}>{chosen.length}</span>
		{/if}
	</button>
	<span class="relative z-raised row ycenter gap-xs pr-sm pointer-none">
		{#if clearable && hasValue && !disabled}
			<button
				type="button"
				class={['pointer-auto btn-icon ghost', resolvedSize, resolvedShape, childTextColor]}
				aria-label="Clear selection"
				onclick={clear}
			>
				<Icon icon={luX} />
			</button>
		{/if}
		<Icon icon={luChevronDown} class={['caret', childTextColor, open && 'open']} />
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
		'floating at-bottom-start match-anchor pop enter-down spring-snappy scroll-y scroll-thin box gap-xs focus-none',
		surface,
		resolvedShape,
		'pad-xs',
		textSize
	]}
	onkeydown={onListKeydown}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, onPopoverChange)}
	{@attach roving({ selector: '[role="option"]', loop: false, typeahead: true, tabindex: true })}
>
	{#each groups as g, gi (g.group ?? `__${gi}`)}
		<div role="group" aria-labelledby={g.group ? `${uid}-g${gi}` : undefined} class="box">
			{#if g.group}
				<div id={`${uid}-g${gi}`} class={['weight-500 px-sm pt-sm pb-xs select-none', childTextSize, childTextColor]}>{g.group}</div>
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
						<Icon icon={option.icon} class={['shrink-0', childTextColor]} />
					{/if}
					<span class="box grow wmin0">
						<span class="truncate">{option.label}</span>
						{#if option.description}
							<span class={['truncate', childTextSize, childTextColor]}>{option.description}</span>
						{/if}
					</span>
					{#if on}
						<Icon icon={luCheck} class="text-theme shrink-0" />
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class={['px-sm py-sm', childTextSize, childTextColor]}>No options</div>
	{/each}
</div>

{#if name}
	{#each selected.length ? selected : [null] as v, i (i)}
		<input type="hidden" {name} value={valueKey(v)} disabled={disabled || undefined} />
	{/each}
{/if}
