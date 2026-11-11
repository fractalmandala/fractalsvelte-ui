<!-- @component Zero-state placeholder illustration with title, description, and action button slot. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klInbox } from '$lib/icons/keylinestroke.js';
	import type { Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string;
		description?: string;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
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
		border = 'border-dashed',
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
	class="box xcenter ycenter gap-md wfull {surface} {border} {shape} {shadow} {padding} {textsize} {className}"
	{...restProps}
>
	<div class="btn-icon inline-flex row xcenter ycenter h-xl round state-hover text-theme" aria-hidden="true">
		{#if icon}
			{@render icon()}
		{:else}
			<Icon icon={klInbox} size={22} />
		{/if}
	</div>
	<div class="box xcenter gap-xs">
		<h4 class="text-lg weight-500 lh13 text-primary">{title}</h4>
		{#if description}
			<p class="text-sm lh15 text-secondary">{description}</p>
		{/if}
	</div>
	{#if children}
		<div class="text-sm text-secondary">
			{@render children()}
		</div>
	{/if}
	{#if actions}
		<div class="row ycenter gap-sm pt-xs">
			{@render actions()}
		</div>
	{/if}
</div>
