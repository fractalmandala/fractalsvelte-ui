<script lang="ts" module>
	import type { MenuEntry } from './MenuList.svelte';

	export interface ContextMenuItem extends MenuEntry {
		id: string;
		onselect?: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Anchor, { type Placement } from './Anchor.svelte';
	import MenuList from './MenuList.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: ContextMenuItem[];
		/**
		 * Where the menu opens relative to the region. The original follows the
		 * pointer; that needs left/top coordinates, which fractalstyler cannot
		 * express, so the menu anchors to the region instead.
		 */
		placement?: Placement;
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		items = [],
		placement = 'bottom-start',
		label = 'Context menu',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!open) return;
		const away = (e: PointerEvent) => {
			if (rootEl && !rootEl.contains(e.target as Node)) open = false;
		};
		document.addEventListener('pointerdown', away, true);
		return () => document.removeEventListener('pointerdown', away, true);
	});
</script>

<div bind:this={rootEl} class="row">
	<Anchor {placement} {open}>
		{#snippet trigger()}
			<!-- Right-click, the ContextMenu key or Shift+F10 open the menu. -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={className}
				oncontextmenu={(e) => {
					e.preventDefault();
					open = true;
				}}
				onkeydown={(e) => {
					if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
						e.preventDefault();
						open = true;
					}
				}}
				{...restProps}
			>
				{@render children?.()}
			</div>
		{/snippet}
		{#snippet panel()}
			<MenuList
				{items}
				{label}
				onclose={() => (open = false)}
				onselect={(item) => {
					(item as ContextMenuItem).onselect?.();
					open = false;
				}}
			/>
		{/snippet}
	</Anchor>
</div>
