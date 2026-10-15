<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape } from '../../types';
	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		disabled?: boolean;
		loading?: boolean;
		dropdownLabel?: string;
		class?: string;
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
		ondropdown?: (event: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		shape = 'rounded',
		disabled = false,
		loading = false,
		dropdownLabel = 'More options',
		class: className = '',
		children,
		onclick,
		ondropdown,
		...restProps
	}: Props = $props();
</script>

<div class="f-split-btn {className}" data-shape={shape} {...restProps}>
	<Button
		{variant}
		{size}
		{shape}
		{disabled}
		{loading}
		class="f-split-main"
		{onclick}
	>
		{#if children}
			{@render children()}
		{/if}
	</Button>

	<IconButton
		label={dropdownLabel}
		{variant}
		{size}
		{shape}
		{disabled}
		class="f-split-arrow"
		onclick={ondropdown}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</IconButton>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-split-btn {
			display: inline-flex;
			align-items: stretch;
			box-sizing: border-box;
		}

		.f-split-btn :global(.f-split-main) {
			border-top-right-radius: 0 !important;
			border-bottom-right-radius: 0 !important;
		}

		.f-split-btn :global(.f-split-arrow) {
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
			margin-left: -1px;
			border-left-color: rgba(255, 255, 255, 0.2) !important;
		}
	}
</style>
