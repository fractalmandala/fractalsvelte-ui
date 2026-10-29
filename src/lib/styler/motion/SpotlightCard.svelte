<!-- @component A card lit by a spotlight that follows the pointer. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText } from '../types';
	import PointerGlow from './PointerGlow.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: MessageText;
		/** Spotlight radius in px */
		radius?: number;
		class?: string;
		children?: Snippet;
	}

	let { tone, radius = 300, class: className = '', children, ...restProps }: Props = $props();

	let x = $state(0);
	let y = $state(0);
	let w = $state(0);
	let h = $state(0);
	let hovered = $state(false);
</script>

<div
	bind:clientWidth={w}
	bind:clientHeight={h}
	class="relative box bg-sunken border radius-md {className}"
	role="presentation"
	onpointermove={(e) => {
		const r = e.currentTarget.getBoundingClientRect();
		x = e.clientX - r.left;
		y = e.clientY - r.top;
		hovered = true;
	}}
	onpointerleave={() => (hovered = false)}
	{...restProps}
>
	<PointerGlow {x} {y} visible={hovered} {radius} {tone} intensity={0.22} />
	<PointerGlow {x} {y} visible={hovered} {radius} {tone} mode="stroke" intensity={1} width={w} height={h} />
	<div class="relative box gap-sm pad-lg">{@render children?.()}</div>
</div>
