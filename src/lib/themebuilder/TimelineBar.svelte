<script lang="ts">
	import { studioState, type CanvasPin } from './studio.svelte.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let trackEl: HTMLDivElement | null = $state(null);
	let drag: {
		index: number;
		startX: number;
		startRadius: number;
		total: number;
		width: number;
	} | null = $state(null);

	const totalRadius = $derived(
		studioState.recipe.pins.reduce((sum, p) => sum + p.radius, 0) || 1
	);

	// Right edge of every band, as % of the track. Each handle owns the band
	// to its left, so every colour (including the last) gets its own handle.
	const handleOffsets = $derived.by(() => {
		const pins = studioState.recipe.pins;
		const total = pins.reduce((sum, p) => sum + p.radius, 0) || 1;
		let acc = 0;
		const offsets: number[] = [];
		for (let i = 0; i < pins.length; i++) {
			acc += pins[i].radius;
			offsets.push((acc / total) * 100);
		}
		return offsets;
	});

	function selectPin(pin: CanvasPin) {
		// Don't hijack selection when a border drag just finished
		if (drag) return;
		studioState.activePinId = pin.id;
	}

	function clampRadius(v: number) {
		return Math.max(10, Math.min(100, Math.round(v)));
	}

	function startEdgeDrag(e: PointerEvent, index: number) {
		e.stopPropagation();
		e.preventDefault();
		if (!trackEl) return;
		const pins = studioState.recipe.pins;
		const pin = pins[index];
		if (!pin) return;
		(e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
		drag = {
			index,
			startX: e.clientX,
			startRadius: pin.radius,
			total: totalRadius,
			width: trackEl.clientWidth || 1
		};
		studioState.activePinId = pin.id;
	}

	function moveEdgeDrag(e: PointerEvent) {
		if (!drag || !trackEl) return;
		const pins = studioState.recipe.pins;
		const pin = pins[drag.index];
		if (!pin) return;
		const width = drag.width || trackEl.clientWidth || 1;
		// Independent: only this pin's radius changes, neighbours untouched.
		// Same absolute radius (10-100) the canvas rings edit.
		const delta = ((e.clientX - drag.startX) / width) * drag.total;
		studioState.updatePin(pin.id, { radius: clampRadius(drag.startRadius + delta) });
	}

	function endEdgeDrag() {
		drag = null;
	}

	function onHandleKeydown(e: KeyboardEvent, index: number) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		e.preventDefault();
		const pins = studioState.recipe.pins;
		const pin = pins[index];
		if (!pin) return;
		const step = e.shiftKey ? 5 : 2;
		const delta = e.key === 'ArrowRight' ? step : -step;
		studioState.updatePin(pin.id, { radius: clampRadius(pin.radius + delta) });
		studioState.activePinId = pin.id;
	}
</script>

<div class="timeline-bar-container {className}">
	<div class="timeline-hint">
		Drag a band edge to resize that colour · the rings on the canvas place it
	</div>

	<div
		class="timeline-track"
		class:dragging={drag !== null}
		bind:this={trackEl}
	>
		{#each studioState.recipe.pins as pin (pin.id)}
			<button
				type="button"
				class="timeline-segment"
				class:active={studioState.activePinId === pin.id}
				style="flex: {pin.radius}; background-color: {pin.color};"
				onclick={() => selectPin(pin)}
				title="Select {pin.color} (Radius: {pin.radius}%)"
				aria-label="Select color {pin.color}"
			>
				<span class="timeline-segment-dot" style="background-color: {pin.color};"></span>
			</button>
		{/each}
		{#each handleOffsets as offset, i (studioState.recipe.pins[i]?.id ?? i)}
			<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
			<div
				class="timeline-divider"
				class:last={i === studioState.recipe.pins.length - 1}
				class:active={drag?.index === i}
				style={i === studioState.recipe.pins.length - 1 ? 'right: 0px;' : `left: ${offset}%;`}
				role="slider"
				aria-orientation="horizontal"
				aria-label="Resize {studioState.recipe.pins[i]?.color} spread"
				aria-valuemin={10}
				aria-valuemax={100}
				aria-valuenow={studioState.recipe.pins[i]?.radius}
				tabindex="0"
				title="Drag to resize {studioState.recipe.pins[i]?.color}"
				onpointerdown={(e) => startEdgeDrag(e, i)}
				onpointermove={moveEdgeDrag}
				onpointerup={endEdgeDrag}
				onpointercancel={endEdgeDrag}
				onkeydown={(e) => onHandleKeydown(e, i)}
			>
				<span class="timeline-divider-grip"></span>
			</div>
		{/each}
	</div>
</div>

<style lang="sass">
.timeline-bar-container
	display: flex
	flex-direction: column
	gap: 6px
	width: 100%
	background: rgba(0, 0, 0, 0.4)
	backdrop-filter: blur(10px)
	-webkit-backdrop-filter: blur(10px)
	padding: 8px 14px
	border-radius: 8px
	border: 1px solid rgba(255, 255, 255, 0.15)

.timeline-hint
	font-size: 11px
	color: rgba(255, 255, 255, 0.75)
	text-align: left

.timeline-track
	display: flex
	position: relative
	height: 18px
	border-radius: 9999px
	overflow: hidden
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.1)
	border: 1px solid rgba(255, 255, 255, 0.2)
	cursor: pointer

	&.dragging
		cursor: ew-resize

		.timeline-segment
			transition: none

.timeline-segment
	display: flex
	align-items: center
	justify-content: center
	min-width: 0
	transition: flex 0.15s ease, opacity 0.15s ease
	position: relative

	&:hover
		opacity: 0.9

	&.active
		box-shadow: inset 0 0 0 2px #FFFFFF

.timeline-segment-dot
	width: 6px
	height: 6px
	border-radius: 9999px
	border: 1px solid rgba(255, 255, 255, 0.8)
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4)
	pointer-events: none

.timeline-divider
	position: absolute
	top: 0
	bottom: 0
	width: 16px
	margin-left: -8px
	display: flex
	align-items: center
	justify-content: center
	cursor: ew-resize
	touch-action: none
	z-index: 2
	outline: none

	&.last
		margin-left: 0
		width: 14px

	&:hover .timeline-divider-grip,
	&:focus-visible .timeline-divider-grip
		background: rgba(255, 255, 255, 0.95)
		border-color: rgba(0, 0, 0, 0.25)
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45)
		transform: scaleX(1.15)

	&.active .timeline-divider-grip
		background: #FFFFFF
		border-color: rgba(0, 0, 0, 0.3)
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5)
		transform: scaleX(1.25)

	&:focus-visible .timeline-divider-grip
		outline: 2px solid #FFFFFF
		outline-offset: 1px

.timeline-divider-grip
	width: 4px
	height: 70%
	border-radius: 9999px
	background: rgba(255, 255, 255, 0)
	border: 1px solid transparent
	transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease
	pointer-events: none
</style>
