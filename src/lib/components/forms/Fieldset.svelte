<!-- @component HTML fieldset container with styled legend, borders, padding, and disabled cascade. -->

<script lang="ts">
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Shape, Pad, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLFieldsetAttributes {
		legend?: string;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		padding?: Pad;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		legend,
		disabled = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		padding = 'pad-md',
		shadow = 'shad-none',
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<fieldset
	{disabled}
	class="fieldset-root box gap-sm {surface} {border} {shape} {padding} {shadow} {textsize} {className}"
	{...restProps}
>
	{#if legend}
		<legend class="legend-text font-medium text-xs text-secondary px-xs">
			{legend}
		</legend>
	{/if}
	{@render children?.()}
</fieldset>

<style>
	.fieldset-root {
		margin: 0;
		width: 100%;
		border: 1px solid var(--border, #e5e7eb);
	}

	.fieldset-root:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.legend-text {
		padding: 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
