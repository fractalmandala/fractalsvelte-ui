<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Size, Variant } from '../../types';
	import Button from './Button.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		text: string;
		label?: string;
		copiedLabel?: string;
		variant?: Variant;
		size?: Size;
		type?: any;
		class?: string;
	}

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied!',
		variant = 'secondary',
		size = 'sm',
		class: className = '',
		...restProps
	}: Props = $props();

	let copied = $state(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard', err);
		}
	}
</script>

<Button
	{variant}
	{size}
	class="f-copy-btn {className}"
	onclick={handleCopy}
	aria-label={copied ? copiedLabel : label}
	{...(restProps as any)}
>
	{#if copied}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="var(--f-success)"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
		<span>{copiedLabel}</span>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
		<span>{label}</span>
	{/if}
</Button>

<style>
	@layer fractalsvelte-ui.components {
		:global(.f-copy-btn) svg {
			flex-shrink: 0;
		}
	}
</style>
