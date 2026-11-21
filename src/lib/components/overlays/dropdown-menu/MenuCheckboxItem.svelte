<!-- @component A toggling item that stays open after it is changed. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import type { ChildTextColor, ChildTextSize, Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		checked?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		shortcut?: string;
		size?: Size;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		onCheckedChange,
		shortcut,
		size = 'h-md',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		disabled = false,
		children,
		class: className,
		...rest
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onCheckedChange?.(checked);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}
</script>

<div
	role="menuitemcheckbox"
	data-menu-item
	tabindex="-1"
	aria-checked={checked}
	aria-disabled={disabled || undefined}
	class={['item', disabled && 'disabled', className]}
	onclick={toggle}
	{onkeydown}
	{...rest}
>
	<span class={['box xcenter ycenter square shrink-0', size]}>
		{#if checked}
			<Icon icon={luCheck} class="text-theme" />
		{/if}
	</span>
	<span class="grow truncate">{@render children?.()}</span>
	{#if shortcut}
		<kbd class={['kbd shrink-0 font-mono', childTextSize, childTextColor]}>{shortcut}</kbd>
	{/if}
</div>
