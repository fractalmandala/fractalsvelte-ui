<!-- @component A radio item; choosing it selects the value and closes the menu. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { getMenuRadio } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The value this item represents. */
		value: string;
		/** A keyboard shortcut, shown at the trailing edge. */
		shortcut?: string;
		/** Disables the item. */
		disabled?: boolean;
		/** The label. */
		children?: Snippet;
	}

	let { value, shortcut, disabled = false, children, class: klass, ...rest }: Props = $props();

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
	class={['item', disabled && 'disabled', klass]}
	onclick={choose}
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
