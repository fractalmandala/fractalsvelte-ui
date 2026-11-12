<!-- @component A page container on the measure ladder, optionally padded and centred in its parent. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Measure = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	type ContainerTag = 'div' | 'section' | 'article' | 'main' | 'aside';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** The maximum width, from the measure ladder. `full` fills the parent. */
		size?: Measure;
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
		size = 'lg',
		padded = false,
		center = false,
		as: tag = 'div',
		class: className,
		children,
		...rest
	}: Props = $props();

	const measureClass: Record<Measure, string> = {
		sm: 'measure-sm',
		md: 'measure-md',
		lg: 'measure-lg',
		xl: 'measure-xl',
		'2xl': 'measure-2xl',
		full: 'wfull'
	};
</script>

<svelte:element
	this={tag}
	class={[measureClass[size], padded && 'pad-lg', center && 'centered', className]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
