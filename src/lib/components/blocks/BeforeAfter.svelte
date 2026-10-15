<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		position?: number; // 0 to 100 percentage
		beforeLabel?: string;
		afterLabel?: string;
		class?: string;
		before?: Snippet;
		after?: Snippet;
	}

	let {
		position = $bindable(50),
		beforeLabel = 'Before',
		afterLabel = 'After',
		class: className = '',
		before,
		after,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let isDragging = $state(false);

	function updatePosition(clientX: number) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		const p = ((clientX - rect.left) / rect.width) * 100;
		position = Math.min(100, Math.max(0, p));
	}

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		updatePosition(e.clientX);
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		updatePosition(e.clientX);
	}

	function handlePointerUp() {
		isDragging = false;
	}
</script>

<div
	bind:this={containerEl}
	class="f-before-after {className}"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	role="slider"
	aria-valuenow={Math.round(position)}
	aria-valuemin="0"
	aria-valuemax="100"
	tabindex="0"
	{...restProps}
>
	<!-- After container (full background) -->
	<div class="f-ba-pane f-ba-after">
		{#if after}
			{@render after()}
		{/if}
		{#if afterLabel}
			<span class="f-ba-label f-ba-label-after">{afterLabel}</span>
		{/if}
	</div>

	<!-- Before container (clipped by position) -->
	<div class="f-ba-pane f-ba-before" style="clip-path: inset(0 {100 - position}% 0 0);">
		{#if before}
			{@render before()}
		{/if}
		{#if beforeLabel}
			<span class="f-ba-label f-ba-label-before">{beforeLabel}</span>
		{/if}
	</div>

	<!-- Slider divider line and thumb -->
	<div class="f-ba-handle" style="left: {position}%;">
		<div class="f-ba-line"></div>
		<div class="f-ba-thumb">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(12, 0)"/></svg>
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-before-after {
			position: relative;
			overflow: hidden;
			width: 100%;
			height: 300px;
			border-radius: var(--f-radius-lg);
			border: 1px solid var(--f-border);
			cursor: ew-resize;
			user-select: none;
			touch-action: none;
		}

		.f-ba-pane {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}

		.f-ba-after {
			background: var(--f-surface);
		}

		.f-ba-before {
			background: var(--f-sunken);
		}

		.f-ba-label {
			position: absolute;
			top: 12px;
			padding: 3px 8px;
			font-size: var(--f-text-xs);
			font-weight: 600;
			border-radius: var(--f-radius-sm);
			background: rgba(0, 0, 0, 0.6);
			color: #ffffff;
			pointer-events: none;
		}

		.f-ba-label-before {
			left: 12px;
		}

		.f-ba-label-after {
			right: 12px;
		}

		.f-ba-handle {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 2px;
			pointer-events: none;
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.f-ba-line {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 2px;
			background: var(--f-primary);
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
		}

		.f-ba-thumb {
			position: relative;
			z-index: 2;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: var(--f-surface);
			border: 2px solid var(--f-primary);
			color: var(--f-primary);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: var(--f-shadow-md);
		}
	}
</style>
