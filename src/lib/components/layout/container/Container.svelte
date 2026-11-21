<!-- @component A page container on the measure ladder, optionally padded and centred in its parent. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  Measure, Pad  } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';

	type ContainerTag = 'div' | 'section' | 'article' | 'main' | 'aside';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		width?: Measure;
		padded?: boolean;
		pad?: Pad;
		center?: boolean;
		as?: ContainerTag;
		children?: Snippet;
	}

	let {
		width = 'measure-lg',
		padded = false,
		pad = 'pad-lg',
		center = false,
		as: tag = 'div',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={tag}
	class={[width, padded && pad, center && 'centered', className]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
