<!-- @component Inline keyboard-navigable option list supporting single or multiple selection and groups. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { roving, maxHeightStyle } from '../../../internal/helpers.js';
	import { type ChildTextSize, type Gap, type Pad, type Shape, type Size, type Surface, type TextColor } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { groupOptions, type ListboxOption } from './listbox.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		options: ListboxOption[];
		value?: string | string[];
		onValueChange?: (value: string | string[]) => void;
		multiple?: boolean;
		size?: Size;
		shape?: Shape;
		surface?: Surface;
		pad?: Pad;
		gap?: Gap;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		maxHeight?: Size | string | number;
		disabled?: boolean;
		emptyText?: string;
		label?: string;
	}

	let {
		options,
		value = $bindable(),
		onValueChange,
		multiple = false,
		size = 'h-lg',
		shape = 'modern',
		surface = 'elevated',
		pad = 'pad-xs',
		gap = 'gap-xs',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
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

	const capCls = $derived(maxHeight ? `max-h-${String(maxHeight).replace(/^h-/, '')}` : '');
	const capVar = $derived(maxHeightStyle(maxHeight));
</script>

<div
	role="listbox"
	aria-label={label}
	aria-multiselectable={multiple || undefined}
	aria-disabled={disabled || undefined}
	class={[
		'box scroll-y',
		surface,
		pad,
		gap,
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
		<div class={['ta-c', 'pad-xs', childTextSize, childTextColor]}>{emptyText}</div>
	{:else}
		{#each sections as section (section.group ?? '__default')}
			{#if section.group}
				<div class={['px-sm pt-xs weight-600', childTextSize, childTextColor]}>{section.group}</div>
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
							<Icon icon={option.icon} class={['shrink-0', childTextColor]} />
						{/if}
						<span class="column xleft min0">
							<span class="truncate weight-500">{option.label}</span>
							{#if option.description}
								<span class={['truncate', childTextSize, childTextColor]}>{option.description}</span>
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
