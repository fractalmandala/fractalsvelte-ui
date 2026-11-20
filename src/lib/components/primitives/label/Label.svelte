<!-- @component A form label that names its control, with required and optional markers. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type Size } from '../../../internal/tokens.js';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	interface Props extends HTMLLabelAttributes {
		/** The id of the control this label names. Sets the native for attribute. */
		for?: string;
		/** The label scale: text size. */
		size?: Size;
		/** Draws a red asterisk after the label. The control itself must still carry the required attribute. */
		required?: boolean;
		/** Draws a muted "Optional" after the label, for fields that may be left empty. */
		optional?: boolean;
		/** Dims the label to match a disabled control. */
		disabled?: boolean;
		/** The label text. */
		children?: Snippet;
	}

	let {
		for: htmlFor,
		size = 'h-sm',
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
		<span class="text-danger" aria-hidden="true">*</span>
	{/if}
	{#if optional}
		<span class="weight-400 text-muted">Optional</span>
	{/if}
</label>
