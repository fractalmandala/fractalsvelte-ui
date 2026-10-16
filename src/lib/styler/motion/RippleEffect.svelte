<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import Ripples, { makeRipple, type Ripple } from './Ripples.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: FsTone | 'white';
		/** ms */
		duration?: number;
		/** Ripple from the centre instead of the pointer */
		center?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		tone = 'theme',
		duration = 600,
		center = false,
		class: className = '',
		children,
		onpointerdown,
		...restProps
	}: Props = $props();

	let ripples = $state<Ripple[]>([]);
	let counter = 0;

	function spawn(e: PointerEvent & { currentTarget: HTMLDivElement }) {
		const ripple = makeRipple(e, e.currentTarget, ++counter, center);
		ripples = [...ripples, ripple];
		setTimeout(() => (ripples = ripples.filter((r) => r.id !== ripple.id)), duration);
		onpointerdown?.(e);
	}
</script>

<!-- A padding-free .relative host: the content, then the wave overlays on top. -->
<div class="relative box radius-md {className}" role="presentation" onpointerdown={spawn} {...restProps}>
	<div class="box">{@render children?.()}</div>
	<Ripples {ripples} {duration} {tone} opacity={0.25} />
</div>
