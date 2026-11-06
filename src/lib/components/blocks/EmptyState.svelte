<!-- @component Zero-state placeholder illustration with title, description, and action button slot. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { Icon } from '@fractaldesign/icons';
	import { luInbox } from '@fractaldesign/icons/lucide';
	import type { Surface, Border, Shape, Shadow, Pad, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string;
		description?: string;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		padding?: Pad;
		textsize?: TextSize;
		icon?: Snippet;
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		title = 'No items',
		description,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow = 'shad-none',
		padding = 'pad-xl',
		textsize = 'text-md',
		icon,
		actions,
		children,
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div
	class="empty-state box xcenter ycenter text-center {surface} {border} {shape} {shadow} {padding} {textsize} {className}"
	{...restProps}
>
	<div class="icon-circle row xcenter ycenter" aria-hidden="true">
		{#if icon}
			{@render icon()}
		{:else}
			<Icon icon={luInbox} />
		{/if}
	</div>

	<h4 class="empty-title font-medium text-primary m0">{title}</h4>

	{#if description}
		<p class="empty-desc text-secondary text-sm m0">{description}</p>
	{/if}

	{#if children}
		<div class="empty-content text-secondary text-sm">
			{@render children()}
		</div>
	{/if}

	{#if actions}
		<div class="empty-actions row ycenter gap-sm pt-xs">
			{@render actions()}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		width: 100%;
		border-style: dashed;
		gap: 0.75rem;
	}

	.icon-circle {
		width: 3.25rem;
		height: 3.25rem;
		border-radius: var(--radius-full, 9999px);
		background: var(--bg-sunken, #f4f4f4);
		color: var(--theme-color, #22c55e);
		font-size: 1.5rem;
	}

	.empty-title {
		font-size: 1.0625rem;
		line-height: 1.3;
	}

	.empty-desc {
		max-width: 24rem;
		line-height: 1.5;
	}
</style>
