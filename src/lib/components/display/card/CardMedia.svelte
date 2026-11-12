<!-- @component An image or illustration that runs to the card edges. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The image address. Without it the media shows its children, such as an illustration. */
		src?: string;
		/** Alternative text for the image. Leave empty for a purely decorative image. */
		alt?: string;
		/** Crops the media to an aspect ratio. Without it the image keeps its own. */
		ratio?: '16/9' | '4/3' | '3/2' | '1/1';
		/** Content drawn over or instead of the image. */
		children?: Snippet;
	}

	let { src, alt = '', ratio, class: klass, children, ...rest }: Props = $props();

	const frame = {
		'16/9': 'frame-16-9',
		'4/3': 'frame-4-3',
		'3/2': 'frame-3-2',
		'1/1': 'frame-1-1'
	};
</script>

<figure class={['bleed bg-panel relative overflow-hidden', ratio && frame[ratio], klass]} {...rest}>
	{#if src}
		<img class={ratio ? 'cover full fit-cover' : 'wfull'} {src} {alt} loading="lazy" />
	{/if}
	{@render children?.()}
</figure>
