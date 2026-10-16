<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luExternalLink } from 'fractalicons/lucide';
	import type { FsVariant, FsSize, FsShape } from '../types';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		variant?: FsVariant;
		size?: FsSize;
		shape?: FsShape;
		/** Opens in a new tab with rel="noopener noreferrer" and an external-link glyph. */
		external?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		href,
		variant = 'secondary',
		size = 'md',
		shape = 'modern',
		external = false,
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const target = $derived(external ? '_blank' : restProps.target);
	const rel = $derived(external ? 'noopener noreferrer' : restProps.rel);
</script>

<a
	{href}
	class="btn gap-xs {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	{...restProps}
	{target}
	{rel}
>
	{@render leading?.()}
	{@render children?.()}
	{#if external}
		<Icon icon={luExternalLink} class="text-muted" />
	{:else}
		{@render trailing?.()}
	{/if}
</a>
