<script lang="ts">
	import { onMount } from 'svelte';
	import VastCanvas from '#lib/demos/VastCanvas.svelte';
	import { getDemos, type DemosByCategory } from '#lib/demos/getAllDemos.js';
	import { camera } from '#lib/utils/camera.svelte';

	let demoGroups = $state<DemosByCategory>({});
	let isDragging = $state(false);
	let viewport: HTMLDivElement;
	let last = { x: 0, y: 0 };
	let dragId: number | null = null;

	// Drag starts anywhere except on a control inside a demo, so buttons/inputs still work.
	// Middle button or Alt+drag pans even over controls.
	const INTERACTIVE = 'input, textarea, select, button, a[href], label, [contenteditable], [role="slider"], [role="switch"], [role="button"], [role="tab"], [role="option"], [role="combobox"], [draggable="true"]';

	onMount(() => {
		demoGroups = getDemos();
		// wheel must be non-passive so preventDefault stops page/browser zoom
		viewport.addEventListener('wheel', handleWheel, { passive: false });
		return () => viewport.removeEventListener('wheel', handleWheel);
	});

	function handlePointerDown(e: PointerEvent) {
		const overControl = (e.target as Element).closest(INTERACTIVE);
		const pan = e.button === 1 || (e.button === 0 && (e.altKey || !overControl));
		if (!pan) return;
		e.preventDefault();
		isDragging = true;
		dragId = e.pointerId;
		last = { x: e.clientX, y: e.clientY };
		viewport.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || e.pointerId !== dragId) return;
		camera.pan(e.clientX - last.x, e.clientY - last.y);
		last = { x: e.clientX, y: e.clientY };
	}

	function handlePointerUp(e: PointerEvent) {
		if (e.pointerId !== dragId) return;
		isDragging = false;
		dragId = null;
		if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
	}

	// Trackpad two-finger scroll / mouse wheel pans; pinch (ctrlKey) or Cmd/Ctrl+wheel zooms at the cursor.
	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (e.ctrlKey || e.metaKey) {
			camera.zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
		} else {
			camera.pan(-e.deltaX, -e.deltaY);
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div 
	bind:this={viewport}
	class="viewport-container"
	class:dragging={isDragging}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	role="region"
	aria-label="Vast canvas viewport"
>
	<VastCanvas />

	<div 
		class="infinite-plane"
		style="transform: translate({camera.x}px, {camera.y}px) scale({camera.zoom});"
	>
		{#each Object.entries(demoGroups) as [category, items], colIndex}
			<section 
				class="category-island" 
				style="left: {colIndex * 420}px; top: 0px;"
			>
				<header class="island-title">{category.toUpperCase()}</header>

				<div class="cards-stack">
					{#each items as item}
						<div class="demo-card">
							<div class="card-label">{item.name}</div>
							<div class="card-body">
								{#await item.load()}
									<span class="loading">Loading {item.name}...</span>
								{:then { default: Comp }}
									<!-- 2. Dynamic tag direct invocation -->
									<Comp />
								{:catch}
									<span class="error">Failed to load {item.name}</span>
								{/await}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>

<style>


	.viewport-container {
		position: relative;
		width: 100vw;
		height: calc(100vh - var(--header-height));
		overflow: hidden;
		user-select: none;
		cursor: grab;
		touch-action: none;
	}

	.viewport-container.dragging {
		cursor: grabbing;
	}

	.infinite-plane {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
		z-index: 1;
		pointer-events: auto;
		will-change: transform;
	}

	.category-island {
		position: absolute;
		width: 380px;
		background: rgba(18, 24, 38, 0.7);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 1.25rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
	}

	.island-title {
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		color: #38bdf8;
		margin-bottom: 1rem;
		font-weight: 700;
	}

	.cards-stack {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.demo-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1rem;
	}

	.card-label {
		font-family: sans-serif;
		font-size: 0.75rem;
		color: #94a3b8;
		margin-bottom: 0.5rem;
	}

	.card-body {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 50px;
	}

	.loading, .error {
		font-size: 0.75rem;
		color: #64748b;
	}
	.error {
		color: #f87171;
	}
</style>
