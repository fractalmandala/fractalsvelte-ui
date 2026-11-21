<!-- @component A radio item; choosing it selects the value and closes the menu. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import type { ChildTextColor, ChildTextSize, Size } from '../../../internal/tokens.js';
	import { getMenuRadio } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value: string;
		shortcut?: string;
		size?: Size;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		value,
		shortcut,
		size = 'h-md',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		disabled = false,
		children,
		class: className,
		...rest
	}: Props = $props();

	const radio = getMenuRadio();
	const checked = $derived(radio.value() === value);

	function choose() {
		if (disabled) return;
		radio.setValue(value);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			choose();
		}
	}
</script>

<div
	role="menuitemradio"
	data-menu-item
	tabindex="-1"
	aria-checked={checked}
	aria-disabled={disabled || undefined}
	class={['item', disabled && 'disabled', className]}
	onclick={choose}
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
