<!-- @component One tab button, paired with a TabPanel of the same value. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	
	import type {  AlignContent, Gap } from '../../../internal/tokens.js';
	import { getTabs } from './tabs.svelte.js';

	interface Props extends HTMLButtonAttributes {
		value: string;
		disabled?: boolean;
		gap?: Gap;
		alignContent?: AlignContent;
		children?: Snippet;
	}

	let { value, disabled = false, gap = 'gap-sm', alignContent = 'xcenter', class: className, children, ...rest }: Props = $props();

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
		'bare relative z-raised row ycenter px-md weight-500 focus-ring select-none',
		gap,
		alignContent,
		tabs.size,
		selected ? '' : tabs.textColor,
		disabled && 'disabled',
		className
	]}
	onclick={onSelect}
	{...rest}
>
	{@render children?.()}
</button>
