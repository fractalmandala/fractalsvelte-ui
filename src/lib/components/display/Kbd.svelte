<!-- @component A keyboard key, as an icon button or a static keycap for showing shortcuts. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Iconbox from '$lib/components/core/Icon.svelte';
	import type { IconNode } from '$lib/icons/types.js';
	import { klKeyboard } from '$lib/icons/keylinestroke.js';
	import type { Size, Shape, IconVariant, TextSize } from '$lib/types.js';
	import IconButton from '../actions/IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label?: string;
		/** The key's icon, e.g. klArrowBigUp. */
		glyph?: IconNode;
		/** Keycap look; ghost by default, for the button and the static keycap alike. */
		icon?: IconVariant;
		iconVariant?: IconVariant;
		size?: Size;
		shape?: Shape;
		/** Render a non-interactive keycap (a span) instead of a button. */
		static?: boolean;
		disabled?: boolean | null;
		textsize?: TextSize;
		class?: string;
		/** Replaces the glyph, e.g. a letter key. */
		children?: Snippet;
	}

	let {
		label = 'Keyboard',
		glyph = klKeyboard,
		icon,
		iconVariant,
		size = 'h-sm',
		shape = 'mincurved',
		static: isStatic = false,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
	const look = $derived<IconVariant>(iconVariant ?? icon ?? 'ghost');
</script>

{#if isStatic}
	<span class="inline-flex row xcenter ycenter px-sm shrink-0 font-mono border-strong {look} {size} {shape} {textsize} {className}">
		{#if children}{@render children()}{:else}<Iconbox icon={glyph} />{/if}
	</span>
{:else}
	<IconButton {label} iconVariant={look} {size} {shape} class="font-mono border-strong {textsize} {className}" {...restProps}>
		{#if children}{@render children()}{:else}<Iconbox icon={glyph} />{/if}
	</IconButton>
{/if}
