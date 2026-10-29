<!-- @component A button, or a link styled as one when given `href`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, Shadow } from '../types';
	import Spinner from '../display/Spinner.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		loading?: boolean;
		disabled?: boolean | null;
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
		loading = false,
		disabled = false,
		href,
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const inert = $derived(Boolean(disabled || loading));
</script>

{#snippet content()}
	{#if loading}
		<Spinner />
	{:else if leading}
		{@render leading()}
	{/if}
	{@render children?.()}
	{#if trailing && !loading}
		{@render trailing()}
	{/if}
{/snippet}

{#if href}
	<!-- An inert anchor drops its href: a.btn has no disabled state to lean on. -->
	<a
		href={inert ? undefined : href}
		class="row ycenter gap-sm el-shape el-size el-variant {variant} {size} {shape} {shadow} {className}"
		aria-busy={loading || undefined}
		aria-disabled={inert || undefined}
		{...restProps as HTMLAnchorAttributes}
	>
		{@render content()}
	</a>
{:else}
	<button
		class="row ycenter gap-sm el-shape el-size el-variant {variant} {size} {shape} {shadow} {className}"
		disabled={inert}
		aria-busy={loading || undefined}
		{...restProps}
	>
		{@render content()}
	</button>
{/if}

