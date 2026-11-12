<!-- @component A drag-to-reorder list whose siblings make room with FLIP springs. -->

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, createFlip, setMotion } from '../../../motion/index.js';

	interface HandleProps {
		/** Starts a pointer drag on this item. */
		onpointerdown: (event: PointerEvent) => void;
		/** Classes for a drag handle. */
		class: string;
	}

	interface ItemExtras {
		/** Whether this item is currently lifted by the pointer or the keyboard. */
		dragging: boolean;
		/** Spread these onto a handle (or the row) to start a pointer drag. */
		handleProps: HandleProps;
	}

	interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
		/** The items, in visual order. Two-way bindable. */
		items: T[];
		/** Returns a stable id for an item, used as the FLIP key. */
		key: (item: T) => string;
		/** The axis items can be dragged along. */
		axis?: 'x' | 'y';
		/** The content of one item, called with the item and its drag state. */
		children?: Snippet<[T, ItemExtras]>;
		/** Called after a drop or a cancelled keyboard lift, with the next order. */
		onReorder?: (items: T[]) => void;
	}

	let {
		items = $bindable(),
		key: keyOf,
		axis = 'y',
		children,
		onReorder,
		class: klass,
		...rest
	}: Props = $props();

	const flip = createFlip({
		spring: 'snappy',
		selector: '[data-flip-id]:not([data-dragging])'
	});

	const descId = $props.id();

	let listEl = $state<HTMLElement | null>(null);
	let draggingId = $state<string | null>(null);
	let focusedIndex = $state(0);
	let lifted = $state(false);
	let live = $state('');
	let origin: T[] | null = null;

	let pointerId: number | null = null;
	let originPointerX = 0;
	let originPointerY = 0;
	let originMx = 0;
	let originMy = 0;
	let grabOffsetX = 0;
	let grabOffsetY = 0;

	function indexOfId(id: string): number {
		return items.findIndex((item) => keyOf(item) === id);
	}

	function itemEl(id: string): HTMLElement | null {
		if (!listEl) return null;
		const el = listEl.querySelector(`[data-flip-id="${CSS.escape(id)}"]`);
		return el instanceof HTMLElement ? el : null;
	}

	function announce(message: string): void {
		live = message;
	}

	function labelOf(item: T, index: number): string {
		const el = itemEl(keyOf(item));
		const text = el?.textContent?.replace(/\s+/g, ' ').trim();
		return text || `Item ${index + 1}`;
	}

	function liftVisual(el: HTMLElement, on: boolean): void {
		if (on) animate(el, { scale: 1.04 }, { spring: 'snappy' });
		else animate(el, { x: 0, y: 0, scale: 1 }, { spring: 'snappy' });
	}

	async function moveItem(from: number, to: number): Promise<void> {
		if (from === to || from < 0 || to < 0 || to >= items.length) return;
		await flip.run(() => {
			const next = items.slice();
			const [item] = next.splice(from, 1);
			if (item === undefined) return;
			next.splice(to, 0, item);
			items = next;
		});
	}

	function rebaseToPointer(el: HTMLElement, clientX: number, clientY: number): void {
		const r = el.getBoundingClientRect();
		const restLeft = r.left - (Number.parseFloat(el.style.getPropertyValue('--mx')) || 0);
		const restTop = r.top - (Number.parseFloat(el.style.getPropertyValue('--my')) || 0);
		const x = axis === 'y' ? 0 : clientX - grabOffsetX - restLeft;
		const y = axis === 'x' ? 0 : clientY - grabOffsetY - restTop;
		setMotion(el, { x, y, scale: 1.04 });
		originPointerX = clientX;
		originPointerY = clientY;
		originMx = x;
		originMy = y;
	}

	function followPointer(el: HTMLElement, clientX: number, clientY: number): void {
		const x = axis === 'y' ? 0 : originMx + (clientX - originPointerX);
		const y = axis === 'x' ? 0 : originMy + (clientY - originPointerY);
		setMotion(el, { x, y, scale: 1.04 });
	}

	function indexFromPointer(clientX: number, clientY: number): number {
		if (!listEl) return 0;
		const els = Array.from(listEl.querySelectorAll('[data-flip-id]'));
		let idx = 0;
		for (let i = 0; i < els.length; i++) {
			const r = els[i]!.getBoundingClientRect();
			const mid = axis === 'x' ? r.left + r.width / 2 : r.top + r.height / 2;
			const p = axis === 'x' ? clientX : clientY;
			if (p >= mid) idx = i;
		}
		return idx;
	}

	function startPointer(item: T, e: PointerEvent): void {
		if (pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
		const id = keyOf(item);
		const el = itemEl(id);
		if (!el) return;
		pointerId = e.pointerId;
		el.setPointerCapture(e.pointerId);
		draggingId = id;
		lifted = false;
		origin = items.slice();
		const r = el.getBoundingClientRect();
		originPointerX = e.clientX;
		originPointerY = e.clientY;
		originMx = 0;
		originMy = 0;
		grabOffsetX = e.clientX - r.left;
		grabOffsetY = e.clientY - r.top;
		setMotion(el, { x: 0, y: 0, scale: 1.04 });
		const index = indexOfId(id);
		focusedIndex = index;
		announce(`Grabbed ${labelOf(item, index)}. Current position ${index + 1} of ${items.length}.`);
		e.preventDefault();
		e.stopPropagation();
	}

	async function onPointerMove(e: PointerEvent): Promise<void> {
		if (e.pointerId !== pointerId || !draggingId) return;
		const el = itemEl(draggingId);
		if (!el) return;
		followPointer(el, e.clientX, e.clientY);
		const from = indexOfId(draggingId);
		const to = indexFromPointer(e.clientX, e.clientY);
		if (from === to) return;
		await moveItem(from, to);
		const moved = itemEl(draggingId);
		if (moved) rebaseToPointer(moved, e.clientX, e.clientY);
		focusedIndex = indexOfId(draggingId);
	}

	function dropPointer(e: PointerEvent): void {
		if (e.pointerId !== pointerId || !draggingId) return;
		const id = draggingId;
		const el = itemEl(id);
		if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
		pointerId = null;
		if (el) liftVisual(el, false);
		const index = indexOfId(id);
		draggingId = null;
		origin = null;
		onReorder?.(items);
		announce(`Dropped ${labelOf(items[index]!, index)} at position ${index + 1} of ${items.length}.`);
	}

	function startKeyboardLift(index: number): void {
		const item = items[index];
		if (!item) return;
		const id = keyOf(item);
		const el = itemEl(id);
		draggingId = id;
		lifted = true;
		origin = items.slice();
		if (el) liftVisual(el, true);
		announce(`Grabbed ${labelOf(item, index)}. Current position ${index + 1} of ${items.length}. Use the arrow keys to move, Space to drop, Escape to cancel.`);
	}

	async function dropKeyboard(): Promise<void> {
		if (!draggingId) return;
		const el = itemEl(draggingId);
		const index = indexOfId(draggingId);
		const item = items[index];
		if (el) liftVisual(el, false);
		draggingId = null;
		lifted = false;
		origin = null;
		onReorder?.(items);
		if (item) announce(`Dropped ${labelOf(item, index)} at position ${index + 1} of ${items.length}.`);
	}

	async function cancelLift(): Promise<void> {
		if (!draggingId || !origin) return;
		const el = itemEl(draggingId);
		const index = indexOfId(draggingId);
		const item = items[index];
		await flip.run(() => {
			items = origin!.slice();
		});
		if (el) liftVisual(el, false);
		draggingId = null;
		lifted = false;
		origin = null;
		onReorder?.(items);
		if (item) announce(`Cancelled reordering ${labelOf(item, index)}.`);
	}

	async function onItemKey(e: KeyboardEvent, index: number): Promise<void> {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			if (lifted) await dropKeyboard();
			else startKeyboardLift(index);
			return;
		}
		if (e.key === 'Escape' && lifted) {
			e.preventDefault();
			await cancelLift();
			return;
		}
		const delta =
			(axis === 'x' && e.key === 'ArrowRight') || (axis === 'y' && e.key === 'ArrowDown')
				? 1
				: (axis === 'x' && e.key === 'ArrowLeft') || (axis === 'y' && e.key === 'ArrowUp')
					? -1
					: 0;
		if (delta === 0) return;
		e.preventDefault();
		if (lifted && draggingId) {
			const from = indexOfId(draggingId);
			const to = from + delta;
			await moveItem(from, to);
			focusedIndex = indexOfId(draggingId);
			const item = items[focusedIndex];
			if (item) announce(`Moved ${labelOf(item, focusedIndex)} to position ${focusedIndex + 1} of ${items.length}.`);
			queueMicrotask(() => itemEl(draggingId!)?.focus());
			return;
		}
		const next = Math.min(items.length - 1, Math.max(0, index + delta));
		focusedIndex = next;
		const id = keyOf(items[next]!);
		queueMicrotask(() => itemEl(id)?.focus());
	}

	function handlePropsFor(item: T): HandleProps {
		return {
			onpointerdown: (event) => startPointer(item, event),
			class: 'touch-none grab pointer-auto'
		};
	}

	$effect(() => {
		if (focusedIndex >= items.length) focusedIndex = Math.max(0, items.length - 1);
	});
