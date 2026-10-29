<!-- @component A grid of features, each with icon, title and description. -->

<script lang="ts" module>
	import type { IconData } from '@fractaldesign/icons';

	export interface FeatureItem {
		title: string;
		description: string;
		badge?: string;
		/** An icon from @fractaldesign/icons */
		icon?: IconData;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon as Iconbox } from '@fractaldesign/icons';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Responsive grid steps: 2 is 1 → 2, 3 is 1 → 3, 4 is 1 → 2 → 4 */
		columns?: 2 | 3 | 4;
		/** Each item: { title, description, badge?, icon? } */
		items?: FeatureItem[];
		bordered?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { columns = 3, items = [], bordered = true, class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="grid-{columns} ystretch gap-md {className}" {...restProps}>
	{#each items as item (item.title)}
		<!-- One left edge: icon, title and description stack from the same x. -->
		<div class="card box xleft ytop gap-sm ta-l el-shape curved pad-lg bg-panel {bordered ? 'border' : 'border-none'}">
			{#if item.icon || item.badge}
				<div class="row ycenter xbetween gap-sm wfull">
					{#if item.icon}
						<span class="row ycenter xcenter shrink-0 pad-sm bg-sunken radius-md text-theme text-lg" aria-hidden="true">
							<Iconbox icon={item.icon} />
						</span>
					{/if}
					{#if item.badge}<span class="chip bg-sunken text-secondary">{item.badge}</span>{/if}
				</div>
			{/if}
			<h3 class="card-title">{item.title}</h3>
			<p class="text-body-sm text-secondary">{item.description}</p>
		</div>
	{/each}
	{@render children?.()}
</div>
