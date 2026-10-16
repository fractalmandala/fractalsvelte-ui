<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Size } from '../../types';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		label?: string;
		size?: Size;
		type?: any;
		class?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label = 'Close',
		size = 'sm',
		class: className = '',
		onclick,
		...restProps
	}: Props = $props();
</script>

<IconButton
	{label}
	variant="ghost"
	{size}
	shape="rounded"
	class="f-close-btn {className}"
	{onclick}
	{...(restProps as any)}
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
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
</IconButton>

<style>
	@layer fractalsvelte-ui.components {
		:global(.f-close-btn) {
			opacity: 0.7;
			transition: opacity var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		:global(.f-close-btn:hover) {
			opacity: 1;
			background: var(--f-hover);
		}
	}
</style>