</script>

<svelte:window
	onpointermove={onPointerMove}
	onpointerup={dropPointer}
	onpointercancel={dropPointer}
/>

<ul
	bind:this={listEl}
	class={['gap-sm', axis === 'x' ? 'row' : 'box', klass]}
	role="listbox"
	aria-orientation={axis === 'x' ? 'horizontal' : 'vertical'}
	aria-roledescription="sortable list"
	aria-describedby={descId}
	{@attach flip.attach}
	{...rest}
>
	<span id={descId} class="sr-only">
		Press Space to lift an item, arrow keys to move it, Space to drop, and Escape to cancel.
	</span>
	<span class="sr-only" aria-live="assertive" aria-atomic="true">{live}</span>
	{#each items as item, index (keyOf(item))}
		{@const id = keyOf(item)}
		{@const dragging = draggingId === id}
		<li
			class={['motion', 'select-none', dragging && 'z-raised', dragging && 'shad-lg', dragging && 'grabbing']}
			data-flip-id={id}
			data-dragging={dragging ? '' : undefined}
			role="option"
			aria-roledescription="sortable item"
			aria-grabbed={dragging}
			aria-selected={focusedIndex === index}
			tabindex={focusedIndex === index ? 0 : -1}
			onkeydown={(e) => onItemKey(e, index)}
			onfocus={() => (focusedIndex = index)}
		>
			{@render children?.(item, { dragging, handleProps: handlePropsFor(item) })}
		</li>
	{/each}
</ul>
