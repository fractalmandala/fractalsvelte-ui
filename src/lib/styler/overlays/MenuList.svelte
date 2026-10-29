<script lang="ts" module>
	import type { IconData } from '@fractaldesign/icons';

	export interface MenuEntry {
		id?: string;
		label?: string;
		icon?: IconData;
		shortcut?: string;
		danger?: boolean;
		disabled?: boolean;
		separator?: boolean;
	}
</script>

<script lang="ts">
	// Shared menu body for DropdownMenu and ContextMenu: ghost rows, .text-danger
	// for destructive rows, roving focus on the arrow keys.
	import { Icon } from '@fractaldesign/icons';
	import Kbd from '../display/Kbd.svelte';
	import type { Size, Surface, Border, Shadow, Shape } from '../types';
	interface Props {
		items: MenuEntry[];
		label?: string;
		onselect: (item: MenuEntry, index: number) => void;
		onclose: () => void;
		/** Row height */
		size?: Size;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
	}

	let {
		items,
		label,
		onselect,
		onclose,
		size = 'h-md',
		surface = 'bg-surface',
		border = 'border',
		shadow = 'shad-lg',
		shape = 'modern'
	}: Props = $props();

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
	class="box gap-xs pad-xs el-shape {surface} {border} {shadow} {shape}"
	{onkeydown}
>
	{#each items as item, index (item.id ?? index)}
		{#if item.separator}
			<div role="separator" class="bb-sub my-xs"></div>
		{:else}
			<button
				type="button"
				role="menuitem"
				class="row xbetween gap-md wfull ta-l px-sm el-variant el-size el-shape ghost {size} {shape}"
				disabled={item.disabled}
				onclick={() => onselect(item, index)}
			>
				<span class="row ycenter gap-sm min0 {item.danger ? 'text-danger' : ''}">
					{#if item.icon}<Icon icon={item.icon} />{/if}
					<span class="truncate">{item.label}</span>
				</span>
				{#if item.shortcut}<Kbd static>{item.shortcut}</Kbd>{/if}
			</button>
		{/if}
	{/each}
</div>
