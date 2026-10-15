<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type CodeVariant = 'subtle' | 'outline' | 'surface' | 'primary';
	export type CodeSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: CodeVariant;
		size?: CodeSize;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'subtle',
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<code
	class="f-code {className}"
	data-variant={variant}
	data-size={size}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</code>

<style>
	@layer fractalsvelte-ui.components {
		.f-code {
			font-family: var(--f-font-mono);
			font-weight: 450;
			line-height: normal;
			border-radius: var(--f-radius-xs);
			box-sizing: border-box;
			white-space: break-spaces;
			word-break: break-word;
		}

		/* Sizes */
		.f-code[data-size='sm'] {
			font-size: 0.75em;
			padding: 1px 4px;
		}

		.f-code[data-size='md'] {
			font-size: 0.85em;
			padding: 2px 6px;
		}

		.f-code[data-size='lg'] {
			font-size: 0.95em;
			padding: 3px 8px;
		}

		/* Variants */
		.f-code[data-variant='subtle'] {
			background: var(--f-sunken);
			color: var(--f-text);
			border: 1px solid var(--f-border-subtle);
		}

		.f-code[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border: 1px solid var(--f-border-strong);
		}

		.f-code[data-variant='surface'] {
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}

		.f-code[data-variant='primary'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border: 1px solid rgba(16, 185, 129, 0.2);
		}
	}
</style>
