<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import PointerGlow from './PointerGlow.svelte';

	export type AnimatedCardVariant = 'surface' | 'sunken' | 'raised' | 'outline';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: AnimatedCardVariant;
		/** Pointer-following wash */
		spotlight?: boolean;
		/** Lift (deeper shadow) while hovered */
		lift?: boolean;
		tone?: FsTone;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		variant = 'surface',
		spotlight = true,
		lift = true,
		tone = 'theme',
		class: className = '',
		children,
		header,
		footer,
		...restProps
	}: Props = $props();

	const PAINT_CLASSES: Record<AnimatedCardVariant, string> = {
		surface: 'bg-surface border-subtle',
		sunken: 'bg-sunken border',
		raised: 'bg-raised border-subtle',
		outline: 'border-strong'
	};

	let x = $state(0);
	let y = $state(0);
	let hovered = $state(false);
</script>

<!-- Motion here is a pointer-tracked SVG wash and a shadow-class swap on
     hover; fractalstyler has no keyframes for the original's float. -->
<div
	class="relative box radius-md {PAINT_CLASSES[variant]} {lift && hovered ? 'shadow-xl' : 'shadow-sm'} {className}"
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
	{#if spotlight}<PointerGlow {x} {y} visible={hovered} {tone} />{/if}
	<div class="relative box gap-md pad-lg">
		{#if header}<header class="row ycenter xbetween gap-sm">{@render header()}</header>{/if}
		{#if children}<div class="box gap-sm text-body-sm">{@render children()}</div>{/if}
		{#if footer}<footer class="row ycenter gap-sm pt-sm bt-sub">{@render footer()}</footer>{/if}
	</div>
</div>
