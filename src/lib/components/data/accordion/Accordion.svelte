<!-- @component A group of disclosures that open with a spring height, one or many at a time. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/roving.js';
	import {
		setAccordion,
		variantClass,
		type AccordionType,
		type AccordionVariant
	} from './accordion.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** `single` keeps one item open; `multiple` allows several. */
		type?: AccordionType;
		/** The open item value (`single`) or values (`multiple`). */
		value?: string | string[] | null;
		/** Called when the open item or items change. */
		onValueChange?: (value: string | string[] | null) => void;
		/** When `type` is `single`, allow the open item to be closed. */
		collapsible?: boolean;
		/** How items are grouped: separate cards, one contained panel, or a flush stack. */
		variant?: AccordionVariant;
		/** The heading level wrapping each item's trigger button. */
		headingLevel?: 2 | 3 | 4 | 5 | 6;
		/** The `AccordionItem`s. */
		children?: Snippet;
	}

	let {
		type = 'single',
		value = $bindable(null),
		onValueChange,
		collapsible = true,
		variant = 'contained',
		headingLevel = 3,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();

	function isOpen(itemValue: string): boolean {
		if (type === 'multiple') return Array.isArray(value) && value.includes(itemValue);
		return value === itemValue;
	}

	function toggle(itemValue: string) {
		if (type === 'multiple') {
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
		get type() { return type; },
		get variant() { return variant; },
		get headingLevel() { return headingLevel; },
		get collapsible() { return collapsible; },
		value: () => value,
		toggle,
		isOpen
	});
</script>

<div
	class={[variantClass[variant], klass]}
	{@attach roving({ selector: '[data-accordion-trigger]', orientation: 'vertical', loop: false })}
	{...rest}
>
	{@render children?.()}
</div>
