<!-- @component The content surface: a padded container with five treatments and an optional spring lift. -->

<script lang="ts">
	import type { Surface } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAnchorAttributes, HTMLAttributes  } from 'svelte/elements';
	import { hover, tilt as tiltAttachment, vars } from '../../../motion/index.js';
	import { type Pad, type Shape, type Size } from '../../../internal/tokens.js';
	import { gapClass, padToken, setCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		interactive?: boolean;
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		tilt?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		surface = 'elevated',
		size = 'h-lg',
		shape = 'modern',
		interactive = false,
		href,
		target,
		tilt = false,
		onclick,
		class: className,
		children,
		...rest
	}: Props = $props();

	setCardContext({
		get size() {
			return size;
		}
	});


	const live = $derived(interactive || href !== undefined);
	const classes = $derived([
		'box radius-md overflow-hidden',
		surface,
		'pad-bs',
		gapClass[size],
		shape,
		live && 'interactive focus-ring',
		(live || tilt) && 'motion',
		tilt && 'tilt',
		className
	]);
	const motion = $derived(tilt ? tiltAttachment() : live ? hover({ scale: 1, y: -3 }) : undefined);

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
		{@attach vars({ pad: padToken[size] })}
		{@attach motion}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else if interactive}
	<article
		class={classes}
		role="button"
		tabindex="0"
		{onclick}
		{onkeydown}
		{@attach vars({ pad: padToken[size] })}
		{@attach motion}
		{...rest}
	>
		{@render children?.()}
	</article>
{:else}
	<div class={classes} {@attach vars({ pad: padToken[size] })} {@attach motion} {...rest}>
		{@render children?.()}
	</div>
{/if}
