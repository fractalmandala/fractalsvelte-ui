<!-- @component A card with a glow that follows the pointer. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText, Surface } from '../types';
	import PointerGlow from './PointerGlow.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: MessageText;
		/** Glow radius in px */
		glowSize?: number;
		surface?: Surface;
		class?: string;
		children?: Snippet;
	}

	let { tone, glowSize = 300, surface = 'bg-panel', class: className = '', children, ...restProps }: Props = $props();

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
	class="relative box border radius-md {surface} {className}"
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
