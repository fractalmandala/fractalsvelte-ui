<!-- @component Full-viewport modal media viewer with keyboard navigation, zoom, counter, and thumbnail strip. -->

<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import {
		luChevronLeft,
		luChevronRight,
		luX,
		luZoomIn,
		luZoomOut
	} from '@fractaldesign/icons/lucide';
	import { IconButton } from '../../actions/icon-button/index.js';
	import { dialogSync } from '../../../internal/helpers.js';
	import { vars } from '../../../motion/index.js';
	import type { LightboxItem } from './lightbox.js';

	interface Props extends Omit<HTMLDialogAttributes, 'open' | 'children'> {
		/** Media items rendered in the viewer. */
		items: LightboxItem[];
		/** Whether the lightbox modal is open; bindable. */
		open?: boolean;
		/** Called when open state changes (backdrop click, Escape, close button). */
		onOpenChange?: (open: boolean) => void;
		/** Currently displayed zero-based slide index; bindable. */
		index?: number;
		/** Called when the active slide changes. */
		onIndexChange?: (index: number) => void;
		/** Wrap navigation from last slide back to first and vice versa. */
		loop?: boolean;
		/** Show clickable thumbnail preview row beneath the main slide. */
		showThumbnails?: boolean;
		/** Show `current / total` counter in the top bar. */
		showCounter?: boolean;
	}

	let {
		items,
		open = $bindable(false),
		onOpenChange,
		index = $bindable(0),
		onIndexChange,
		loop = true,
		showThumbnails = true,
		showCounter = true,
		class: className,
		...rest
	}: Props = $props();

	let zoom = $state(1);

	const total = $derived(items.length);
	const safeIndex = $derived(total === 0 ? 0 : Math.min(Math.max(0, index), total - 1));
	const currentItem = $derived(items[safeIndex]);
	const hasPrev = $derived(total > 1 && (loop || safeIndex > 0));
	const hasNext = $derived(total > 1 && (loop || safeIndex < total - 1));

	function setOpen(next: boolean) {
		open = next;
		if (!next) zoom = 1;
		onOpenChange?.(next);
	}

	function go(nextIdx: number) {
		if (total === 0) return;
		const resolved = loop ? (nextIdx + total) % total : Math.min(total - 1, Math.max(0, nextIdx));
		if (resolved === safeIndex) return;
		index = resolved;
		zoom = 1;
		onIndexChange?.(resolved);
	}

	function toggleZoom() {
		zoom = zoom > 1 ? 1 : 2;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'ArrowLeft' && hasPrev) {
			event.preventDefault();
			go(safeIndex - 1);
		} else if (event.key === 'ArrowRight' && hasNext) {
			event.preventDefault();
			go(safeIndex + 1);
		} else if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			zoom = Math.min(3, Math.round((zoom + 0.5) * 10) / 10);
		} else if (event.key === '-') {
			event.preventDefault();
			zoom = Math.max(1, Math.round((zoom - 0.5) * 10) / 10);
		}
	}
</script>

<dialog
	aria-label={currentItem?.alt ?? 'Media lightbox'}
	class={['dialog lightbox-stage column xbetween pad-lg', className]}
	{@attach dialogSync(() => open, setOpen, { modal: true, dismissible: true })}
	onkeydown={onKeyDown}
	{...rest}
>
	<div class="row ycenter xbetween wfull">
		<div class="row ycenter gap-sm">
			{#if showCounter && total > 0}
				<span class="text-sm weight-500 tabular-nums bg-overlay border modern px-sm py-xs">
					{safeIndex + 1} / {total}
				</span>
			{/if}
		</div>
		<div class="row ycenter gap-xs">
			<IconButton
				variant="secondary"
				size="h-md"
				icon={zoom > 1 ? luZoomOut : luZoomIn}
				label={zoom > 1 ? 'Reset zoom' : 'Zoom in'}
				onclick={toggleZoom}
			/>
			<IconButton
				variant="secondary"
				size="h-md"
				icon={luX}
				label="Close lightbox"
				onclick={() => setOpen(false)}
			/>
		</div>
	</div>

	<div class="row ycenter xbetween gap-md grow min0 wfull">
		<IconButton
			variant="secondary"
			size="h-lg"
			icon={luChevronLeft}
			label="Previous image"
			disabled={!hasPrev}
			onclick={() => go(safeIndex - 1)}
		/>

		<div class="column xcenter ycenter gap-sm grow min0 overflow-hidden">
			{#if currentItem}
				<img
					src={currentItem.src}
					alt={currentItem.alt ?? ''}
					class="lightbox-media curved"
					{@attach vars({ zoom })}
					ondblclick={toggleZoom}
				/>
				{#if currentItem.caption}
					<p class="text-sm bg-overlay border modern px-md py-xs">{currentItem.caption}</p>
				{/if}
			{/if}
		</div>

		<IconButton
			variant="secondary"
			size="h-lg"
			icon={luChevronRight}
			label="Next image"
			disabled={!hasNext}
			onclick={() => go(safeIndex + 1)}
		/>
	</div>

	{#if showThumbnails && total > 1}
		<div class="row xcenter ycenter gap-xs wrap">
			{#each items as item, i (`${item.src}-${i}`)}
				<button
					type="button"
					class={[
						'bare h-xl square modern overflow-hidden pointer focus-ring',
						i === safeIndex ? 'border-strong' : 'border-subtle'
					]}
					aria-label={`View slide ${i + 1}`}
					aria-current={i === safeIndex ? 'true' : undefined}
					onclick={() => go(i)}
				>
					<img src={item.thumbnail ?? item.src} alt="" class="full fit-cover" />
				</button>
			{/each}
		</div>
	{/if}
</dialog>
