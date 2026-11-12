<!-- @component The panel shown when its tab is selected. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { springFade } from '../../../motion/index.js';
	import { getTabs } from './tabs.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The value of the `Tab` this panel belongs to. */
		value: string;
		/** The panel content. */
		children?: Snippet;
	}

	let { value, class: klass, children, ...rest }: Props = $props();

	const tabs = getTabs();
	const selected = $derived(tabs.value() === value);
	const tabId = $derived(`${tabs.uid}-${value}-tab`);
	const panelId = $derived(`${tabs.uid}-${value}-panel`);
</script>

{#if tabs.animated}
	{#if selected}
		<div
			id={panelId}
			role="tabpanel"
			aria-labelledby={tabId}
			tabindex="0"
			class={['pad-bs focus-ring', klass]}
			transition:springFade
			{...rest}
		>
			{@render children?.()}
		</div>
	{/if}
{:else if selected}
	<div
		id={panelId}
		role="tabpanel"
		aria-labelledby={tabId}
		tabindex="0"
		class={['pad-bs focus-ring', klass]}
		{...rest}
	>
		{@render children?.()}
	</div>
{:else}
	<div
		id={panelId}
		role="tabpanel"
		aria-labelledby={tabId}
		hidden
		class={klass}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
