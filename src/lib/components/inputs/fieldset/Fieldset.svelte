<!-- @component Semantic native <fieldset> and <legend> container for grouping related form fields. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import type { Gap, Pad, Shape, Surface } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLFieldsetAttributes, 'disabled'> {
		/** Group heading rendered inside `<legend>`. */
		legend?: string;
		/** Supporting explanation shown below the legend. */
		description?: string;
		/** Validation error displayed underneath the group fields. */
		error?: string;
		/** Container surface style on the shared surface axis. */
		surface?: Surface;
		/** Corner shape. */
		shape?: Shape;
		/** Internal padding override on the shared pad ladder. */
		pad?: Pad;
		/** Spacing between group sections on the shared gap ladder. */
		gap?: Gap;
		/** Natively disables all descendant form controls. */
		disabled?: boolean;
		/** Marks the group invalid even without an inline `error` string. */
		invalid?: boolean;
		/** Form fields inside the group. */
		children?: Snippet;
		/** Optional action or summary footer below fields. */
		footer?: Snippet;
	}

	let {
		legend,
		description,
		error,
		surface = 'outlined',
		shape = 'modern',
		pad = 'pad-bs',
		gap = 'gap-md',
		disabled = false,
		invalid = false,
		class: className,
		children,
		footer,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const errorId = $derived(error ? `${uid}-error` : undefined);
	const descId = $derived(description ? `${uid}-desc` : undefined);
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
		<legend class="text-sm weight-600 px-xs">{legend}</legend>
	{/if}
	{#if description}
		<p id={descId} class="text-sm text-secondary">{description}</p>
	{/if}
	<div class={['box', gap]}>
		{@render children?.()}
	</div>
	{#if error}
		<p id={errorId} role="alert" class="text-xs text-danger">{error}</p>
	{/if}
	{#if footer}
		<div class="pt-xs">
			{@render footer()}
		</div>
	{/if}
</fieldset>
