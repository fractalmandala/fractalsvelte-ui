<!-- @component Gives an element a view-transition identity so it can morph between routes or in-page states. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vtName } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The shared-element name. Must be unique on the page at transition time. */
		name: string;
		/** The element tag to render as. */
		as?: string;
		/** The content that morphs. */
		children?: Snippet;
	}

	let { name, as = 'div', class: klass, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} class={['vt-name', klass]} {@attach vtName(name)} {...rest}>
	{@render children?.()}
</svelte:element>
