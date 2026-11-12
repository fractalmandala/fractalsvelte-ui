<!-- @component A balanced masonry of uneven items, using CSS grid masonry where it is supported and a shortest-column packer everywhere else. -->

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import {
		packColumns,
		readBreakpoints,
		resolveColumns,
		supportsMasonry,
		type MasonryColumns
	} from './masonry.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** How many columns to use, or a map resolved from the element's width against the system's `--bp-*` breakpoints. */
		columns?: number | MasonryColumns;
		/** The gap between columns and stacked items, as a CSS length. */
		gap?: string;
		/** The items to place, in stable source order. */
		items: T[];
		/** The content of one item, called with the item and its index. */
		children?: Snippet<[T, number]>;
	}

	let {
		columns = 3,
		gap = 'var(--space-md)',
		items,
		class: klass,
		children,
		...rest
	}: Props = $props();

	let measured = $state<number | null>(null);
	let packed = $state(false);
	const cols = $derived(typeof columns === 'number' ? columns : (measured ?? columns.base ?? 1));

	function observe(_cols: number, _count: number, _gap: string) {
		return (node: HTMLElement) => {
			const native = supportsMasonry();
			packed = !native;

			const columnsOf = (): number => {
				if (typeof columns === 'number') return columns;
				return resolveColumns(columns, node.clientWidth, readBreakpoints(document.documentElement));
			};

			const pack = (): void => {
				const count = columnsOf();
				if (typeof columns !== 'number') measured = count;
				if (native) return;

				const childrenEl = Array.from(node.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
				const heights = childrenEl.map((el) => el.getBoundingClientRect().height);
				const gutter = Number.parseFloat(getComputedStyle(node).gap) || 0;
				const colWidth = Math.max(0, (node.clientWidth - gutter * (count - 1)) / count);
				const next = packColumns(heights, count, gutter, colWidth);
				const extent = next.extent.toFixed(2);
				if (node.style.getPropertyValue('--extent') !== extent) node.style.setProperty('--extent', extent);
				childrenEl.forEach((el, i) => {
					const item = next.items[i];
					if (!item) return;
					el.classList.add('placed');
					el.style.setProperty('--x', item.x.toFixed(2));
					el.style.setProperty('--y', item.y.toFixed(2));
				});
			};

			pack();
			const ro = new ResizeObserver(pack);
			ro.observe(node);
			for (const child of node.children) if (child instanceof Element) ro.observe(child);
			const mo = new MutationObserver(() => {
				for (const child of node.children) if (child instanceof Element) ro.observe(child);
				pack();
			});
			mo.observe(node, { childList: true });
			return () => {
				ro.disconnect();
				mo.disconnect();
				node.style.removeProperty('--extent');
				for (const child of node.children) {
					if (!(child instanceof HTMLElement)) continue;
					child.classList.remove('placed');
					child.style.removeProperty('--x');
					child.style.removeProperty('--y');
				}
			};
		};
	}
</script>

<div
	class={['masonry', packed && 'packed', klass]}
	{@attach vars({ cols, gap })}
	{@attach observe(cols, items.length, gap)}
	{...rest}
>
	{#each items as item, index (index)}
		<div>
			{@render children?.(item, index)}
		</div>
	{/each}
</div>
