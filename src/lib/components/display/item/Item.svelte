<!-- @component A list or row item with leading media, a title, a description and trailing actions. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import type { Shape, Size } from '../../../internal/tokens.js';
	import { itemPadClass, setItemContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** `default` is a quiet row, `outline` is a hairline box, `muted` is a tinted panel. */
		variant?: 'default' | 'outline' | 'muted';
		/** The padding and the type scale of the title. */
		size?: Size;
		/** The corner shape. */
		shape?: Shape;
		/** Makes the whole row a target: a hover fill, a keyboard focus ring and, without `href`, a focusable row that activates on Enter and Space. */
		interactive?: boolean;
		/** Renders the row as an `<a>` that navigates. Implies `interactive`. */
		href?: string;
		/** Where to open the link, when `href` is set. */
		target?: HTMLAnchorAttributes['target'];
		/** Called when an interactive row without `href` is activated by click, Enter or Space. */
		onclick?: (event: MouseEvent) => void;
		/** The media, content and actions. */
		children?: Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		shape = 'modern',
		interactive = false,
		href,
		target,
		onclick,
		class: klass,
		children,
		...rest
	}: Props = $props();

	setItemContext({
		get size() {
			return size;
		}
	});

	const surface: Record<'default' | 'outline' | 'muted', string> = {
		default: 'bg-none',
		outline: 'border',
		muted: 'state-selected'
	};

	const live = $derived(interactive || href !== undefined);
	const classes = $derived([
		'row ycenter gap-sm wfull',
		itemPadClass[size],
		shape,
		surface[variant],
		live && 'interactive focus-ring',
		href !== undefined && 'link-plain',
		klass
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
