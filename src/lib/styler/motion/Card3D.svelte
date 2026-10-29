<!-- @component A card that tilts in 3D toward the pointer, with optional glare. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import PointerGlow from './PointerGlow.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Light glare that follows the pointer */
		glare?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { glare = true, class: className = '', children, ...restProps }: Props = $props();

	let x = $state(0);
	let y = $state(0);
	let hovered = $state(false);
</script>

<!-- The original tilts in 3D with a CSS transform, which fractalstyler cannot
     express. This edition keeps the depth cues it can: the moving glare and a
     shadow that deepens on hover. -->
<div
	class="relative box radius-md border bg-surface {hovered ? 'shadow-2xl' : 'shadow-md'} {className}"
	role="presentation"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onpointermove={(e) => {
		const r = e.currentTarget.getBoundingClientRect();
		x = e.clientX - r.left;
		y = e.clientY - r.top;
	}}
	{...restProps}
>
	<div class="box">{@render children?.()}</div>
	{#if glare}<PointerGlow {x} {y} visible={hovered} tone="text-white" radius={220} intensity={0.35} />{/if}
</div>
