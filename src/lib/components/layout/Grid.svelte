<!-- @component Responsive CSS Grid container with explicit columns or auto-fit/auto-fill minmax tracks. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Space, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Columns at full width; they fold down on smaller screens. Omit to fit as many cards as the width allows. */
		cols?: 1 | 2 | 3 | 4 | 6;
		/** Space between cells, from the spacing scale. */
		gap?: Space;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		cols,
		gap = 'bs',
		padding,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

</script>

<div
	class="wfull gap-{gap} {cols ? `grid-${cols}` : 'card-grid'} {padding ?? ''} {textsize} {className}"
	{...restProps}
>
	{@render children?.()}
</div>

