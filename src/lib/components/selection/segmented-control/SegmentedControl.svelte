<!-- @component A compact single choice among a short list of segments, with a spring-driven sliding indicator. -->

<script lang="ts" generics="T">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { animate } from '../../../motion/index.js';
	import { roving } from '../../../internal/roving.js';
	import { controlSize, type Size } from '../../../internal/tokens.js';
	import { valueKey, type SegmentOption } from './options.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The segments to choose from. */
		options: SegmentOption<T>[];
		/** The chosen value. Two-way bindable. */
		value?: T | null;
		/** Called whenever the person chooses a segment. */
		onValueChange?: (value: T | null) => void;
		/** The segment height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the segment height. Follows `size` when omitted. */
		textSize?: Size;
		/** Stretches the control to the full width of its container, with equal segments. */
		block?: boolean;
		/** Accessible name of the group. */
		label?: string;
		/** Blocks pointer and keyboard input. */
		disabled?: boolean;
		/** The field name; a hidden input submits the value with a form. */
		name?: string;
	}

	let {
		options,
		value = $bindable(null),
		onValueChange,
		size = 'md',
		textSize,
		block = false,
		label,
		disabled = false,
		name,
		class: klass,
		...rest
	}: Props = $props();

	let root = $state<HTMLElement>();
	let indicator = $state<HTMLElement>();
	let placed = false;

	function commit(next: T) {
		if (Object.is(value, next)) return;
		value = next;
		onValueChange?.(next);
	}

	function place(instant = false) {
		const group = root;
		const mark = indicator;
		if (!group || !mark) return;
		const active = group.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]');
		if (!active) {
			animate(mark, { '--ix': 0, '--iy': 0, '--iw': 0, '--ih': 0 }, { instant: true });
			return;
		}
		const g = group.getBoundingClientRect();
		const b = active.getBoundingClientRect();
		animate(
			mark,
			{ '--ix': b.left - g.left, '--iy': b.top - g.top, '--iw': b.width, '--ih': b.height },
			{ instant: instant || !placed, spring: 'snappy' }
		);
		placed = true;
	}

	$effect(() => {
		value;
		size;
		textSize;
		block;
		options;
		disabled;
		const frame = requestAnimationFrame(() => place());
		const group = root;
		if (!group || typeof ResizeObserver === 'undefined') {
			return () => cancelAnimationFrame(frame);
		}
		const ro = new ResizeObserver(() => place(true));
		ro.observe(group);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});

	function onNavigate(item: HTMLElement) {
		const key = item.dataset.value;
		const option = options.find((o) => valueKey(o.value) === key);
		if (option && !option.disabled && !disabled) commit(option.value);
	}
</script>

<div
	bind:this={root}
	role="radiogroup"
	aria-label={label}
	aria-disabled={disabled || undefined}
	class={[
		'relative inline-flex row ycenter pad-xs bg-input border modern',
		block && 'wfull',
		disabled && 'disabled',
		klass
	]}
	{@attach roving({
		selector: '[role="radio"]',
		orientation: 'horizontal',
		loop: true,
		tabindex: true,
		onNavigate
	})}
	{...rest}
>
	<div bind:this={indicator} class="indicator modern bg-overlay rim shad-xs" aria-hidden="true"></div>
	{#each options as option (valueKey(option.value))}
		{@const on = Object.is(value, option.value)}
		<button
			type="button"
			role="radio"
			data-value={valueKey(option.value)}
			tabindex={on ? 0 : -1}
			aria-checked={on}
			aria-disabled={option.disabled || undefined}
			disabled={disabled || option.disabled || undefined}
			class={[
				'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',
				controlSize(size, textSize),
				block && 'grow',
				on ? 'text-primary' : 'text-secondary'
			]}
			onclick={() => !option.disabled && commit(option.value)}
		>
			{#if option.icon}
				<Icon icon={option.icon} class="shrink-0" />
			{/if}
			{option.label}
		</button>
	{/each}
	{#if name}
		<input type="hidden" {name} value={valueKey(value)} {disabled} />
	{/if}
</div>
