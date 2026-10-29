<!-- @component A keyboard key, as an icon button or a static keycap for showing shortcuts. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon as Iconbox, type IconData } from '@fractaldesign/icons';
	import { luKeyboard } from '@fractaldesign/icons/lucide';
	import type { Size, Shape, Icon } from '../types';
	import IconButton from '../actions/IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label?: string;
		/** The key's icon, e.g. luCommand or luArrowBigUp. */
		glyph?: IconData;
		/** Keycap look; ghost by default, for the button and the static keycap alike. */
		icon?: Icon;
		size?: Size;
		shape?: Shape;
		/** Render a non-interactive keycap (a span) instead of a button. */
		static?: boolean;
		disabled?: boolean | null;
		class?: string;
		/** Replaces the glyph, e.g. a letter key. */
		children?: Snippet;
	}

	let {
		label = 'Keyboard',
		glyph = luKeyboard,
		icon,
		size = 'h-sm',
		shape = 'min',
		static: isStatic = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
	const look = $derived<Icon>(icon ?? 'ghost');
</script>

{#if isStatic}
	<span class="kbd btn-icon el-size el-shape px-xs shrink-0 {look} {size} {shape} {className}" style:width="auto" style:min-width="var(--height-{size.slice(2)})">
		{#if children}{@render children()}{:else}<Iconbox icon={glyph} />{/if}
	</span>
{:else}
	<IconButton {label} icon={look} {size} {shape} class="kbd {className}" {...restProps}>
		{#if children}{@render children()}{:else}<Iconbox icon={glyph} />{/if}
	</IconButton>
{/if}
