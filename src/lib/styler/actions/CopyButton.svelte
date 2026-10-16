<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCopy, luCheck } from 'fractalicons/lucide';
	import type { FsVariant, FsSize, FsShape } from '../types';
	import Button from './Button.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		text: string;
		label?: string;
		copiedLabel?: string;
		/** How long the copied state holds, in ms. */
		resetAfter?: number;
		variant?: FsVariant;
		size?: FsSize;
		shape?: FsShape;
		class?: string;
	}

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied',
		resetAfter = 2000,
		variant = 'secondary',
		size = 'md',
		shape = 'modern',
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
</script>

<Button {variant} {size} {shape} class={className} onclick={handleCopy} aria-live="polite" {...restProps}>
	{#if copied}
		<Icon icon={luCheck} class="text-success" />
		<span>{copiedLabel}</span>
	{:else}
		<Icon icon={luCopy} />
		<span>{label}</span>
	{/if}
</Button>
