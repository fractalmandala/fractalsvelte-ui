<!-- @component Semantic native <fieldset> and <legend> container for grouping related form fields. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLFieldsetAttributes  } from 'svelte/elements';
	import type { 
		ChildTextColor,
		ChildTextSize,
		Gap,
		Pad,
		Shape,
		Surface,
		TextColor,
		TextSize
	 } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLFieldsetAttributes, 'disabled'> {
		legend?: string;
		description?: string;
		error?: string;
		surface?: Surface;
		shape?: Shape;
		gap?: Gap;
		pad?: Pad;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		disabled?: boolean;
		invalid?: boolean;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		legend,
		description,
		error,
		surface = 'outlined',
		shape = 'modern',
		gap = 'gap-md',
		pad = 'pad-bs',
		textSize = 'text-sm',
		textColor = 'text-primary',
		childTextSize,
		childTextColor,
		disabled = false,
		invalid = false,
		class: className,
		children,
		footer,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const errorId = $derived(error ? `${uid}-error` : undefined);
	const descriptionInk = $derived(childTextColor ?? 'text-secondary');
	const errorInk = $derived(childTextColor ?? 'text-danger');
	const descId = $derived(description ? `${uid}card-desc` : undefined);
	const describedBy = $derived([descId, errorId].filter(Boolean).join(' ') || undefined);
</script>

<fieldset
	{disabled}
	data-invalid={invalid || error ? 'true' : undefined}
	aria-describedby={describedBy}
	class={['box', gap, surface, shape, pad, disabled && 'disabled', className]}
	{...rest}
>
	{#if legend}
		<legend class={[textSize, textColor, 'weight-600 px-xs']}>{legend}</legend>
	{/if}
	{#if description}
		<p id={descId} class={[childTextSize ?? textSize, descriptionInk]}>{description}</p>
	{/if}
	<div class={['box', gap]}>
		{@render children?.()}
	</div>
	{#if error}
		<p id={errorId} role="alert" class={[childTextSize ?? textSize, errorInk]}>{error}</p>
	{/if}
	{#if footer}
		<div class="pt-xs">
			{@render footer()}
		</div>
	{/if}
</fieldset>
