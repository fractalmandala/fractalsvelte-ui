<!-- @component Clipboard copy trigger with automatic check-mark feedback state. -->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { IconVariant, Size, Shape, Shadow } from '$lib/types.js';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import Copy from '$lib/icons/copy.svelte';
	import Check from '$lib/icons/check.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		text: string;
		copiedLabel?: string;
		resetAfter?: number;
		iconVariant?: IconVariant;
		variant?: IconVariant;
		size?: Size;
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
		shape = 'rect',
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
	{size}
	{shape}
	{shadow}
	class={className}
	onclick={handleCopy}
	{...restProps}
>
	{#if copied}
		<Check />
	{:else}
		<Copy />
	{/if}
</IconButton>
