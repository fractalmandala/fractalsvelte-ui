<!-- @component A set of filter chips for a single choice or any number of them, with optional icons and counts. -->

<script lang="ts" generics="T">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { springFade, springScale } from '../../../motion/index.js';
	import { roving } from '../../../internal/helpers.js';
	import { type ChildTextSize, type Gap, type Shape, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';
	import { valueKey, type ChipOption } from './options.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		options: ChipOption<T>[];
		value?: T | T[] | null;
		onValueChange?: (value: T | T[] | null) => void;
		multiple?: boolean;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		shape?: Shape;
		gap?: Gap;
		label?: string;
		disabled?: boolean;
		name?: string;
	}

	let {
		options,
		value = $bindable(null),
		onValueChange,
		multiple = false,
		size = 'h-lg',
		textSize,
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		shape = 'round',
		gap = 'gap-sm',
		label,
		disabled = false,
		name,
		class: className,
		...rest
	}: Props = $props();

		const selected = $derived<T[]>(
		multiple ? (Array.isArray(value) ? value : []) : value === null || value === undefined || Array.isArray(value) ? [] : [value]
	);
	const isOn = (v: T) => selected.some((s) => Object.is(s, v));

	function commit(next: T | T[] | null) {
		value = next;
		onValueChange?.(next);
	}

	function toggle(option: ChipOption<T>) {
		if (option.disabled || disabled) return;
		if (multiple) {
			commit(isOn(option.value) ? selected.filter((s) => !Object.is(s, option.value)) : [...selected, option.value]);
		} else {
			commit(isOn(option.value) ? null : option.value);
		}
	}

	const role = $derived(multiple ? 'group' : 'radiogroup');
	const itemRole = $derived(multiple ? 'checkbox' : 'radio');
</script>

<div
	role={role}
	aria-label={label}
	aria-disabled={disabled || undefined}
	class={['row wrap ycenter', gap, disabled && 'disabled', className]}
	{@attach roving({
		selector: multiple ? '[role="checkbox"]' : '[role="radio"]',
		orientation: 'horizontal',
		loop: true,
		tabindex: true
	})}
	{...rest}
>
	{#each options as option (valueKey(option.value))}
		{@const on = isOn(option.value)}
		<button
			type="button"
			role={itemRole}
			tabindex={on || (selected.length === 0 && option === options[0]) ? 0 : -1}
			aria-checked={on}
			aria-disabled={option.disabled || undefined}
			disabled={disabled || option.disabled || undefined}
			class={[
				'button inline-flex gap-xs weight-500',
				size, textSize, shape,
				on ? 'state-selected' : 'outline'
			]}
			onclick={() => toggle(option)}
		>
			{#if on}
				<span class="inline-flex" in:springScale={{ spring: 'bouncy', start: 0.2 }} out:springFade={{ spring: 'stiff' }}>
					<Icon icon={luCheck} />
				</span>
			{:else if option.icon}
				<Icon icon={option.icon} class="shrink-0" />
			{/if}
			{option.label}
			{#if option.count !== undefined}
				<span class={['tabular-nums', childTextSize, childTextColor]}>{option.count}</span>
			{/if}
		</button>
	{/each}
	{#if name}
		{#each selected.length ? selected : [null] as v, i (i)}
			<input type="hidden" {name} value={valueKey(v)} disabled={disabled || undefined} />
		{/each}
	{/if}
</div>
