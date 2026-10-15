<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DockItemData {
		id: string;
		label: string;
		icon?: Snippet;
		onclick?: () => void;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: DockItemData[];
		baseSize?: number;
		maxSize?: number;
		distance?: number;
		class?: string;
		itemSnippet?: Snippet<[{ item: DockItemData; size: number; isHovered: boolean }]>;
	}

	let {
		items = [],
		baseSize = 44,
		maxSize = 68,
		distance = 120,
		class: className = '',
		itemSnippet,
		...restProps
	}: Props = $props();

	let dockEl: HTMLDivElement | undefined = $state();
	let mouseX = $state<number | null>(null);
	let hoveredId = $state<string | null>(null);

	function handlePointerMove(e: PointerEvent) {
		mouseX = e.clientX;
	}

	function handlePointerLeave() {
		mouseX = null;
		hoveredId = null;
	}

	function getItemScale(itemEl: HTMLElement | null): number {
		if (mouseX === null || !itemEl) return baseSize;
		const rect = itemEl.getBoundingClientRect();
		const itemCenter = rect.left + rect.width / 2;
		const d = Math.abs(mouseX - itemCenter);

		if (d >= distance) return baseSize;
		// Cosine curve for fluid natural falloff
		const norm = Math.cos((d / distance) * (Math.PI / 2));
		return baseSize + (maxSize - baseSize) * norm;
	}

	let itemElements: Record<string, HTMLElement | null> = $state({});
</script>

<div
	bind:this={dockEl}
	class="f-dock {className}"
	role="toolbar"
	aria-label="Application dock"
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
	{...restProps}
>
	{#each items as item (item.id)}
		{@const el = itemElements[item.id] ?? null}
		{@const size = getItemScale(el)}
		{@const isHovered = hoveredId === item.id}
		<div
			bind:this={itemElements[item.id]}
			class="f-dock-item-wrapper"
			style="width: {size}px; height: {size}px;"
		>
			<button
				type="button"
				class="f-dock-item"
				aria-label={item.label}
				onpointerenter={() => (hoveredId = item.id)}
				onclick={() => item.onclick?.()}
			>
				{#if itemSnippet}
					{@render itemSnippet({ item, size, isHovered })}
				{:else if item.icon}
					{@render item.icon()}
				{:else}
					<span class="f-dock-fallback-glyph">{item.label.slice(0, 1)}</span>
				{/if}
			</button>

			{#if isHovered}
				<div class="f-dock-tooltip" role="tooltip">
					{item.label}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-dock {
			position: relative;
			display: inline-flex;
			align-items: flex-end;
			gap: 8px;
			padding: 8px 12px;
			background: var(--f-surface, #18181f);
			border: 1px solid var(--f-border);
			border-radius: 9999px;
			box-shadow: var(--f-shadow-lg), 0 8px 32px rgba(0, 0, 0, 0.4);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			box-sizing: border-box;
			user-select: none;
		}

		.f-dock-item-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			transition: width 0.12s cubic-bezier(0.2, 0.9, 0.3, 1),
				height 0.12s cubic-bezier(0.2, 0.9, 0.3, 1);
		}

		.f-dock-item {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background: var(--f-sunken, #22222a);
			border: 1px solid var(--f-border);
			color: var(--f-text);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			padding: 0;
			box-shadow: var(--f-shadow-sm);
			transition: transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-dock-item:hover {
			background: var(--f-hover);
			transform: translateY(-2px);
		}

		.f-dock-item:active {
			transform: translateY(1px) scale(0.95);
		}

		.f-dock-item:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-dock-fallback-glyph {
			font-weight: 700;
			font-size: var(--f-text-sm);
		}

		.f-dock-tooltip {
			position: absolute;
			top: -34px;
			left: 50%;
			transform: translateX(-50%);
			padding: 3px 8px;
			background: var(--f-surface-raised, #282834);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-sm);
			color: var(--f-text);
			font-size: var(--f-text-xs);
			font-weight: 500;
			white-space: nowrap;
			box-shadow: var(--f-shadow-md);
			pointer-events: none;
			animation: f-dock-pop 0.15s cubic-bezier(0.16, 1, 0.3, 1);
			z-index: var(--f-z-popover, 1100);
		}

		@keyframes f-dock-pop {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(4px);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
		}
	}
</style>
