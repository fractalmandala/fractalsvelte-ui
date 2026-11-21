<!-- @component A form label that names its control, with required and optional markers. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { type Size, type TextColor } from '../../../internal/tokens.js';
	import type {  HTMLLabelAttributes  } from 'svelte/elements';

	interface Props extends HTMLLabelAttributes {
		for?: string;
		size?: Size;
		textColor?: TextColor;
		required?: boolean;
		optional?: boolean;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		for: htmlFor,
		size = 'h-sm',
		textColor = 'text-muted',
		required = false,
		optional = false,
		disabled = false,
		class: className,
		children,
		...rest
	}: Props = $props();


	const classes = $derived([
		'inline-flex xcenter gap-xs weight-500',
		size,
		disabled && 'disabled',
		className
	]);
</script>

<label class={classes} for={htmlFor} {...rest}>
	{@render children?.()}
	{#if required}
		<span class="tone-danger text-theme" aria-hidden="true">*</span>
	{/if}
	{#if optional}
		<span class={['weight-400', textColor]}>Optional</span>
	{/if}
</label>
