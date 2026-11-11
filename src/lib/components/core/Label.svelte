<!-- @component An accessible form label with required indicator and optional description text. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { TextSize } from '$lib/types.js';

	interface Props extends HTMLLabelAttributes {
		for?: string;
		/** Show a required asterisk indicator */
		required?: boolean;
		/** Optional descriptive helper text placed below or next to label */
		description?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		for: htmlFor,
		required = false,
		description,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<label for={htmlFor} class="box gap-xs wmax pointer weight-500 {textsize} {className}" {...restProps}>
	<span class="row ycenter gap-xs text-primary">
		{@render children?.()}
		{#if required}
			<span class="text-danger weight-700" aria-hidden="true">*</span>
		{/if}
	</span>
	{#if description}
		<span class="text-xs text-secondary weight-400">{description}</span>
	{/if}
</label>
