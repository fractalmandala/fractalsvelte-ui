<!-- @component A trail of links from the site root to the current page, with an optional collapsing ellipsis. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luChevronRight, luEllipsis } from '@fractaldesign/icons/lucide';
	import { type Shape, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';
	import type {  BreadcrumbItem  } from './items.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		items: BreadcrumbItem[];
		separator?: IconData;
		maxItems?: number;
		label?: string;
		size?: Size;
		shape?: Shape;
		textSize?: TextSize;
		textColor?: TextColor;
	}

	let {
		items,
		separator = luChevronRight,
		maxItems,
		label = 'Breadcrumb',
		size = 'h-md',
		shape = 'modern',
		textSize = 'text-sm',
		textColor = 'text-muted',
		class: className,
		...rest
	}: Props = $props();

	let expanded = $state(false);

	type Slot =
		| { kind: 'item'; item: BreadcrumbItem; current: boolean }
		| { kind: 'ellipsis' };

	const slots = $derived.by((): Slot[] => {
		const trail = items;
		const last = trail.length - 1;
		const limit = maxItems;
		const collapse = !expanded && limit !== undefined && trail.length > limit && limit >= 2;
		const out: Slot[] = [];
		if (!collapse) {
			for (let i = 0; i < trail.length; i++) {
				const item = trail[i];
				if (item) out.push({ kind: 'item', item, current: i === last });
			}
			return out;
		}
		const tail = Math.max(1, limit - 2);
		const startTail = trail.length - tail;
		const first = trail[0];
		if (first) out.push({ kind: 'item', item: first, current: last === 0 });
		out.push({ kind: 'ellipsis' });
		for (let i = startTail; i < trail.length; i++) {
			if (i === 0) continue;
			const item = trail[i];
			if (item) out.push({ kind: 'item', item, current: i === last });
		}
		return out;
	});
</script>

<nav aria-label={label} class={className} {...rest}>
	<ol class="row ycenter wrap gap-xs">
		{#each slots as slot, i (slot.kind === 'ellipsis' ? 'ellipsis' : `${slot.item.label}-${i}`)}
			{#if i > 0}
				<li class={['row ycenter shrink-0', textColor]} aria-hidden="true">
					<Icon icon={separator} />
				</li>
			{/if}
			{#if slot.kind === 'ellipsis'}
				<li>
					<button
						type="button"
						class={['bare button btn-icon ghost inline-flex', size, shape, textSize]}
						aria-label="Show all breadcrumbs"
						onclick={() => (expanded = true)}
					>
						<Icon icon={luEllipsis} />
					</button>
				</li>
			{:else if slot.item.href && !slot.current}
				<li>
					<a href={slot.item.href} class={['link-subtle focus-ring row ycenter gap-xs', textSize]}>
						{#if slot.item.icon}
							<Icon icon={slot.item.icon} />
						{/if}
						{slot.item.label}
					</a>
				</li>
			{:else}
				<li class={['row ycenter gap-xs weight-500', textSize]} aria-current="page">
					{#if slot.item.icon}
						<Icon icon={slot.item.icon} />
					{/if}
					{slot.item.label}
				</li>
			{/if}
		{/each}
	</ol>
</nav>
