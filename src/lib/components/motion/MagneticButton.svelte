<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape } from '../../types';

	interface Props extends HTMLButtonAttributes {
		strength?: number; // 0 to 1 magnetic pull
		range?: number; // trigger radius px
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		class?: string;
		children?: Snippet;
	}

	let {
		strength = 0.35,
		range = 100,
		variant = 'primary',
		size = 'md',
		shape = 'rounded',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let btnEl: HTMLButtonElement | undefined = $state();
	let offsetX = $state(0);
	let offsetY = $state(0);

	function handlePointerMove(e: PointerEvent) {
		if (!btnEl) return;
		const rect = btnEl.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
		if (dist < range) {
			offsetX = (e.clientX - centerX) * strength;
			offsetY = (e.clientY - centerY) * strength;
		} else {
			reset();
		}
	}

	function reset() {
		offsetX = 0;
		offsetY = 0;
	}
</script>

<svelte:window onpointermove={handlePointerMove} />

<button
	bind:this={btnEl}
	type="button"
	class="f-magnetic-btn {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	style="transform: translate3d({offsetX}px, {offsetY}px, 0);"
	onpointerleave={reset}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<span>Magnetic Button</span>
	{/if}
</button>

<style>
	@layer fractalsvelte-ui.components {
		.f-magnetic-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-family: inherit;
			font-weight: 600;
			border: 1px solid transparent;
			cursor: pointer;
			user-select: none;
			transition: transform 0.15s cubic-bezier(0.2, 0, 0.2, 1),
				background var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			will-change: transform;
		}

		/* Variants */
		.f-magnetic-btn[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			box-shadow: var(--f-shadow-sm);
		}
		.f-magnetic-btn[data-variant='primary']:hover {
			box-shadow: var(--f-shadow-glow);
		}

		.f-magnetic-btn[data-variant='secondary'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-magnetic-btn[data-variant='soft'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
		}

		/* Sizes */
		.f-magnetic-btn[data-size='sm'] { height: 32px; padding: 0 0.85rem; font-size: var(--f-text-xs); }
		.f-magnetic-btn[data-size='md'] { height: 42px; padding: 0 1.25rem; font-size: var(--f-text-sm); }
		.f-magnetic-btn[data-size='lg'] { height: 50px; padding: 0 1.75rem; font-size: var(--f-text-base); }

		/* Shapes */
		.f-magnetic-btn[data-shape='rounded'] { border-radius: var(--f-radius-md); }
		.f-magnetic-btn[data-shape='pill'] { border-radius: var(--f-radius-full); }
		.f-magnetic-btn[data-shape='square'] { border-radius: 0; }
	}
</style>
