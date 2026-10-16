<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'surface' | 'outline';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: BadgeVariant;
		/** Leading status dot */
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'primary', dot = false, class: className = '', children, ...restProps }: Props = $props();

	// .chip owns the type and padding; the variant only paints it.
	const PAINT_CLASSES: Record<BadgeVariant, string> = {
		primary: 'bg-extra text-theme',
		success: 'bg-success text-white',
		warning: 'bg-warning text-black',
		danger: 'bg-danger text-white',
		info: 'bg-info text-white',
		surface: 'bg-sunken text-secondary',
		outline: 'border-strong text-primary'
	};
</script>

<span class="chip row ycenter gap-xs shrink-0 {PAINT_CLASSES[variant]} {className}" {...restProps}>
	{#if dot}
		<svg width="0.6em" height="0.6em" viewBox="0 0 8 8" aria-hidden="true" class="shrink-0">
			<circle cx="4" cy="4" r="4" fill="currentColor" />
		</svg>
	{/if}
	{@render children?.()}
</span>
