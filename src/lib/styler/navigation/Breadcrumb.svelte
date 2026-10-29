<!-- @component A trail of links to the current page, collapsing the middle when long. -->

<script lang="ts" module>
	export interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronRight } from '@fractaldesign/icons/lucide';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: BreadcrumbItem[];
		/** Collapse the middle once there are more items than this (0 = never) */
		maxItems?: number;
		class?: string;
		children?: Snippet;
		separator?: Snippet;
		home?: Snippet;
	}

	let { items = [], maxItems = 0, class: className = '', children, separator, home, ...restProps }: Props = $props();

	let expanded = $state(false);
	const collapsed = $derived(!expanded && maxItems > 1 && items.length > maxItems);
	const visible = $derived<(BreadcrumbItem | 'more')[]>(
		collapsed ? [items[0], 'more', ...items.slice(-(maxItems - 1))] : items
	);
</script>

{#snippet sep()}
	<div role="listitem" class="row ycenter breadcrumb-spacer" aria-hidden="true">
		{#if separator}{@render separator()}{:else}<Icon icon={luChevronRight} />{/if}
	</div>
{/snippet}

<!-- fractalstyler's breadcrumb set: .breadcrumb rail, .breadcrumb-link, .breadcrumb-spacer. -->
<nav aria-label="Breadcrumb" class={className} {...restProps}>
	<div role="list" class="breadcrumb row ycenter gap-xs wrap">
		{#if home}
			<div role="listitem" class="row ycenter breadcrumb-link">{@render home()}</div>
			{#if items.length > 0}{@render sep()}{/if}
		{/if}
		{#each visible as entry, idx (idx)}
			{#if idx > 0}{@render sep()}{/if}
			{#if entry === 'more'}
				<div role="listitem" class="row ycenter">
					<button
						type="button"
						data-variant="iconbox"
						class="px-xs breadcrumb-spacer"
						aria-label="Show all breadcrumb items"
						onclick={() => (expanded = true)}>…</button
					>
				</div>
			{:else}
				{@const current = entry.current ?? idx === visible.length - 1}
				<div role="listitem" class="row ycenter">
					{#if current}
						<span class="breadcrumb-spacer text-primary weight-600" aria-current="page">{entry.label}</span>
					{:else if entry.href}
						<a href={entry.href} class="breadcrumb-link">{entry.label}</a>
					{:else}
						<span class="breadcrumb-spacer">{entry.label}</span>
					{/if}
				</div>
			{/if}
		{/each}
		{@render children?.()}
	</div>
</nav>
