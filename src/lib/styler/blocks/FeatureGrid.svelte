<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface FeatureItem {
		title: string;
		description: string;
		badge?: string;
		icon?: Snippet;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { GRID_COLS } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Responsive grid steps: 2 is 1 → 2, 3 is 1 → 3, 4 is 1 → 2 → 4 */
		columns?: 2 | 3 | 4;
		items?: FeatureItem[];
		bordered?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { columns = 3, items = [], bordered = true, class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="{GRID_COLS[columns]} gap-md {className}" {...restProps}>
	{#each items as item (item.title)}
		<div class="card box gap-sm" data-variant={bordered ? 'primary' : 'ghost'} data-shape="curved" data-pad="lg">
			<div class="row ycenter xbetween gap-sm">
				{#if item.icon}
					<span class="row ycenter xcenter pad-sm bg-sunken radius-md text-theme text-lg">{@render item.icon()}</span>
				{/if}
				{#if item.badge}<span class="chip bg-sunken text-secondary">{item.badge}</span>{/if}
			</div>
			<h3 class="card-title">{item.title}</h3>
			<p class="text-body-sm text-secondary">{item.description}</p>
		</div>
	{/each}
	{@render children?.()}
</div>
