<script lang="ts" module>
	import type { MenuEntry } from './MenuList.svelte';

	export interface DropdownMenuItem extends MenuEntry {
		onclick?: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Anchor, { type Placement } from './Anchor.svelte';
	import MenuList from './MenuList.svelte';

	interface Props {
		open?: boolean;
		placement?: Placement;
		closeOnSelect?: boolean;
		items?: DropdownMenuItem[];
		label?: string;
		class?: string;
		trigger?: Snippet<[{ open: boolean; toggle: () => void }]>;
		/** Custom menu body replacing items */
		children?: Snippet<[{ close: () => void }]>;
	}

	let {
		open = $bindable(false),
		placement = 'bottom-start',
		closeOnSelect = true,
		items = [],
		label,
		class: className = '',
		trigger: triggerSnippet,
		children
	}: Props = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	const close = () => (open = false);

	$effect(() => {
		if (!open) return;
		const away = (e: PointerEvent) => {
			if (rootEl && !rootEl.contains(e.target as Node)) close();
		};
		document.addEventListener('pointerdown', away, true);
		return () => document.removeEventListener('pointerdown', away, true);
	});
</script>

<div bind:this={rootEl} class="row {className}">
	<Anchor {placement} {open}>
		{#snippet trigger()}
			{@render triggerSnippet?.({ open, toggle: () => (open = !open) })}
		{/snippet}
		{#snippet panel()}
			{#if children}
				<div role="menu" tabindex="-1" class="box gap-xs pad-xs bg-surface border shadow-md radius-md">
					{@render children({ close })}
				</div>
			{:else}
				<MenuList
					{items}
					{label}
					onclose={close}
					onselect={(item) => {
						(item as DropdownMenuItem).onclick?.();
						if (closeOnSelect) close();
					}}
				/>
			{/if}
		{/snippet}
	</Anchor>
</div>
