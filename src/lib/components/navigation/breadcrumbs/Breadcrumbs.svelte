<!-- @component A trail of links from the site root to the current page, with an optional collapsing ellipsis. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luChevronRight, luEllipsis } from '@fractaldesign/icons/lucide';
	import type { BreadcrumbItem } from './items.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The trail, in order from the root to the current page. */
		items: BreadcrumbItem[];
		/** The icon drawn between crumbs. */
		separator?: IconData;
		/** When the trail is longer than this, collapse the middle behind an ellipsis. */
		maxItems?: number;
		/** Accessible name of the navigation. */
		label?: string;
	}

	let {
		items,
		separator = luChevronRight,
		maxItems,
		label = 'Breadcrumb',
		class: klass,
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

<nav aria-label={label} class={klass} {...rest}>
	<ol class="row ycenter wrap gap-xs">
		{#each slots as slot, i (slot.kind === 'ellipsis' ? 'ellipsis' : `${slot.item.label}-${i}`)}
			{#if i > 0}
				<li class="row ycenter text-muted shrink-0" aria-hidden="true">
					<Icon icon={separator} />
				</li>
			{/if}
			{#if slot.kind === 'ellipsis'}
				<li>
					<button
						type="button"
						class="bare button btn-icon ghost modern h-md text-sm inline-flex"
						aria-label="Show all breadcrumbs"
						onclick={() => (expanded = true)}
					>
						<Icon icon={luEllipsis} />
					</button>
				</li>
			{:else if slot.item.href && !slot.current}
				<li>
					<a href={slot.item.href} class="link-subtle focus-ring row ycenter gap-xs text-sm">
						{#if slot.item.icon}
							<Icon icon={slot.item.icon} />
						{/if}
						{slot.item.label}
					</a>
				</li>
			{:else}
				<li class="row ycenter gap-xs text-sm text-primary weight-500" aria-current="page">
					{#if slot.item.icon}
						<Icon icon={slot.item.icon} />
					{/if}
					{slot.item.label}
				</li>
			{/if}
		{/each}
	</ol>
</nav>
