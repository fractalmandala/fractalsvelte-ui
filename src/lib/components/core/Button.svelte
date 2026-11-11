<!-- @component A button, or a link styled as one when given `href`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLButtonAttributes, 'class' | 'disabled'> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		/** Defaults to the text size that suits `size`. */
		textsize?: TextSize;
		/** Renders an `<a>` instead of a `<button>`. */
		href?: string;
		/** Disables the button; on a link, drops `href` and sets `aria-disabled`. */
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	// The text size each height reads best at, used until `textsize` says otherwise.
	const TEXT_FOR_SIZE: Record<Size, TextSize> = {
		'h-xs': 'text-xs',
		'h-sm': 'text-xs',
		'h-md': 'text-sm',
		'h-bs': 'text-sm',
		'h-lg': 'text-md',
		'h-xl': 'text-bs'
	};

	let {
		variant = 'primary',
		size = 'h-lg',
		shape = 'modern',
		shadow = 'shad-none',
		textsize,
		href,
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const classes = $derived(
		`button inline-flex gap-sm weight-500 ${variant} ${size} ${shape} ${shadow} ${textsize ?? TEXT_FOR_SIZE[size]} ${className}`
	);
</script>

{#if href}
	<!-- An anchor has no disabled state: an inert one drops its href and leaves the tab order. -->
	<a
		{...restProps as HTMLAnchorAttributes}
		href={disabled ? undefined : href}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : undefined}
		class={classes}
	>
		{@render leading?.()}
		{@render children?.()}
		{@render trailing?.()}
	</a>
{:else}
	<button {...restProps} {type} {disabled} class={classes}>
		{@render leading?.()}
		{@render children?.()}
		{@render trailing?.()}
	</button>
{/if}
