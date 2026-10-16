<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSpace } from '../types';
	import { GAP, GRID_COLS, type FsColumns } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** fractalstyler's responsive grid steps (1–6). Cells span with colSpan. */
		columns?: FsColumns;
		gap?: FsSpace;
		class?: string;
		children?: Snippet;
	}

	let { columns = 3, gap = 'md', class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="{GRID_COLS[columns]} ystretch {GAP[gap]} {className}" {...restProps}>
	{@render children?.()}
</div>
