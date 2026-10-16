<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type KbdVariant = 'default' | 'outline' | 'subtle';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: KbdVariant;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', class: className = '', children, ...restProps }: Props = $props();

	// fractalstyler has no .kbd: a mono .chip carries the key cap.
	const PAINT_CLASSES: Record<KbdVariant, string> = {
		default: 'bg-sunken border-strong text-primary shadow-xs',
		outline: 'border-strong text-secondary',
		subtle: 'bg-extra text-muted'
	};
</script>

<kbd class="chip mono shrink-0 {PAINT_CLASSES[variant]} {className}" {...restProps}>
	{@render children?.()}
</kbd>
