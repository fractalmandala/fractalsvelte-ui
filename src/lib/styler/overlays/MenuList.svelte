<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuEntry {
		id?: string;
		label?: string;
		icon?: Snippet;
		shortcut?: string;
		danger?: boolean;
		disabled?: boolean;
		separator?: boolean;
	}
</script>

<script lang="ts">
	// Shared menu body for DropdownMenu and ContextMenu: the fractalstyler
	// dropdown recipe (ghost buttons, .ta-l, .text-danger for destructive rows)
	// with roving focus on the arrow keys.
	interface Props {
		items: MenuEntry[];
		label?: string;
		onselect: (item: MenuEntry, index: number) => void;
		onclose: () => void;
	}

	let { items, label, onselect, onclose }: Props = $props();

	let menuEl = $state<HTMLDivElement | null>(null);

	function buttons() {
		return Array.from(menuEl?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not([disabled])') ?? []);
	}

	$effect(() => {
		buttons()[0]?.focus();
	});

	function onkeydown(e: KeyboardEvent) {
		const list = buttons();
		const i = list.indexOf(document.activeElement as HTMLButtonElement);
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			const step = e.key === 'ArrowDown' ? 1 : -1;
			list[(i + step + list.length) % list.length]?.focus();
		} else if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			list[e.key === 'Home' ? 0 : list.length - 1]?.focus();
		} else if (e.key === 'Escape' || e.key === 'Tab') {
			onclose();
		}
	}
</script>

<div
	bind:this={menuEl}
	role="menu"
	tabindex="-1"
	aria-label={label}
	class="box gap-xs pad-xs bg-surface border shadow-md radius-md"
	{onkeydown}
>
	{#each items as item, index (item.id ?? index)}
		{#if item.separator}
			<div role="separator" class="bb-sub my-xs"></div>
		{:else}
			<button
				type="button"
				role="menuitem"
				data-variant="ghost"
				data-size="lg"
				data-shape="modern"
				class="row xbetween gap-md wfull ta-l px-sm"
				disabled={item.disabled}
				onclick={() => onselect(item, index)}
			>
				<!-- Destructive ink on the label: on the button, button[data-variant] wins. -->
				<span class="row ycenter gap-sm min0 {item.danger ? 'text-danger' : ''}">
					{@render item.icon?.()}
					<span class="truncate">{item.label}</span>
				</span>
				{#if item.shortcut}<kbd class="chip mono text-muted bg-sunken shrink-0">{item.shortcut}</kbd>{/if}
			</button>
		{/if}
	{/each}
</div>
