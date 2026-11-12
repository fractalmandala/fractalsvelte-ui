<!-- @component The content surface: a padded container with five treatments and an optional spring lift. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import { hover, tilt as tiltAttachment, vars } from '../../../motion/index.js';
	import { padClass, type Shape, type Size } from '../../../internal/tokens.js';
	import { gapClass, padToken, setCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The surface treatment: `elevated` is raised with a lit edge, `outline` is a hairline, `filled` is a quiet panel, `ghost` has no surface until hovered, `glass` blurs what is behind it. */
		variant?: 'elevated' | 'outline' | 'filled' | 'ghost' | 'glass';
		/** The padding and the gap between parts, and the type scale of the parts. */
		size?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** Makes the whole card a target: it lifts on hover, shows a focus ring and, without `href`, becomes a focusable article that activates on Enter and Space. */
		interactive?: boolean;
		/** Renders the card as an `<a>` that navigates. Implies `interactive`. */
		href?: string;
		/** Where to open the link, when `href` is set. */
		target?: HTMLAnchorAttributes['target'];
		/** Tilts the card in 3D toward the pointer. Replaces the hover lift. */
		tilt?: boolean;
		/** Called when an interactive card without `href` is activated by click, Enter or Space. */
		onclick?: (event: MouseEvent) => void;
		/** The card's parts and content. */
		children?: Snippet;
	}

	let {
		variant = 'elevated',
		size = 'md',
		shape = 'curved',
		interactive = false,
		href,
		target,
		tilt = false,
		onclick,
		class: klass,
		children,
		...rest
	}: Props = $props();

	setCardContext({
		get size() {
			return size;
		}
	});

	const surface = {
		elevated: 'bg-surface border-subtle rim shad-md',
		outline: 'bg-none border',
		filled: 'bg-panel border-none',
		ghost: 'bg-none border-none',
		glass: 'glass border rim shad-lg'
	};

	const live = $derived(interactive || href !== undefined);
	const classes = $derived([
		'card box overflow-hidden text-primary',
		surface[variant],
		padClass[size],
		gapClass[size],
		shape,
		live && 'interactive',
		(live || tilt) && 'motion',
		tilt && 'tilt',
		klass
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
