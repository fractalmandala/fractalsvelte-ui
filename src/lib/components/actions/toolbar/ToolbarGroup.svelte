<!-- @component A visual cluster of controls, joined or spaced, without its own keyboard management. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getToolbar } from './toolbar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		label?: string;
		attached?: boolean;
		children?: Snippet;
	}

	let { label, attached = true, class: className, children, ...rest }: Props = $props();

	const toolbar = getToolbar();
	const vertical = $derived(toolbar.orientation === 'vertical');
</script>

<div
	role="group"
	aria-label={label}
	class={[
		attached ? 'button-group' : vertical ? 'box gap-xs' : 'row gap-xs',
		attached && vertical && 'vertical',
		className
	]}
	{...rest}
>
	{@render children?.()}
</div>
