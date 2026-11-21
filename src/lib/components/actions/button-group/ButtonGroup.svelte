<!-- @component Joins related buttons into one segmented control, or spaces them evenly. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Orientation, Gap, Shape  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		orientation?: Orientation;
		gap?: Gap;
		shape?: Shape;
		attached?: boolean;
		children?: Snippet;
	}

	let {
		label,
		orientation = 'horizontal',
		gap = '',
		shape = 'modern',
		attached = true,
		class: className,
		children,
		...rest
	}: Props = $props();

	const spaced = $derived(!attached || Boolean(gap));
</script>

<div
	role="group"
	aria-label={label}
	class={['button-group overflow-hidden', orientation, shape, spaced && 'spaced', gap, className]}
	{...rest}
>
	{@render children?.()}
</div>
