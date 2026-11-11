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
	import Icon from './Icon.svelte';
	import { klChevronDown, klChevronUp } from '$lib/icons/keylinestroke.js';
	import type { Variant, Size, Surface, Border, Shape, Shadow, TextSize, ChildTextSize } from '$lib/types.js';

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
		textsize?: TextSize;
		childtextsize?: ChildTextSize;
		class?: string;
		contentClasses?: string;
		children?: Snippet;
		itemSnippet?: Snippet<[{ item: AccordionItemData; isOpen: boolean; toggle: () => void }]>;
	}

	let {
		items = [],
		multiple = false,
		value = $bindable(),
		variant = 'ghost',
		size = 'h-xl',
		surface = 'bg-main',
		border = 'border-none',
		shape = 'rect',
		shadow = 'shad-none',
		textsize = 'text-bs',
		childtextsize = 'text-md',
		class: className = '',
		contentClasses = 'px-md pb-bs pt-sm text-secondary',
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

<div class="box wfull {className}" {...restProps}>
	{#each items as item (item.id)}
		{@const open = openIds.includes(item.id)}
		<div class="box {surface} {border} {shape} {shadow}">
			{#if itemSnippet}
				{@render itemSnippet({ item, isOpen: open, toggle: () => !item.disabled && toggle(item.id) })}
			{:else}
					<button
						type="button"
						id="{uid}-{item.id}-trigger"
						class="no-scaling row xbetween ycenter wfull gap-sm px-sm weight-500 {textsize} {variant} {size} {shape} {item.disabled ? 'text-muted' : ''}"
						aria-expanded={open}
						aria-controls="{uid}-{item.id}"
						disabled={item.disabled}
						onclick={() => toggle(item.id)}
					>
						<span>{item.title}</span>
						<Icon icon={open ? klChevronUp : klChevronDown} class="text-muted shrink-0" />
					</button>
				<div
					id="{uid}-{item.id}"
					role="region"
					aria-labelledby="{uid}-{item.id}-trigger"
					class="collapse {open ? 'open' : ''}"
					inert={!open}
				>
					<div><p class="{contentClasses} {childtextsize}">{item.content ?? ''}</p></div>
				</div>
			{/if}
		</div>
	{/each}
	{@render children?.()}
</div>
