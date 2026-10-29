<!-- @component A list of collapsible sections, one or several open at once. -->

<script lang="ts" module>
	export interface AccordionItemData {
		id: string;
		title: string;
		content?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown, luChevronUp } from '@fractaldesign/icons/lucide';
	import type { Variant, Size, Surface, Border, Shape, Shadow } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: AccordionItemData[];
		/** Allow several items open at once */
		multiple?: boolean;
		/** Open item id, or ids when multiple */
		value?: string | string[];
		/** Trigger paint */
		variant?: Variant;
		/** Trigger height */
		size?: Size;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
		children?: Snippet;
		itemSnippet?: Snippet<[{ item: AccordionItemData; isOpen: boolean; toggle: () => void }]>;
	}

	let {
		items = [],
		multiple = false,
		value = $bindable(),
		variant = 'ghost',
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-none',
		class: className = '',
		children,
		itemSnippet,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const openIds = $derived(value === undefined || value === '' ? [] : Array.isArray(value) ? value : [value]);

	function toggle(id: string) {
		const isOpen = openIds.includes(id);
		if (multiple) value = isOpen ? openIds.filter((x) => x !== id) : [...openIds, id];
		else value = isOpen ? '' : id;
	}
</script>

<div class="accordion wfull {className}" {...restProps}>
	{#each items as item (item.id)}
		{@const open = openIds.includes(item.id)}
		<div class="accordion-item el-shape {surface} {border} {shape} {shadow} {open ? 'open' : ''}">
			{#if itemSnippet}
				{@render itemSnippet({ item, isOpen: open, toggle: () => !item.disabled && toggle(item.id) })}
			{:else}
				<h3 class="box">
					<button
						type="button"
						id="{uid}-{item.id}-trigger"
						class="accordion-trigger wfull gap-sm px-sm weight-500 el-variant el-size el-shape {variant} {size} {shape} {item.disabled ? 'text-muted' : ''}"
						aria-expanded={open}
						aria-controls="{uid}-{item.id}"
						disabled={item.disabled}
						onclick={() => toggle(item.id)}
					>
						<span>{item.title}</span>
						<Icon icon={open ? luChevronUp : luChevronDown} class="text-muted shrink-0" />
					</button>
				</h3>
				<div
					id="{uid}-{item.id}"
					role="region"
					aria-labelledby="{uid}-{item.id}-trigger"
					class="accordion-content"
					inert={!open}
				>
					<div class="accordion-panel text-body-sm text-secondary">{item.content ?? ''}</div>
				</div>
			{/if}
		</div>
	{/each}
	{@render children?.()}
</div>
