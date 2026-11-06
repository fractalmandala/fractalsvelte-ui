<!-- @component A square button holding only an icon, named for screen readers by `label`. -->

<script lang="ts">
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
		shape?: Shape;
		shadow?: Shadow;
		loading?: boolean;
		disabled?: boolean | null;
		class?: string;
		children?: Snippet;
		href?: string;
	}

	let {
		label,
		iconVariant,
		variant,
		icon,
		size = 'h-md',
		shape = 'rect',
		shadow = 'shad-none',
		loading = false,
		disabled = false,
		href,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const inert = $derived(Boolean(disabled || loading));
	const currentVariant = $derived(iconVariant ?? variant ?? icon ?? 'themed');
</script>

{#if href}
<a href={inert ? undefined : href}
	class="btn-icon size shape {currentVariant} {size} {shape} {shadow} {className}"
	aria-busy={loading || undefined}
	aria-disabled={inert || undefined}
	{...restProps as HTMLAnchorAttributes}
>
	{@render children?.()}
</a>
{:else}
<button
	class="btn-icon size shape {currentVariant} {size} {shape} {shadow} {className}"
	aria-label={label}
	title={label}
	disabled={Boolean(disabled || loading)}
	aria-busy={loading || undefined}
	{...restProps}
>
	{@render children?.()}
</button>
{/if}
