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
	import { Icon } from 'fractalicons';
	import { luChevronDown, luChevronUp } from 'fractalicons/lucide';
	import type { FsVariant } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: AccordionItemData[];
		/** Allow several items open at once */
		multiple?: boolean;
		/** Open item id, or ids when multiple */
		value?: string | string[];
		variant?: FsVariant;
		shape?: 'modern' | 'curved';
		class?: string;
		children?: Snippet;
		itemSnippet?: Snippet<[{ item: AccordionItemData; isOpen: boolean; toggle: () => void }]>;
	}

	let {
		items = [],
		multiple = false,
		value = $bindable(),
		variant = 'primary',
		shape = 'curved',
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

<!-- fractalstyler's .fsx-accordion group: items collapse on a 0fr → 1fr grid row. -->
<div class="fsx-accordion {className}" {...restProps}>
	{#each items as item (item.id)}
		{@const open = openIds.includes(item.id)}
		<div class="fsx-accordion-item {open ? 'open' : ''}" data-variant={variant} data-shape={shape}>
			{#if itemSnippet}
				{@render itemSnippet({ item, isOpen: open, toggle: () => !item.disabled && toggle(item.id) })}
			{:else}
				<h3 class="box">
					<button
						type="button"
						id="{uid}-{item.id}-trigger"
						class="fsx-accordion-trigger gap-sm text-sm weight-500 {item.disabled ? 'text-muted' : ''}"
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
					class="fsx-accordion-content"
					inert={!open}
				>
					<div class="fsx-accordion-panel text-body-sm text-secondary">{item.content ?? ''}</div>
				</div>
			{/if}
		</div>
	{/each}
	{@render children?.()}
</div>
