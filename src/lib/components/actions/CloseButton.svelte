<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Variant, Shape, Size } from '../../types';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		label?: string;
		variant?: string;
		size?: Size;
		shape?: Shape;
		type?: any;
		class?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label = 'Close',
		variant = "ghost",
		size = 'sm',
		shape = "modern",
		class: className = '',
		onclick,
		...restProps
	}: Props = $props();
</script>

<IconButton
	{label}
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	class="f-close-btn {className} el-variant"
	{onclick}
	{...(restProps as any)}
>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M7 7L17 17M17 7L7 17"/>
</svg>
</IconButton>

<style>
	@layer fractalsvelte-ui.components {
		:global(.f-close-btn) {
			opacity: 0.7;
			transition: opacity var(--f-duration-fast, 150ms) var(--f-ease, ease),
				background var(--f-duration-fast, 150ms) var(--f-ease, ease);
		}

		:global(.f-close-btn:hover) {
			opacity: 1;
			background: var(--f-hover, var(--state-hover));
		}
	}
</style>
