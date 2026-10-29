<!-- @component A label chip, optionally removable, filled with or coloured by a surface, theme or message colour. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon as Iconbox, type IconData } from '@fractaldesign/icons';
	import type { Size, Shape, Surface, ThemeColor, Message } from '../types';
	import CloseButton from '../actions/CloseButton.svelte';

	export type TagColor = Surface | ThemeColor | Message;

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Fill colour, or the text colour when `textOnly` is set. */
		variant?: TagColor;
		/** Colours the text and icon instead of the background. */
		textOnly?: boolean;
		size?: Size;
		shape?: Shape;
		removable?: boolean;
		removeLabel?: string;
		onremove?: (event: MouseEvent) => void;
		icon?: IconData;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'theme-color',
		textOnly = false,
		size = 'h-sm',
		shape = 'min',
		removable = false,
		removeLabel = 'Remove tag',
		onremove,
		icon,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Surface and state fills can be light or dark depending on the token and mode, so their ink is
	// picked from the fill's lightness; theme and message fills take white.
	const ink = $derived(variant.startsWith('bg-') || variant.startsWith('state-') ? 'ink-auto' : 'text-white');

	function handleRemove(event: MouseEvent) {
		event.stopPropagation();
		onremove?.(event);
	}
</script>

<span
	class="tag row ycenter gap-xs shrink-0 el-size el-shape {size} {shape} {textOnly ? 'text-only' : ink} {className}"
	style:--tag-color="var(--{variant})"
	{...restProps}
>
	{#if icon}<Iconbox {icon} />{/if}
	{@render children?.()}
	{#if removable}
		<CloseButton label={removeLabel} size="h-sm" class="tag-remove" onclick={handleRemove} />
	{/if}
</span>
