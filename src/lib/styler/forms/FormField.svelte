<!-- @component A wrapper that gives any form control a label, helper text, error and counter, and hands its variant, surface, size, shape and shadow to the Input or Select inside. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCircleAlert } from '@fractaldesign/icons/lucide';
	import type { Surface, Variant, Size, Shape, Shadow } from '../types';
	import { setFieldLook } from './field-context';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		/** id of the control this field labels */
		id?: string;
		required?: boolean;
		optional?: boolean;
		description?: string;
		helperText?: string;
		error?: string;
		counter?: string;
		/** Passed to the Input or Select inside unless it sets its own. */
		/** Select's look. */
		variant?: Variant;
		/** Fill of the Input or Select inside. */
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		children?: Snippet;
		labelSnippet?: Snippet;
		class?: string;
	}

	let {
		label,
		id,
		required = false,
		optional = false,
		description,
		helperText,
		error,
		counter,
		variant,
		surface,
		size,
		shape,
		shadow,
		children,
		labelSnippet,
		class: className = '',
		...restProps
	}: Props = $props();

	setFieldLook(() => ({ variant, surface, size, shape, shadow, invalid: Boolean(error) }));
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label || labelSnippet || counter}
		<div class="row ycenter xbetween gap-sm">
			<div class="row ycenter gap-xs">
				{#if labelSnippet}
					{@render labelSnippet()}
				{:else if label}
					<label class="text-xs weight-500 text-secondary" for={id}>{label}</label>
				{/if}
				{#if required}
					<span class="text-sm text-danger" title="Required field" aria-hidden="true">*</span>
				{:else if optional}
					<span class="text-sm text-muted">Optional</span>
				{/if}
			</div>
			{#if counter}<span class="text-sm tabular-nums text-muted" aria-live="polite">{counter}</span>{/if}
		</div>
	{/if}
	{#if description}
		<p class="text-body-sm text-muted" id={id ? `${id}-desc` : undefined}>{description}</p>
	{/if}
	<div class="box">
		{@render children?.()}
	</div>
	{#if error}
		<p class="text-body-sm text-danger row ycenter gap-xs" id={id ? `${id}-error` : undefined} role="alert">
			<Icon icon={luCircleAlert} class="shrink-0" />
			<span>{error}</span>
		</p>
	{:else if helperText}
		<p class="text-body-sm text-muted" id={id ? `${id}-helper` : undefined}>{helperText}</p>
	{/if}
</div>
