<!-- @component Inline keyboard-navigable option list supporting single or multiple selection and groups. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { roving } from '../../../internal/roving.js';
	import { type Shape, type Size } from '../../../internal/tokens.js';
import { maxHeightClass, maxHeightStyle } from '../../../internal/helpers.js';
	import { vars } from '../../../motion/index.js';
	import { groupOptions, type ListboxOption } from './listbox.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Listbox choices, optionally grouped by `group`. */
		options: ListboxOption[];
		/** Selected value (single) or values (`multiple`); bindable. */
		value?: string | string[];
		/** Called when selection changes. */
		onValueChange?: (value: string | string[]) => void;
		/** Allow selecting multiple options. */
		multiple?: boolean;
		/** Option row height and text scale on the shared size ladder. */
		size?: Size;
		/** Outer container corner shape. */
		shape?: Shape;
		/** Vertical scroll cap using a `Size` step (`h-xl`) or CSS length. */
		maxHeight?: Size | string | number;
		/** Disables all interaction. */
		disabled?: boolean;
		/** Message shown when `options` is empty. */
		emptyText?: string;
		/** Accessible label naming the list. */
		label?: string;
	}

	let {
		options,
		value = $bindable(),
		onValueChange,
		multiple = false,
		size = 'h-lg',
		shape = 'modern',
		maxHeight,
		disabled = false,
		emptyText = 'No options available',
		label = 'Options',
		class: className,
		...rest
	}: Props = $props();

	const sections = $derived(groupOptions(options));
	const selectedSet = $derived(
		Array.isArray(value)
			? new Set(value)
			: typeof value === 'string' && value !== ''
				? new Set([value])
				: new Set<string>()
	);

	function choose(option: ListboxOption) {
		if (disabled || option.disabled) return;
		if (multiple) {
			const next = new Set(selectedSet);
			if (next.has(option.value)) next.delete(option.value);
			else next.add(option.value);
			const arr = [...next];
			value = arr;
			onValueChange?.(arr);
		} else {
			value = option.value;
			onValueChange?.(option.value);
		}
	}

	const capCls = $derived(maxHeightClass(maxHeight));
	const capVar = $derived(maxHeightStyle(maxHeight));
</script>

<div
	role="listbox"
	aria-label={label}
	aria-multiselectable={multiple || undefined}
	aria-disabled={disabled || undefined}
	class={[
		'box gap-xs outlined bg-surface pad-xs overflow-auto',
		shape,
		capCls,
		capVar && 'capped',
		disabled && 'disabled',
		className
	]}
	{@attach vars({ 'max-height': capVar })}
	{@attach roving({ orientation: 'vertical', typeahead: true })}
	{...rest}
>
	{#if options.length === 0}
		<div class="pad-md ta-c text-sm text-muted">{emptyText}</div>
	{:else}
		{#each sections as section (section.group ?? '__default')}
			{#if section.group}
				<div class="px-sm pt-xs text-xs weight-600 text-muted">{section.group}</div>
			{/if}
			{#each section.items as option (option.value)}
				{@const selected = selectedSet.has(option.value)}
				{@const itemDisabled = disabled || Boolean(option.disabled)}
				<button
					type="button"
					role="option"
					aria-selected={selected}
					aria-disabled={itemDisabled || undefined}
					disabled={itemDisabled}
					class={[
						'item row ycenter xbetween focus-ring',
						size,
						selected && 'selected',
						itemDisabled && 'disabled'
					]}
					onclick={() => choose(option)}
				>
					<span class="row ycenter gap-sm min0">
						{#if option.icon}
							<Icon icon={option.icon} class="text-muted shrink-0" />
						{/if}
						<span class="column xleft min0">
							<span class="truncate weight-500">{option.label}</span>
							{#if option.description}
								<span class="text-xs text-muted truncate">{option.description}</span>
							{/if}
						</span>
					</span>
					{#if selected}
						<Icon icon={luCheck} class="text-theme shrink-0" />
					{/if}
				</button>
			{/each}
		{/each}
	{/if}
</div>
