<!-- @component A single section that expands and collapses under a header. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown, luChevronUp } from '@fractaldesign/icons/lucide';
	import type { Variant, Size, Surface, Border, Shape, Shadow } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		open?: boolean;
		disabled?: boolean;
		title?: string;
		/** Trigger paint */
		variant?: Variant;
		/** Trigger height */
		size?: Size;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
		header?: Snippet<[{ isOpen: boolean; toggle: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		disabled = false,
		title = '',
		variant = 'ghost',
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-none',
		class: className = '',
		header,
		children,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const toggle = () => !disabled && (open = !open);
</script>

<!-- The accordion item: .open swaps the content grid row from 0fr
     to 1fr, which is the collapse animation. inert keeps the hidden body out
     of the tab order. -->
<div class="accordion-item wfull el-shape {surface} {border} {shape} {shadow} {open ? 'open' : ''} {className}" {...restProps}>
	{#if header}
		{@render header({ isOpen: open, toggle })}
	{:else}
		<button
			type="button"
			class="accordion-trigger wfull gap-sm px-sm weight-500 el-variant el-size el-shape {variant} {size} {shape} {disabled ? 'text-muted' : ''}"
			aria-expanded={open}
			aria-controls="{uid}-content"
			{disabled}
			onclick={toggle}
		>
			<span>{title}</span>
			<Icon icon={open ? luChevronUp : luChevronDown} class="text-muted shrink-0" />
		</button>
	{/if}
	<div id="{uid}-content" class="accordion-content" inert={!open}>
		<div class="accordion-panel text-body-sm text-secondary">
			{@render children?.()}
		</div>
	</div>
</div>
