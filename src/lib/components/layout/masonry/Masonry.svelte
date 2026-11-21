<!-- @component A balanced masonry of uneven items, using CSS grid masonry where it is supported and a shortest-column packer everywhere else. -->

<script lang="ts" generics="T">
	import type {  Snippet  } from 'svelte';
	import { type Gap } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import {
		packColumns,
		readBreakpoints,
		resolveColumns,
		supportsMasonry,
		type MasonryColumns
	} from './masonry.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		columns?: number | MasonryColumns;
		gap?: Gap;
		items: T[];
		children?: Snippet<[T, number]>;
	}

	let {
		columns = 3,
		gap = 'gap-md',
		items,
		class: className,
		children,
		...rest
	}: Props = $props();

	let measured = $state<number | null>(null);
	let packed = $state(false);
	const cols = $derived(typeof columns === 'number' ? columns : (measured ?? columns.base ?? 1));

	function observe(_cols: number, _count: number, _gap: Gap) {
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
	class={['masonry', packed && 'packed', className]}
	{@attach vars({ cols })}
	{@attach observe(cols, items.length, gap)}
	{...rest}
>
	{#each items as item, index (index)}
		<div>
			{@render children?.(item, index)}
		</div>
	{/each}
</div>
