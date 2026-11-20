<!-- @component Thin wrappers around fractalstyler's type scale: headings, lead and muted text, quotes, lists and inline code. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** `center` is a centred reading measure; `left` and `right` pin it to that edge. */
		align?: 'left' | 'center' | 'right';
		/** The typographic stack — headings, paragraphs, lists and quotes. */
		children?: Snippet;
	}

	let { align = 'center', class: className, children, ...rest }: Props = $props();
</script>

<div class={[align === 'left' || align === 'right' ? 'prose-left' : 'prose', className]} {...rest}>
	{@render children?.()}
</div>
