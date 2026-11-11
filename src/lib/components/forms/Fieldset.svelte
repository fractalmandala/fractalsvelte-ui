<!-- @component HTML fieldset container with styled legend, borders, padding, and disabled cascade. -->

<script lang="ts">
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Shape, Shadow, TextSize } from '$lib/types.js';

	interface Props extends HTMLFieldsetAttributes {
		legend?: string;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
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
	class="box gap-sm wfull {surface} {border} {shape} {padding} {shadow} {textsize} {className}"
	{...restProps}
>
	{#if legend}
		<legend class="px-sm weight-500 text-xs text-secondary tt-u ls-wide-xl">
			{legend}
		</legend>
	{/if}
	{@render children?.()}
</fieldset>

