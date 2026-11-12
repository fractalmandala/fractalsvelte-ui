<!-- @component A command in the menu — icon, label, shortcut, optional link. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { getMenu } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** An icon drawn before the label. */
		icon?: IconData;
		/** A keyboard shortcut, shown at the trailing edge. */
		shortcut?: string;
		/** Disables the item. */
		disabled?: boolean;
		/** Indent the label to line up with items that have an icon. */
		inset?: boolean;
		/** Renders the item as a link. The menu closes after it is followed. */
		href?: string;
		/** Called when the item is chosen. The menu then closes, unless the event is cancelled. */
		onclick?: (event: MouseEvent | KeyboardEvent) => void;
		/** The label. */
		children?: Snippet;
	}

	let { icon, shortcut, disabled = false, inset = false, href, onclick, children, class: klass, ...rest }: Props = $props();

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

	const classes = $derived(['item', disabled && 'disabled', klass]);
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
			<Icon {icon} class="text-secondary shrink-0" />
		{:else if inset}
			<span class="h-md square shrink-0"></span>
		{/if}
		<span class="grow truncate">{@render children?.()}</span>
		{#if shortcut}
			<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>
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
			<Icon {icon} class="text-secondary shrink-0" />
		{:else if inset}
			<span class="h-md square shrink-0"></span>
		{/if}
		<span class="grow truncate">{@render children?.()}</span>
		{#if shortcut}
			<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>
		{/if}
	</div>
{/if}
