<!-- @component One tab button, paired with a TabPanel of the same value. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	
	import { getTabs } from './tabs.svelte.js';

	interface Props extends HTMLButtonAttributes {
		/** The value this tab represents, paired with its `TabPanel`. */
		value: string;
		/** Prevents the tab from being selected. */
		disabled?: boolean;
		/** The tab label. */
		children?: Snippet;
	}

	let { value, disabled = false, class: className, children, ...rest }: Props = $props();

	const tabs = getTabs();
	const selected = $derived(tabs.value() === value);
	const tabId = $derived(`${tabs.uid}-${value}-tab`);
	const panelId = $derived(`${tabs.uid}-${value}-panel`);

	function onSelect() {
		if (disabled) return;
		tabs.select(value);
	}
</script>

<button
	id={tabId}
	type="button"
	role="tab"
	data-value={value}
	tabindex={selected ? 0 : -1}
	aria-selected={selected}
	aria-controls={panelId}
	disabled={disabled || undefined}
	class={[
		'bare relative z-raised row ycenter xcenter gap-sm px-md weight-500 focus-ring select-none',
		tabs.size,
		selected ? '' : 'text-secondary',
		disabled && 'disabled',
		className
	]}
	onclick={onSelect}
	{...rest}
>
	{@render children?.()}
</button>
