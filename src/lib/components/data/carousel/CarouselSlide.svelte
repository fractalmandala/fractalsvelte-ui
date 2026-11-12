<!-- @component One slide in the rail, with an optional accessible label. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getCarousel } from './carousel.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** An accessible name for this slide, announced with its position. */
		label?: string;
		/** The slide content. */
		children?: Snippet;
	}

	let { label, class: klass, children, ...rest }: Props = $props();

	const carousel = getCarousel();
	let node = $state<HTMLElement | null>(null);
	const order = $derived(carousel.position(node));
	const total = $derived(carousel.total());

	function attach(el: HTMLElement) {
		node = el;
		const unregister = carousel.register({ label, node: el });
		return () => {
			unregister();
			node = null;
		};
	}
</script>

<div
	class={['slide', klass]}
	role="group"
	aria-roledescription="slide"
	aria-label={label ?? (order >= 0 && total > 0 ? `Slide ${order + 1} of ${total}` : 'Slide')}
	{@attach attach}
	{...rest}
>
	{@render children?.()}
</div>
