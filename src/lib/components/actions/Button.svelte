<!-- @component A button, or a link styled as one when given `href`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		/** Renders an `a.btn` instead of a `<button>`. */
		href?: string;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'h-bs',
		shape = 'min',
		shadow = 'shad-none',
		textsize = 'text-md',
		href,
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

</script>

{#if href}
	<!-- An inert anchor drops its href: a.btn has no disabled state to lean on. -->
	<a
		href={href}
		class="row ycenter gap-sm shape size variant {variant} {size} {shape} {shadow} {textsize} {className}"
		{...restProps as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		class="row ycenter gap-sm shape size variant {variant} {size} {shape} {shadow} {textsize} {className}"
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}

