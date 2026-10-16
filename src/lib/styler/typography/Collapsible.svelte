<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luChevronDown, luChevronUp } from 'fractalicons/lucide';
	import type { FsVariant } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		open?: boolean;
		disabled?: boolean;
		title?: string;
		/** .fsx-accordion-item paint */
		variant?: FsVariant;
		shape?: 'modern' | 'curved';
		class?: string;
		header?: Snippet<[{ isOpen: boolean; toggle: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		disabled = false,
		title = '',
		variant = 'primary',
		shape = 'curved',
		class: className = '',
		header,
		children,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const toggle = () => !disabled && (open = !open);
</script>

<!-- fractalstyler's accordion item: .open swaps the content grid row from 0fr
     to 1fr, which is the collapse animation. inert keeps the hidden body out
     of the tab order. -->
<div class="fsx-accordion-item {open ? 'open' : ''} {className}" data-variant={variant} data-shape={shape} {...restProps}>
	{#if header}
		{@render header({ isOpen: open, toggle })}
	{:else}
		<button
			type="button"
			class="fsx-accordion-trigger gap-sm text-sm weight-500 {disabled ? 'text-muted' : ''}"
			aria-expanded={open}
			aria-controls="{uid}-content"
			{disabled}
			onclick={toggle}
		>
			<span>{title}</span>
			<Icon icon={open ? luChevronUp : luChevronDown} class="text-muted shrink-0" />
		</button>
	{/if}
	<div id="{uid}-content" class="fsx-accordion-content" inert={!open}>
		<div class="fsx-accordion-panel text-body-sm text-secondary">
			{@render children?.()}
		</div>
	</div>
</div>
