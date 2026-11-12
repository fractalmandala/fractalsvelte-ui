<!-- @component A visual cluster of controls, joined or spaced, without its own keyboard management. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getToolbar } from './toolbar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The accessible name of the group, announced when focus enters it. */
		label?: string;
		/** Joins the controls into one segmented cluster. When false, they sit apart with a small gap. */
		attached?: boolean;
		/** The buttons or toggles in the group. */
		children?: Snippet;
	}

	let { label, attached = true, class: klass, children, ...rest }: Props = $props();

	const toolbar = getToolbar();
	const vertical = $derived(toolbar.orientation === 'vertical');
</script>

<div
	role="group"
	aria-label={label}
	class={[
		attached ? 'button-group' : vertical ? 'box gap-xs' : 'row gap-xs',
		attached && vertical && 'vertical',
		klass
	]}
	{...rest}
>
	{@render children?.()}
</div>
