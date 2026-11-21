<!-- @component A group of disclosures that open with a spring height, one or many at a time. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { roving } from '../../../internal/helpers.js';
	import { setAccordion, rootClass } from './accordion.svelte.js';
	import type { Grouping, Pad, Surface } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		multiple?: boolean;
		value?: string | string[] | null;
		onValueChange?: (value: string | string[] | null) => void;
		collapsible?: boolean;
		grouping?: Grouping;
		surface?: Surface;
		headingLevel?: 2 | 3 | 4 | 5 | 6;
		children?: Snippet;
	}

	let {
		multiple = false,
		value = $bindable(null),
		onValueChange,
		collapsible = true,
		grouping = 'contained',
		surface = 'outlined',
		headingLevel = 3,
		class: className,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();

	function isOpen(itemValue: string): boolean {
		if (multiple) return Array.isArray(value) && value.includes(itemValue);
		return value === itemValue;
	}

	function toggle(itemValue: string) {
		if (multiple) {
			const current = Array.isArray(value) ? value : [];
			const next = current.includes(itemValue)
				? current.filter((item) => item !== itemValue)
				: [...current, itemValue];
			value = next;
			onValueChange?.(next);
			return;
		}
		const open = value === itemValue;
		if (open && !collapsible) return;
		const next = open ? null : itemValue;
		value = next;
		onValueChange?.(next);
	}

	setAccordion({
		uid,
		get multiple() { return multiple; },
		get grouping() { return grouping; },
		get surface() { return surface; },
		get headingLevel() { return headingLevel; },
		get collapsible() { return collapsible; },
		value: () => value,
		toggle,
		isOpen
	});
</script>

<div
	class={[rootClass[grouping], className]}
	{@attach roving({ selector: '[data-accordion-trigger]', orientation: 'vertical', loop: false })}
	{...rest}
>
	{@render children?.()}
</div>
