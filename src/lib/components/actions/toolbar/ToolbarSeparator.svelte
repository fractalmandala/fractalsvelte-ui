<!-- @component A hairline between groups of controls, drawn across the toolbar cross axis. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { getToolbar } from './toolbar.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {}

	let { class: klass, ...rest }: Props = $props();

	const toolbar = getToolbar();
	const vertical = $derived(toolbar.orientation === 'horizontal');
</script>

<div
	role="separator"
	aria-orientation={vertical ? 'vertical' : 'horizontal'}
	class={[vertical ? 'bl mx-xs' : 'bt my-xs', klass]}
	{...rest}
></div>
