<!-- @component A responsive grid for laying out BentoCell tiles. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../types';

	type Columns = 1 | 2 | 3 | 4 | 5 | 6;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** fractalstyler's responsive grid steps (1–6). Cells span with colSpan. */
		columns?: Columns;
		gap?: Space;
		class?: string;
		children?: Snippet;
	}

	let { columns = 3, gap = 'md', class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="grid-{columns} ystretch gap-{gap} {className}" {...restProps}>
	{@render children?.()}
</div>
