<!-- @component An icon button with an Close Icon, for closing panels, dialogs and dismissible items. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon as Iconbox } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import type { Size, Shape, Icon } from '../types';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/** Accessible name; also shown as the native tooltip. */
		label?: string;
		icon?: Icon;
		size?: Size;
		shape?: Shape;
		loading?: boolean;
		disabled?: boolean | null;
		class?: string;
		href?: string;
		/** Ignored: the glyph is always an X. */
		children?: Snippet;
	}

	let {
		label = 'Close',
		icon = 'ghost',
		size = 'h-md',
		shape = 'min',
		class: className = '',
		children: _children,
		...restProps
	}: Props = $props();
</script>

<IconButton {label} {icon} {size} {shape} class={className} {...restProps}>
	<Iconbox icon={luX} />
</IconButton>
