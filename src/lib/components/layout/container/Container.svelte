<!-- @component A page container on the measure ladder, optionally padded and centred in its parent. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Measure } from '../../../internal/tokens.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type ContainerTag = 'div' | 'section' | 'article' | 'main' | 'aside';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** The maximum width, from the measure ladder. `full` fills the parent. */
		width?: Measure;
		/** Adds padding from the space ladder on all sides. */
		padded?: boolean;
		/** Centres the container in its parent. */
		center?: boolean;
		/** The element to render as the container. */
		as?: ContainerTag;
		/** The page content. */
		children?: Snippet;
	}

	let {
		width = 'measure-lg',
		padded = false,
		center = false,
		as: tag = 'div',
		class: className,
		children,
		...rest
	}: Props = $props();

	const measureClass: Record<Measure, string> = {
		'measure-xs': 'measure-xs',
		'measure-sm': 'measure-sm',
		'measure-md': 'measure-md',
		'measure-bs': 'measure-bs',
		'measure-lg': 'measure-lg',
		'measure-xl': 'measure-xl',
		'measure-2xl': 'measure-2xl',
		'measure-3xl': 'measure-3xl',
		'measure-4xl': 'measure-4xl',
		'measure-full': 'wfull'
	};
</script>

<svelte:element
	this={tag}
	class={[measureClass[width], padded && 'pad-lg', center && 'centered', className]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
