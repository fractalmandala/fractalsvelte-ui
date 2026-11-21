<!-- @component A list or row item with leading media, a title, a description and trailing actions. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAnchorAttributes, HTMLAttributes  } from 'svelte/elements';
	import type { Shape, Size, Surface } from '../../../internal/tokens.js';
	import { itemPadClass, setItemContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		interactive?: boolean;
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		surface = 'vacant',
		size = 'h-lg',
		shape = 'modern',
		interactive = false,
		href,
		target,
		onclick,
		class: className,
		children,
		...rest
	}: Props = $props();

	setItemContext({
		get size() {
			return size;
		}
	});


	const live = $derived(interactive || href !== undefined);
	const classes = $derived([
		'row ycenter gap-sm wfull',
		itemPadClass[size],
		shape,
		surface,
		live && 'interactive focus-ring',
		href !== undefined && 'link-plain',
		className
	]);

	function onkeydown(event: KeyboardEvent): void {
		if (event.target !== event.currentTarget) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			(event.currentTarget as HTMLElement).click();
		}
	}
</script>

{#if href !== undefined}
	<a
		class={classes}
		{href}
		{target}
		rel={target === '_blank' ? 'noopener noreferrer' : undefined}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else if interactive}
	<div class={classes} role="button" tabindex="0" {onclick} {onkeydown} {...rest}>
		{@render children?.()}
	</div>
{:else}
	<div class={classes} {...rest}>
		{@render children?.()}
	</div>
{/if}
