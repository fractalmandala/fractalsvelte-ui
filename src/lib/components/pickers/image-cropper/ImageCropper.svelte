<!-- @component Interactive image crop rectangle selector with rule-of-thirds grid, zoom, and aspect ratio lock. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { clampValue } from './crop.js';

	export interface CropRect {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se' | null;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Image source URL to crop. */
		src: string;
		/** Alternative text description for the image. */
		alt?: string;
		/** Crop selection rectangle in percentages (`0` to `100`); bindable. */
		crop?: CropRect;
		/** Called when the user drags or resizes the selection rectangle. */
		onCropChange?: (crop: CropRect) => void;
		/** Optional fixed width-to-height ratio (for example `1` or `16 / 9`). */
		aspectRatio?: number;
		/** Image preview magnification (`1` = 100%); bindable. */
		zoom?: number;
		/** Render rule-of-thirds helper lines inside the selection frame. */
		grid?: boolean;
		/** Selection cutout corner shape (`'rect'` or circular `'round'`). */
		shape?: 'rect' | 'round';
		/** Disable dragging and resizing. */
		disabled?: boolean;
	}

	let {
		src,
		alt = 'Image to crop',
		crop = $bindable({ x: 10, y: 10, width: 80, height: 80 }),
		onCropChange,
		aspectRatio,
		zoom = $bindable(1),
		grid = true,
		shape = 'rect',
		disabled = false,
		class: className,
		...rest
	}: Props = $props();

	let stage = $state<HTMLDivElement | null>(null);
	let mode = $state<DragMode>(null);
	let startPoint = { x: 0, y: 0 };
	let startRect: CropRect = { x: 10, y: 10, width: 80, height: 80 };

	function commit(next: CropRect) {
		crop = {
			x: Math.round(next.x * 10) / 10,
			y: Math.round(next.y * 10) / 10,
			width: Math.round(next.width * 10) / 10,
			height: Math.round(next.height * 10) / 10
		};
		onCropChange?.(crop);
	}

	function beginDrag(nextMode: Exclude<DragMode, null>, event: PointerEvent) {
		if (disabled || !stage || event.button > 0) return;
		event.stopPropagation();
		stage.setPointerCapture(event.pointerId);
		mode = nextMode;
		startPoint = { x: event.clientX, y: event.clientY };
		startRect = { ...crop };
	}

	function onPointerMove(event: PointerEvent) {
		if (!mode || !stage || disabled) return;
		const bounds = stage.getBoundingClientRect();
		if (bounds.width <= 0 || bounds.height <= 0) return;

		const dxPct = ((event.clientX - startPoint.x) / bounds.width) * 100;
		const dyPct = ((event.clientY - startPoint.y) / bounds.height) * 100;
		const minSize = 10;

		if (mode === 'move') {
			const nx = clampValue(startRect.x + dxPct, 0, 100 - startRect.width);
			const ny = clampValue(startRect.y + dyPct, 0, 100 - startRect.height);
			commit({ ...startRect, x: nx, y: ny });
			return;
		}

		let { x, y, width, height } = startRect;
		if (mode.includes('e')) width = clampValue(startRect.width + dxPct, minSize, 100 - x);
		if (mode.includes('s')) height = clampValue(startRect.height + dyPct, minSize, 100 - y);
		if (mode.includes('w')) {
			const nextX = clampValue(startRect.x + dxPct, 0, startRect.x + startRect.width - minSize);
			width = startRect.width + (startRect.x - nextX);
			x = nextX;
		}
		if (mode.includes('n')) {
			const nextY = clampValue(startRect.y + dyPct, 0, startRect.y + startRect.height - minSize);
			height = startRect.height + (startRect.y - nextY);
			y = nextY;
		}

		if (aspectRatio && aspectRatio > 0) {
			const stageRatio = bounds.width / bounds.height;
			const targetPctHeight = clampValue((width * stageRatio) / aspectRatio, minSize, 100 - y);
			height = targetPctHeight;
			width = clampValue((height * aspectRatio) / stageRatio, minSize, 100 - x);
		}

		commit({ x, y, width, height });
	}

	function endDrag(event: PointerEvent) {
		if (!mode) return;
		mode = null;
		if (stage?.hasPointerCapture(event.pointerId)) {
			stage.releasePointerCapture(event.pointerId);
		}
	}

	function nudge(event: KeyboardEvent) {
		if (disabled) return;
		const delta = event.shiftKey ? 5 : 1;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			commit({ ...crop, x: clampValue(crop.x - delta, 0, 100 - crop.width) });
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			commit({ ...crop, x: clampValue(crop.x + delta, 0, 100 - crop.width) });
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			commit({ ...crop, y: clampValue(crop.y - delta, 0, 100 - crop.height) });
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			commit({ ...crop, y: clampValue(crop.y + delta, 0, 100 - crop.height) });
		}
	}
</script>

<div
	bind:this={stage}
	class={['crop-stage frame-16-9 modern border overflow-hidden', disabled && 'disabled', className]}
	{@attach vars({
		'crop-x': crop.x,
		'crop-y': crop.y,
		'crop-w': crop.width,
		'crop-h': crop.height,
		zoom
	})}
	onpointermove={onPointerMove}
	onpointerup={endDrag}
	onpointercancel={endDrag}
	{...rest}
>
	<img {src} {alt} class="crop-img" draggable="false" />

	<div
		role="slider"
		aria-label="Crop selection"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(crop.x)}
		aria-valuetext={`${crop.x}% X, ${crop.y}% Y, ${crop.width}% width, ${crop.height}% height`}
		tabindex={disabled ? -1 : 0}
		class={['crop-box focus-ring', shape === 'round' && 'round']}
		onpointerdown={(e) => beginDrag('move', e)}
		onkeydown={nudge}
	>
		{#if grid}
			<div class="crop-grid" aria-hidden="true">
				<span></span><span></span><span></span>
				<span></span><span></span><span></span>
				<span></span><span></span><span></span>
			</div>
		{/if}
		<span class="crop-handle crop-nw" aria-hidden="true" onpointerdown={(e) => beginDrag('nw', e)}></span>
		<span class="crop-handle crop-ne" aria-hidden="true" onpointerdown={(e) => beginDrag('ne', e)}></span>
		<span class="crop-handle crop-sw" aria-hidden="true" onpointerdown={(e) => beginDrag('sw', e)}></span>
		<span class="crop-handle crop-se" aria-hidden="true" onpointerdown={(e) => beginDrag('se', e)}></span>
	</div>
</div>
