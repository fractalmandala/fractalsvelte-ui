<!-- @component A macOS-style dock of icons that magnify near the pointer. -->

<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface DockItemData {
		id: string;
		label: string;
		icon?: Snippet;
		onclick?: () => void;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: DockItemData[];
		/** Pointer distance (px) over which neighbours magnify */
		distance?: number;
		class?: string;
		itemSnippet?: Snippet<[{ item: DockItemData; size: Size; isHovered: boolean }]>;
	}

	let { items = [], distance = 120, class: className = '', itemSnippet, ...restProps }: Props = $props();

	let mouseX = $state<number | null>(null);
	let hoveredId = $state<string | null>(null);
	let els: Record<string, HTMLElement | null> = $state({});

	// Magnification steps along fractalstyler's control-height ladder instead of
	// a continuous scale: md at rest, bs nearby, lg under the pointer. The swap
	// is a data-size change; the button squares itself with .frame-1-1.
	function sizeFor(id: string): Size {
		const el = els[id];
		if (mouseX === null || !el) return 'h-md';
		const r = el.getBoundingClientRect();
		const d = Math.abs(mouseX - (r.left + r.width / 2));
		if (d < distance * 0.3) return 'h-lg';
		if (d < distance) return 'h-bs';
		return 'h-md';
	}
</script>

<div
	class="row ybot gap-xs pad-xs bg-raised border shadow-lg radius-md {className}"
	role="toolbar"
	aria-label="Application dock"
	onpointermove={(e) => (mouseX = e.clientX)}
	onpointerleave={() => {
		mouseX = null;
		hoveredId = null;
	}}
	{...restProps}
>
	{#each items as item (item.id)}
		{@const size = sizeFor(item.id)}
		{@const isHovered = hoveredId === item.id}
		<button
			bind:this={els[item.id]}
			type="button"
			class="frame-1-1 px-xs el-variant el-size el-shape curved {isHovered ? 'secondary' : 'ghost'} {size}"
			aria-label={item.label}
			title={item.label}
			onpointerenter={() => (hoveredId = item.id)}
			onfocus={() => (hoveredId = item.id)}
			onblur={() => (hoveredId = null)}
			onclick={() => item.onclick?.()}
		>
			{#if itemSnippet}
				{@render itemSnippet({ item, size, isHovered })}
			{:else if item.icon}
				{@render item.icon()}
			{:else}
				<span class="weight-600">{item.label.slice(0, 1)}</span>
			{/if}
		</button>
	{/each}
</div>
