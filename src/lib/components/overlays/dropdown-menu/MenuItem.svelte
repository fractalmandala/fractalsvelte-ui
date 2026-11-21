<!-- @component A command in the menu — icon, label, shortcut, optional link. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import type { ChildTextColor, ChildTextSize, Size, TextColor } from '../../../internal/tokens.js';
	import { getMenu } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		icon?: IconData;
		shortcut?: string;
		disabled?: boolean;
		inset?: boolean;
		size?: Size;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		href?: string;
		onclick?: (event: MouseEvent | KeyboardEvent) => void;
		children?: Snippet;
	}

	let {
		icon,
		shortcut,
		disabled = false,
		inset = false,
		size = 'h-md',
		textColor = 'text-secondary',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		href,
		onclick,
		children,
		class: className,
		...rest
	}: Props = $props();

	const menu = getMenu();

	function choose(event: MouseEvent | KeyboardEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
		if (!event.defaultPrevented) menu.close();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			choose(event);
			if (href && !event.defaultPrevented && !disabled) {
				window.location.assign(href);
			}
		}
	}

	const classes = $derived(['item', disabled && 'disabled', className]);
</script>

{#if href && !disabled}
	<a
		{href}
		role="menuitem"
		data-menu-item
		tabindex="-1"
		class={classes}
		onclick={choose}
		{onkeydown}
		{...rest}
	>
		{#if icon}
			<Icon {icon} class={['shrink-0', textColor]} />
		{:else if inset}
			<span class={['square shrink-0', size]}></span>
		{/if}
		<span class="grow truncate">{@render children?.()}</span>
		{#if shortcut}
			<kbd class={['kbd shrink-0 font-mono', childTextSize, childTextColor]}>{shortcut}</kbd>
		{/if}
	</a>
{:else}
	<div
		role="menuitem"
		data-menu-item
		tabindex="-1"
		aria-disabled={disabled || undefined}
		class={classes}
		onclick={choose}
		{onkeydown}
		{...rest}
	>
		{#if icon}
			<Icon {icon} class={['shrink-0', textColor]} />
		{:else if inset}
			<span class={['square shrink-0', size]}></span>
		{/if}
		<span class="grow truncate">{@render children?.()}</span>
		{#if shortcut}
			<kbd class={['kbd shrink-0 font-mono', childTextSize, childTextColor]}>{shortcut}</kbd>
		{/if}
	</div>
{/if}
