<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone, FsSurface } from '../types';
	import { SURFACE } from '../classes';
	import PointerGlow from './PointerGlow.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: FsTone;
		/** Glow radius in px */
		glowSize?: number;
		surface?: FsSurface;
		class?: string;
		children?: Snippet;
	}

	let { tone = 'theme', glowSize = 300, surface = 'panel', class: className = '', children, ...restProps }: Props = $props();

	let x = $state(0);
	let y = $state(0);
	let w = $state(0);
	let h = $state(0);
	let hovered = $state(false);

	function onpointermove(e: PointerEvent & { currentTarget: HTMLDivElement }) {
		const r = e.currentTarget.getBoundingClientRect();
		x = e.clientX - r.left;
		y = e.clientY - r.top;
	}
</script>

<!-- The border lights up under the pointer (stroke) over a faint wash (fill). -->
<div
	bind:clientWidth={w}
	bind:clientHeight={h}
	class="relative box border radius-md {SURFACE[surface]} {className}"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	{onpointermove}
	role="presentation"
	{...restProps}
>
	<PointerGlow {x} {y} visible={hovered} radius={glowSize} {tone} intensity={0.12} />
	<PointerGlow {x} {y} visible={hovered} radius={glowSize / 2} {tone} mode="stroke" intensity={0.9} width={w} height={h} />
	<div class="relative box gap-sm pad-lg">{@render children?.()}</div>
</div>
