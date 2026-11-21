<!-- @component Gives an element a view-transition identity so it can morph between routes or in-page states. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vtName } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		name: string;
		as?: string;
		children?: Snippet;
	}

	let { name, as = 'div', class: className, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} class={['vt-name', className]} {@attach vtName(name)} {...rest}>
	{@render children?.()}
</svelte:element>
