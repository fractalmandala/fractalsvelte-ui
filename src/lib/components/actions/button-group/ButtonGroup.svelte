<!-- @component Joins related buttons into one segmented control, or spaces them evenly. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The accessible name of the group, announced when focus enters it. */
		label?: string;
		/** The direction the buttons run in. */
		orientation?: Orientation;
		/** Joins the buttons into one segmented control. When false, they sit apart with a small gap. */
		attached?: boolean;
		/** The buttons. */
		children?: Snippet;
	}

	let {
		label,
		orientation = 'horizontal',
		attached = true,
		class: className,
		children,
		...rest
	}: Props = $props();

	const vertical = $derived(orientation === 'vertical');
</script>

<div
	role="group"
	aria-label={label}
	class={[
		attached ? 'button-group' : vertical ? 'box gap-sm' : 'row wrap gap-sm',
		attached && vertical && 'vertical',
		className
	]}
	{...rest}
>
	{@render children?.()}
</div>
