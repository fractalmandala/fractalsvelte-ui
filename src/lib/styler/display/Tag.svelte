<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luX } from 'fractalicons/lucide';

	export type TagVariant = 'primary' | 'secondary' | 'soft' | 'outline' | 'surface';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: TagVariant;
		removable?: boolean;
		removeLabel?: string;
		onremove?: (event: MouseEvent) => void;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		variant = 'soft',
		removable = false,
		removeLabel = 'Remove tag',
		onremove,
		class: className = '',
		icon,
		children,
		...restProps
	}: Props = $props();

	const PAINT_CLASSES: Record<TagVariant, string> = {
		primary: 'bg-extra text-theme border-subtle',
		secondary: 'bg-sunken text-primary border',
		soft: 'bg-extra text-secondary',
		outline: 'border-strong text-primary',
		surface: 'bg-surface text-primary border-subtle'
	};

	function handleRemove(event: MouseEvent) {
		event.stopPropagation();
		onremove?.(event);
	}
</script>

<span class="chip row ycenter gap-xs shrink-0 {PAINT_CLASSES[variant]} {className}" {...restProps}>
	{#if icon}
		<span class="row ycenter shrink-0" aria-hidden="true">{@render icon()}</span>
	{/if}
	{@render children?.()}
	{#if removable}
		<button
			type="button"
			data-variant="iconbox"
			data-size="sm"
			aria-label={removeLabel}
			title={removeLabel}
			class="px-xs text-muted"
			onclick={handleRemove}
		>
			<Icon icon={luX} />
		</button>
	{/if}
</span>
