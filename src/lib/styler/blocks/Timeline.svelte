<!-- @component A vertical list of dated events. -->

<script lang="ts" module>
	import type { Intent } from '../types';

	export interface TimelineItem {
		id?: string;
		title: string;
		time?: string;
		description?: string;
		intent?: Intent;
		active?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: TimelineItem[];
		/** alternate puts entries on both sides of a centred rail */
		align?: 'left' | 'alternate';
		class?: string;
		children?: Snippet;
	}

	let { items = [], align = 'left', class: className = '', children, ...restProps }: Props = $props();
</script>

{#snippet entry(item: TimelineItem)}
	<div class="card box gap-xs" data-variant="primary" data-shape="curved" data-pad="md">
		<header class="row ycenter xbetween gap-sm wrap">
			<h4 class="text-sm weight-600">{item.title}</h4>
			{#if item.time}<time class="text-sm mono text-muted">{item.time}</time>{/if}
		</header>
		{#if item.description}<p class="text-body-sm text-secondary">{item.description}</p>{/if}
	</div>
{/snippet}

{#snippet marker(item: TimelineItem, last: boolean)}
	<!-- The rail is an empty .grow span with a left border; the dot is SVG, with
	     a SMIL ping for the active entry. -->
	<div class="box xcenter shrink-0">
		<svg viewBox="0 0 20 20" width="1.25em" height="1.25em" class={item.intent ? `text-${item.intent}` : 'text-theme'} aria-hidden="true">
			{#if item.active}
				<circle cx="10" cy="10" r="5" fill="currentColor" opacity="0.4">
					<animate attributeName="r" values="5;10" dur="1.6s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.4;0" dur="1.6s" repeatCount="indefinite" />
				</circle>
			{/if}
			<circle cx="10" cy="10" r="5" fill="currentColor" />
		</svg>
		{#if !last}<span class="grow bl-str py-sm"></span>{/if}
	</div>
{/snippet}

<div role="list" class="box {className}" {...restProps}>
	{#each items as item, i (item.id ?? i)}
		{@const last = i === items.length - 1}
		{#if align === 'alternate'}
			<div role="listitem" class="row gap-md">
				<div class="box grow min0 pb-md">{#if i % 2 === 0}{@render entry(item)}{/if}</div>
				{@render marker(item, last)}
				<div class="box grow min0 pb-md">{#if i % 2 === 1}{@render entry(item)}{/if}</div>
			</div>
		{:else}
			<div role="listitem" class="row gap-md">
				{@render marker(item, last)}
				<div class="box grow min0 pb-md">{@render entry(item)}</div>
			</div>
		{/if}
	{/each}
	{@render children?.()}
</div>
