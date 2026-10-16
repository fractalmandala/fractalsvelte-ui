<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { FsVariant, FsSize, FsShape } from '../types';

	interface Props extends HTMLButtonAttributes {
		/** Pointer distance (px) that pulls the button */
		range?: number;
		variant?: FsVariant;
		size?: FsSize;
		shape?: FsShape;
		class?: string;
		children?: Snippet;
	}

	let {
		range = 100,
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let btnEl = $state<HTMLButtonElement | null>(null);
	let dx = $state<-1 | 0 | 1>(0);
	let dy = $state<-1 | 0 | 1>(0);

	// No transforms in fractalstyler, so the pull is a margin swap whose two
	// sides always sum to 8px (xs + xs, or sm + 0): the button leans up to 4px
	// toward the pointer while its slot never changes size.
	const X_CLASSES = { '-1': 'mr-sm', '0': 'mx-xs', '1': 'ml-sm' } as const;
	const Y_CLASSES = { '-1': 'mb-sm', '0': 'my-xs', '1': 'mt-sm' } as const;

	function onWindowMove(e: PointerEvent) {
		if (!btnEl) return;
		const r = btnEl.getBoundingClientRect();
		const ox = e.clientX - (r.left + r.width / 2);
		const oy = e.clientY - (r.top + r.height / 2);
		if (Math.hypot(ox, oy) > range) {
			dx = 0;
			dy = 0;
			return;
		}
		const dead = 6;
		dx = ox > dead ? 1 : ox < -dead ? -1 : 0;
		dy = oy > dead ? 1 : oy < -dead ? -1 : 0;
	}
</script>

<svelte:window onpointermove={onWindowMove} />

<button
	bind:this={btnEl}
	type="button"
	class="{X_CLASSES[dx]} {Y_CLASSES[dy]} {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	{...restProps}
>
	{#if children}{@render children()}{:else}Magnetic button{/if}
</button>
