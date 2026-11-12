<!-- @component A row for actions or metadata at the bottom. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Where the footer's items sit along the row. */
		align?: 'start' | 'center' | 'end' | 'between';
		/** The footer's actions or metadata. */
		children?: Snippet;
	}

	let { align = 'start', class: klass, children, ...rest }: Props = $props();

	const justify = {
		start: 'xleft',
		center: 'xcenter',
		end: 'xright',
		between: 'xbetween'
	};
</script>

<footer class={['row wrap ycenter gap-sm', justify[align], klass]} {...rest}>
	{@render children?.()}
</footer>
