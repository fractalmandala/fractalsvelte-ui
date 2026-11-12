<!-- @component Thin wrappers around fractalstyler's type scale: headings, lead and muted text, quotes, lists and inline code. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** `center` is a centred reading measure; `start` pins the measure to the start edge. */
		align?: 'center' | 'start';
		/** The typographic stack — headings, paragraphs, lists and quotes. */
		children?: Snippet;
	}

	let { align = 'center', class: klass, children, ...rest }: Props = $props();
</script>

<div class={[align === 'start' ? 'prose-left' : 'prose', klass]} {...rest}>
	{@render children?.()}
</div>
