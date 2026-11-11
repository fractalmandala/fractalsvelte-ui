<!-- @component A dismiss button with an X icon for closing panels, dialogs and dismissible items. -->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { IconVariant, Size, Shape, Shadow } from '$lib/types.js';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klX } from '$lib/icons/keylinestroke.js';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		label?: string;
		/** Visual style variant for close button. */
		iconVariant?: IconVariant;
		/** Alias for iconVariant */
		variant?: IconVariant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
	}

	let {
		label = 'Close',
		iconVariant,
		variant,
		size = 'h-md',
		shape = 'modern',
		shadow = 'shad-none',
		class: className = '',
		...restProps
	}: Props = $props();

	const currentVariant = $derived(iconVariant ?? variant ?? 'ghost');
</script>

<IconButton {label} iconVariant={currentVariant} {size} {shape} {shadow} class={className} {...restProps}>
	<Icon icon={klX} />
</IconButton>
