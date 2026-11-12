<!-- @component A toggling item that stays open after it is changed. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Whether the item is checked. */
		checked?: boolean;
		/** Called when the item is toggled. */
		onCheckedChange?: (checked: boolean) => void;
		/** A keyboard shortcut, shown at the trailing edge. */
		shortcut?: string;
		/** Disables the item. */
		disabled?: boolean;
		/** The label. */
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		onCheckedChange,
		shortcut,
		disabled = false,
		children,
		class: klass,
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
	class={['item', disabled && 'disabled', klass]}
	onclick={toggle}
	{onkeydown}
	{...rest}
>
	<span class="box xcenter ycenter h-md square shrink-0">
		{#if checked}
			<Icon icon={luCheck} class="text-theme" />
		{/if}
	</span>
	<span class="grow truncate">{@render children?.()}</span>
	{#if shortcut}
		<kbd class="kbd shrink-0 font-mono text-xs text-muted">{shortcut}</kbd>
	{/if}
</div>
