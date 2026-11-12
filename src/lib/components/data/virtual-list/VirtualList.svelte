<!-- @component A windowed list that keeps 10,000+ rows scrolling smoothly, with an imperative scrollToIndex. -->

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { reducedMotion, vars } from '../../../motion/index.js';
	import { indexAtOffset } from './virtual-list.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The full item list. Only a window of it is rendered. */
		items: T[];
		/** Fixed row height in pixels, or a function that estimates a row before it is measured. */
		itemHeight: number | ((index: number, item: T) => number);
		/** Extra rows rendered above and below the viewport. */
		overscan?: number;
		/** Viewport height, as a number of pixels or any CSS length. */
		height?: number | string;
		/** Names the list for assistive technology and makes the viewport keyboard-scrollable. */
		label?: string;
		/** The row content, called with the item and its index. */
		children?: Snippet<[T, number]>;
	}

	let {
		items,
		itemHeight,
		overscan = 4,
		height = 320,
		label,
		class: klass,
		children,
		...rest
	}: Props = $props();

	let scroller = $state<HTMLElement | null>(null);
	let scrollTop = $state(0);
	let viewportH = $state(0);
	let measured = $state.raw<number[]>([]);
	let pending: Map<number, number> | null = null;
	let raf = 0;

	const maxHeight = $derived(typeof height === 'number' ? `${height}px` : height);
	const fallbackView = $derived(typeof height === 'number' ? height : 320);
	const view = $derived(viewportH > 0 ? viewportH : fallbackView);
	const fixed = $derived(typeof itemHeight === 'number');

	function estimate(index: number): number {
		if (typeof itemHeight === 'number') return itemHeight;
		const item = items[index];
		return item === undefined ? 0 : itemHeight(index, item);
	}

	function heightAt(index: number): number {
		return measured[index] ?? estimate(index);
	}

	const prefixes = $derived.by(() => {
		const n = items.length;
		const p = new Array<number>(n + 1);
		p[0] = 0;
		if (fixed && typeof itemHeight === 'number') {
			for (let i = 0; i < n; i += 1) p[i + 1] = (i + 1) * itemHeight;
			return p;
		}
		void measured;
		for (let i = 0; i < n; i += 1) p[i + 1] = (p[i] ?? 0) + heightAt(i);
		return p;
	});

	const extent = $derived(prefixes[items.length] ?? 0);

	const windowed = $derived.by(() => {
		const n = items.length;
		if (n === 0) return [] as { item: T; index: number; y: number; h: number }[];
		const start = Math.max(0, indexAtOffset(prefixes, scrollTop) - overscan);
		const end = Math.min(n, indexAtOffset(prefixes, scrollTop + view) + 1 + overscan);
		const rows: { item: T; index: number; y: number; h: number }[] = [];
		for (let i = start; i < end; i += 1) {
			const item = items[i];
			if (item === undefined) continue;
			rows.push({ item, index: i, y: prefixes[i] ?? 0, h: heightAt(i) });
		}
		return rows;
	});

	function flushHeights() {
		raf = 0;
		if (!pending) return;
		const next = measured.slice();
		let changed = false;
		for (const [index, h] of pending) {
			if (Math.abs((next[index] ?? 0) - h) > 0.5) {
				next[index] = h;
				changed = true;
			}
		}
		pending = null;
		if (changed) measured = next;
	}

	function recordHeight(index: number, h: number) {
		if (fixed) return;
		if (Math.abs(heightAt(index) - h) <= 0.5) return;
		pending = pending ?? new Map();
		pending.set(index, h);
		if (!raf) raf = requestAnimationFrame(flushHeights);
	}

	function measure(index: number) {
		return (node: HTMLElement) => {
			if (fixed) return () => {};
			const read = () => recordHeight(index, node.getBoundingClientRect().height);
			read();
			const ro = new ResizeObserver(read);
			ro.observe(node);
			return () => ro.disconnect();
		};
	}

	function scrollerAttach(node: HTMLElement) {
		scroller = node;
		const read = () => {
			viewportH = node.clientHeight;
			scrollTop = node.scrollTop;
		};
		read();
		const ro = new ResizeObserver(read);
		ro.observe(node);
		return () => {
			ro.disconnect();
			if (scroller === node) scroller = null;
			if (raf) cancelAnimationFrame(raf);
		};
	}

	function onScroll(event: Event) {
		scrollTop = (event.currentTarget as HTMLElement).scrollTop;
	}

	export function scrollToIndex(index: number, options?: { align?: 'start' | 'center' | 'end' }): void {
		const el = scroller;
		if (!el || items.length === 0) return;
		const clamped = Math.min(Math.max(0, index), items.length - 1);
		const y = prefixes[clamped] ?? 0;
		const h = heightAt(clamped);
		const align = options?.align ?? 'start';
		let top = y;
		if (align === 'center') top = y - (view - h) / 2;
		else if (align === 'end') top = y - (view - h);
		el.scrollTo({
			top: Math.max(0, Math.min(top, Math.max(0, extent - view))),
			behavior: reducedMotion.current ? 'auto' : 'smooth'
		});
	}

</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scrollable list must be keyboard-focusable -->
<div
	class={['scroll-xy scroll-thin wfull', label && 'focus-ring', klass]}
	role="list"
	aria-label={label}
	tabindex={label ? 0 : undefined}
	{@attach vars({ 'max-height': maxHeight })}
	{@attach scrollerAttach}
	onscroll={onScroll}
	{...rest}
>
	<div class="stage" {@attach vars({ extent })}>
		{#each windowed as row (row.index)}
			<div
				class="placed sized row ycenter gap-sm"
				role="listitem"
				aria-setsize={items.length}
				aria-posinset={row.index + 1}
				{@attach vars({ y: row.y, 'row-h': row.h })}
				{@attach measure(row.index)}
			>
				{@render children?.(row.item, row.index)}
			</div>
		{/each}
	</div>
</div>
