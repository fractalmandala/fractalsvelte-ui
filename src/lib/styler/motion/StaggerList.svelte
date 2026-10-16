<script lang="ts" module>
	export interface StaggerListItem {
		id: string;
		[key: string]: any;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSpace } from '../types';
	import { GAP } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: StaggerListItem[];
		/** ms between items */
		stagger?: number;
		gap?: FsSpace;
		class?: string;
		itemSnippet?: Snippet<[{ item: StaggerListItem; index: number }]>;
	}

	let { items = [], stagger = 60, gap = 'sm', class: className = '', itemSnippet, ...restProps }: Props = $props();

	// The stagger is timing, not styling: items are added to the list one at a
	// time. Reduced-motion users get the whole list at once.
	let shown = $state(0);

	$effect(() => {
		const total = items.length;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || stagger <= 0) {
			shown = total;
			return;
		}
		shown = 0;
		const timer = setInterval(() => {
			shown += 1;
			if (shown >= total) clearInterval(timer);
		}, stagger);
		return () => clearInterval(timer);
	});
</script>

<div role="list" class="box {GAP[gap]} {className}" aria-busy={shown < items.length} {...restProps}>
	{#each items.slice(0, shown) as item, index (item.id)}
		<div role="listitem" class="box">{@render itemSnippet?.({ item, index })}</div>
	{/each}
</div>
