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

	let { variant = 'subtle', size = 'md', class: className = '', children, ...restProps }: Props = $props();

	const PAINT_CLASSES: Record<CodeVariant, string> = {
		subtle: 'bg-sunken text-primary',
		outline: 'border text-primary',
		surface: 'bg-surface text-primary border-subtle',
		primary: 'bg-sunken text-theme'
	};
	const SIZE_CLASSES: Record<CodeSize, string> = { sm: 'text-sm', md: 'text-md', lg: 'text-bs' };
</script>

<code class="mono px-xs radius-xs {PAINT_CLASSES[variant]} {SIZE_CLASSES[size]} {className}" {...restProps}>
	{@render children?.()}
</code>
