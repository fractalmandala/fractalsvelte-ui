<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { FsVariant, FsSize, FsShape, BtnType } from '../types';
	import Spinner from '../display/Spinner.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label: string;
		/** `iconbox` is fractalstyler's bare icon button (transparent, hover fill). */
		variant?: FsVariant | 'iconbox';
		size?: FsSize;
		shape?: FsShape;
		type?: BtnType;
		loading?: boolean;
		disabled?: boolean | null;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		variant = 'secondary',
		size = 'md',
		shape = 'modern',
		type = 'button',
		loading = false,
		disabled = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// iconbox carries its own sizing ladder (sm, icon-md, icon-bs, icon-lg).
	const ICONBOX_SIZE: Record<FsSize, string> = {
		sm: 'sm',
		md: 'icon-md',
		bs: 'icon-bs',
		lg: 'icon-lg'
	};
	const isIconbox = $derived(variant === 'iconbox');
</script>

<!-- frame-1-1 squares the control to its data-size height; px-xs trims the
     button's inline padding so the glyph gets the room. -->
<button
	{type}
	class="{isIconbox ? 'px-xs' : 'frame-1-1 px-xs'} {className}"
	data-variant={variant}
	data-size={isIconbox ? ICONBOX_SIZE[size] : size}
	data-shape={shape}
	aria-label={label}
	title={label}
	disabled={Boolean(disabled || loading)}
	aria-busy={loading || undefined}
	{...restProps}
>
	{#if loading}
		<Spinner />
	{:else}
		{@render children?.()}
	{/if}
</button>
