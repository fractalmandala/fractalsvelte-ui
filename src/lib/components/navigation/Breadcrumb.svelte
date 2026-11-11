<!-- @component A trail of links to the current page, collapsing the middle when long. -->

<script lang="ts" module>
	export interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}
</script>

<script lang="ts">
	import type { TextSize } from '$lib/types.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klChevronRight } from '$lib/icons/keylinestroke.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: BreadcrumbItem[];
		/** Collapse the middle once there are more items than this (0 = never) */
		maxItems?: number;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		separator?: Snippet;
		home?: Snippet;
	}

	let { items = [], maxItems = 0, textsize = 'text-md',
		class: className = '', children, separator, home, ...restProps }: Props = $props();

	let expanded = $state(false);
	const collapsed = $derived(!expanded && maxItems > 1 && items.length > maxItems);
	const visible = $derived<(BreadcrumbItem | 'more')[]>(
		collapsed ? [items[0], 'more', ...items.slice(-(maxItems - 1))] : items
	);
</script>

{#snippet sep()}
	<div role="listitem" class="row ycenter text-muted" aria-hidden="true">
		{#if separator}{@render separator()}{:else}<Icon icon={klChevronRight} />{/if}
	</div>
{/snippet}

<nav aria-label="Breadcrumb" class="{textsize} {className}" {...restProps}>
	<div role="list" class="row ycenter gap-xs wrap text-sm">
		{#if home}
			<div role="listitem" class="row ycenter link-plain">{@render home()}</div>
			{#if items.length > 0}{@render sep()}{/if}
		{/if}
		{#each visible as entry, idx (idx)}
			{#if idx > 0}{@render sep()}{/if}
			{#if entry === 'more'}
				<div role="listitem" class="row ycenter">
					<button
						type="button"
						class="ghost px-xs h-md mincurved text-muted"
						aria-label="Show all breadcrumb items"
						onclick={() => (expanded = true)}>…</button
					>
				</div>
			{:else}
				{@const current = entry.current ?? idx === visible.length - 1}
				<div role="listitem" class="row ycenter">
					{#if current}
						<span class="text-primary weight-600" aria-current="page">{entry.label}</span>
					{:else if entry.href}
						<a href={entry.href} class="link-plain text-secondary">{entry.label}</a>
					{:else}
						<span class="text-secondary">{entry.label}</span>
					{/if}
				</div>
			{/if}
		{/each}
		{@render children?.()}
	</div>
</nav>
