<!-- @component Clipboard copy trigger with automatic check-mark feedback state. -->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { IconVariant, Size, Shape, Shadow } from '$lib/types.js';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klCheck, klCopy } from '$lib/icons/keylinestroke.js';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		text: string;
		copiedLabel?: string;
		resetAfter?: number;
		iconVariant?: IconVariant;
		variant?: IconVariant;
		size?: Size;
		/** The button is exactly its icon: no padding, the icon cropped to its drawn shape and sized by `size`. */
		fit?: boolean;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
	}

	let {
		text,
		copiedLabel = 'Copied',
		resetAfter = 2000,
		iconVariant,
		variant,
		size = 'h-md',
		fit = false,
		shape = 'modern',
		shadow = 'shad-none',
		class: className = '',
		...restProps
	}: Props = $props();

	let copied = $state(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), resetAfter);
		} catch (err) {
			console.error('Failed to copy to clipboard', err);
		}
	}

	const currentVariant = $derived(iconVariant ?? variant ?? 'ghost');
</script>

<IconButton
	variant={currentVariant}
	label={copied ? copiedLabel : 'Copy'}
	{size} {fit}
	{shape}
	{shadow}
	class={className}
	onclick={handleCopy}
	{...restProps}
>
	{#if copied}
		<Icon icon={klCheck} />
	{:else}
		<Icon icon={klCopy} />
	{/if}
</IconButton>
