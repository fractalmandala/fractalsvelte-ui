<!-- @component A spring-dragged element, with optional bounds, a handle, and keyboard movement. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		animate,
		drag,
		getMotion,
		type DragState,
		type SpringInput
	} from '../../../motion/index.js';

	type DragAxis = 'x' | 'y' | 'both';
	type DragBounds = 'parent' | { left?: number; right?: number; top?: number; bottom?: number } | (() => DOMRect);

	interface Point {
		x: number;
		y: number;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The axis the element can be dragged along. */
		axis?: DragAxis;
		/** Limits for the drag. `'parent'` keeps the element inside its parent's box. */
		bounds?: DragBounds;
		/** When true, the element springs back to its rest position on release. */
		snapBack?: boolean;
		/** When true, release velocity carries the element on before it settles. */
		momentum?: boolean;
		/** How far the element may rubber-band past a bound, from 0 to 1. */
		elastic?: number;
		/** The spring used on release and for keyboard movement. */
		spring?: SpringInput;
		/** A CSS selector for a drag handle, or a snippet rendered as the handle. When set, only the handle starts a pointer drag. */
		handle?: string | Snippet;
		/** Turns pointer and keyboard dragging off. */
		disabled?: boolean;
		/** The current offset from rest, in pixels. Two-way bindable. */
		position?: Point;
		/** Called when `position` changes, from a drag or from the keyboard. */
		onPositionChange?: (position: Point) => void;
		/** Called when a pointer drag starts. */
		onDragStart?: (state: DragState) => void;
		/** Called as the pointer moves during a drag. */
		onDrag?: (state: DragState) => void;
		/** Called when a pointer drag ends. */
		onDragEnd?: (state: DragState) => void;
		/** The draggable content. */
		children?: Snippet;
	}

	let {
		axis = 'both',
		bounds,
		snapBack = false,
		momentum = true,
		elastic = 0.35,
		spring = 'snappy',
		handle,
		disabled = false,
		position = $bindable({ x: 0, y: 0 }),
		onPositionChange,
		onDragStart,
		onDrag,
		onDragEnd,
		class: klass,
		children,
		onkeydown,
		...rest
	}: Props = $props();

	let node = $state<HTMLElement | null>(null);
	let dragging = $state(false);
	const handleSnippet = $derived(typeof handle === 'function' ? handle : undefined);
	const handleSelector = $derived(typeof handle === 'string' ? handle : null);

	function writePosition(next: Point): void {
		position = next;
		onPositionChange?.(next);
	}

	const dragAttach = $derived(
		drag({
			axis,
			bounds,
			snapBack,
			momentum,
			elastic,
			spring,
			disabled,
			onDragStart: (state) => {
				dragging = true;
				writePosition({ x: state.x, y: state.y });
				onDragStart?.(state);
			},
			onDrag: (state) => {
				writePosition({ x: state.x, y: state.y });
				onDrag?.(state);
			},
			onDragEnd: (state) => {
				dragging = false;
				writePosition(snapBack ? { x: 0, y: 0 } : { x: state.x, y: state.y });
				onDragEnd?.(state);
			}
		})
	);

	function handleOnly(selector: string | null, hasSnippet: boolean): Attachment<HTMLElement> {
		return (el) => {
			if (!selector && !hasSnippet) return;
			el.classList.add('pointer-none');
			const marked: HTMLElement[] = [];
			const apply = (): void => {
				for (const h of marked) h.classList.remove('pointer-auto');
				marked.length = 0;
				const list = selector
					? Array.from(el.querySelectorAll(selector))
					: Array.from(el.querySelectorAll('[data-drag-handle]'));
				for (const h of list) {
					if (!(h instanceof HTMLElement)) continue;
					h.classList.add('pointer-auto');
					marked.push(h);
				}
			};
			apply();
			const mo = new MutationObserver(apply);
			mo.observe(el, { childList: true, subtree: true });
			return () => {
				mo.disconnect();
				el.classList.remove('pointer-none');
				for (const h of marked) h.classList.remove('pointer-auto');
			};
		};
	}

	const restrict = $derived(handleOnly(handleSelector, !!handleSnippet));

	$effect(() => {
		const el = node;
		const next = position;
		if (!el || dragging || disabled) return;
		if (getMotion(el, 'x') === next.x && getMotion(el, 'y') === next.y) return;
		animate(el, { x: next.x, y: next.y }, { spring });
	});

	function clamp(v: number, lo: number, hi: number): number {
		return Math.min(hi, Math.max(lo, v));
	}

	function clampToBounds(x: number, y: number, el: HTMLElement): Point {
		if (!bounds) return { x, y };
		if (typeof bounds === 'object') {
			return {
				x: clamp(x, bounds.left ?? -Infinity, bounds.right ?? Infinity),
				y: clamp(y, bounds.top ?? -Infinity, bounds.bottom ?? Infinity)
			};
		}
		const box = bounds === 'parent' ? el.parentElement?.getBoundingClientRect() : bounds();
		if (!box) return { x, y };
		const r = el.getBoundingClientRect();
		const mx = getMotion(el, 'x');
		const my = getMotion(el, 'y');
		const left = box.left - (r.left - mx);
		const right = box.right - (r.right - mx);
		const top = box.top - (r.top - my);
		const bottom = box.bottom - (r.bottom - my);
		return {
			x: clamp(x, Math.min(left, right), Math.max(left, right)),
			y: clamp(y, Math.min(top, bottom), Math.max(top, bottom))
		};
	}

	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }): void {
		onkeydown?.(e);
		if (e.defaultPrevented || disabled) return;
		const step = e.shiftKey ? 32 : 8;
		let { x, y } = position;
		if (e.key === 'ArrowLeft' && axis !== 'y') x -= step;
		else if (e.key === 'ArrowRight' && axis !== 'y') x += step;
		else if (e.key === 'ArrowUp' && axis !== 'x') y -= step;
		else if (e.key === 'ArrowDown' && axis !== 'x') y += step;
		else return;
		e.preventDefault();
		writePosition(node ? clampToBounds(x, y, node) : { x, y });
	}
</script>

<div
	bind:this={node}
	class={['motion', 'touch-none', 'select-none', 'grab', dragging && 'grabbing', klass]}
	role="button"
	aria-roledescription="draggable"
	aria-disabled={disabled || undefined}
	tabindex={disabled ? -1 : 0}
	{@attach dragAttach}
	{@attach restrict}
	onkeydown={handleKeydown}
	{...rest}
>
	{#if handleSnippet}
		<div class="pointer-auto" data-drag-handle>
			{@render handleSnippet()}
		</div>
	{/if}
	{@render children?.()}
</div>
