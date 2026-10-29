<!-- @component A square button holding only an icon, named for screen readers by `label`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Icon, Size, Shape, Shadow } from '../types';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label: string;
		/** `iconbox` is fractalstyler's bare icon button (transparent, hover fill). */
		icon?: Icon;
		size?: Size;
		shape?: Shape;
		loading?: boolean;
		disabled?: boolean | null;
		class?: string;
		children?: Snippet;
		href?: string;
	}

	let {
		label,
		icon = 'primary',
		size = 'h-md',
		shape = 'modern',
		loading = false,
		disabled = false,
		href,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
	const inert = $derived(Boolean(disabled || loading));
</script>

{#if href}
<a href={inert ? undefined : href}
	class="btn-icon-text wmax row xleft el-size el-shape {icon} {size} {shape} {className}"
	aria-busy={loading || undefined}
	aria-disabled={inert || undefined}
	{...restProps as HTMLAnchorAttributes}
>
	{@render children?.()}
	<span class="text-sm">{label}</span>
</a>
{:else}
<button
	class="btn-icon-text wmax row xleft el-shape {icon} {shape} {size} {className}"
	aria-label={label}
	title={label}
	disabled={Boolean(disabled || loading)}
	aria-busy={loading || undefined}
	{...restProps}
>
	{@render children?.()}
	<span class="text-sm">{label}</span>
</button>
{/if}
