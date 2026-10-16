<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animateElements, type NavigationDirection, type ViewTransitionType } from '../../view-transitions.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		key?: any;
		type?: ViewTransitionType;
		direction?: NavigationDirection;
		duration?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		key = 0,
		type = 'drill',
		direction = 'forward',
		duration = 380,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let currentEl: HTMLDivElement | undefined = $state();
	let outgoingEl: HTMLDivElement | undefined = $state();
	let currentKey = $state(untrack(() => key));
	let isTransitioning = $state(false);

	$effect(() => {
		if (key !== currentKey) {
			const prevKey = currentKey;
			const nextKey = key;

			if (currentEl && containerEl) {
				// Clone current DOM as outgoing element
				const clone = currentEl.cloneNode(true) as HTMLDivElement;
				clone.classList.add('f-route-outgoing');
				clone.setAttribute('aria-hidden', 'true');
				containerEl.appendChild(clone);
				outgoingEl = clone;

				isTransitioning = true;
				currentKey = nextKey;

				// Wait for DOM flush of incoming view, then animate
				requestAnimationFrame(() => {
					if (currentEl && outgoingEl) {
						animateElements(outgoingEl, currentEl, type, {
							direction,
							duration
						}).finally(() => {
							if (outgoingEl && outgoingEl.parentNode) {
								outgoingEl.parentNode.removeChild(outgoingEl);
								outgoingEl = undefined;
							}
							isTransitioning = false;
						});
					}
				});
			} else {
				currentKey = nextKey;
			}
		}
	});
</script>

<div
	bind:this={containerEl}
	class="f-route-transition-container {className}"
	data-type={type}
	data-transitioning={isTransitioning ? '' : undefined}
	{...restProps}
>
	<div
		bind:this={currentEl}
		class="f-route-content"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-route-transition-container {
			position: relative;
			width: 100%;
			min-height: 100%;
			overflow: hidden;
			box-sizing: border-box;
		}

		.f-route-content {
			position: relative;
			width: 100%;
			height: 100%;
			will-change: transform, opacity;
		}

		:global(.f-route-outgoing) {
			position: absolute !important;
			inset: 0 !important;
			width: 100% !important;
			height: 100% !important;
			pointer-events: none !important;
			z-index: 1 !important;
			will-change: transform, opacity;
		}

		.f-route-transition-container[data-transitioning] .f-route-content {
			z-index: 2;
		}
	}
</style>
