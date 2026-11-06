<!-- @component An accessible form label with required indicator and optional description text. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Size, TextSize } from '$lib/types.js';

	interface Props extends HTMLLabelAttributes {
		for?: string;
		/** Show a required asterisk indicator */
		required?: boolean;
		/** Optional descriptive helper text placed below or next to label */
		description?: string;
		size?: Size;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		for: htmlFor,
		required = false,
		description,
		size = 'h-sm',
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<label
	for={htmlFor}
	class="form-label inline-flex flex-col gap-0.5 font-medium select-none cursor-pointer {textsize} {className}"
	{...restProps}
>
	<span class="inline-flex items-center gap-1 text-primary">
		{@render children?.()}
		{#if required}
			<span class="text-danger font-bold" aria-hidden="true">*</span>
		{/if}
	</span>
	{#if description}
		<span class="text-xs text-secondary font-normal">{description}</span>
	{/if}
</label>

<style>
	.form-label .text-danger {
		color: var(--danger);
	}
	.form-label .text-secondary {
		color: var(--text-secondary);
	}
	.form-label .text-primary {
		color: var(--text-primary);
	}
</style>
