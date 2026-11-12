<!-- @component A square button holding only an icon, named for screen readers by `label`. -->

<script lang="ts">
	import { setIconFit } from '../core/icon-context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { IconVariant, Size, Shape, Shadow } from '$lib/types.js';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label: string;
		/** Visual style variant for icon button. */
		iconVariant?: IconVariant;
		/** Alias for iconVariant */
		variant?: IconVariant;
		/** Alias for iconVariant */
		icon?: IconVariant;
		size?: Size;
		/** The button is exactly its icon: no padding, the icon cropped to its drawn shape. An icon with its own `size` sets the button's size; otherwise the icon takes `size`. */
		fit?: boolean;
		shape?: Shape;
		shadow?: Shadow;
		/** Shows the button as busy and makes it inert. */
		loading?: boolean;
		/** Disables the button; on a link, drops `href` and sets `aria-disabled`. */
		disabled?: boolean | null;
		class?: string;
		children?: Snippet;
		/** Renders an `<a>` instead of a `<button>`. */
		href?: string;
	}

	let {
		label,
		iconVariant,
		variant,
		icon,
		size = 'h-md',
		fit = false,
		shape = 'rect',
		shadow = 'shad-none',
		loading = false,
		disabled = false,
		href,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// With fit, the icon inside sets the button's size and crops to its drawn shape.
	setIconFit(() => ({ fit, size }));

	const inert = $derived(Boolean(disabled || loading));
	const currentVariant = $derived(iconVariant ?? variant ?? icon ?? 'primary');
</script>

{#if href}
<a href={inert ? undefined : href}
	class="btn-icon {currentVariant} {size} {shape} {shadow} {fit ? 'fit-icon' : ''} {className}"
	aria-label={label}
	title={label}
	aria-busy={loading || undefined}
	aria-disabled={inert || undefined}
	{...restProps as HTMLAnchorAttributes}
>
	{@render children?.()}
</a>
{:else}
<button
	class="btn-icon {currentVariant} {size} {shape} {shadow} {fit ? 'fit-icon' : ''} {className}"
	aria-label={label}
	title={label}
	disabled={Boolean(disabled || loading)}
	aria-busy={loading || undefined}
	{...restProps}
>
	{@render children?.()}
</button>
{/if}
