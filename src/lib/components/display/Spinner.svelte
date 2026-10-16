<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { Size, Speed } from '../../types';

	interface Props extends SVGAttributes<SVGSVGElement> {
		size?: Size | number;
		thickness?: number;
		color?: string;
		speed?: Speed;
		label?: string;
		class?: string;
	}

	let {
		size = 'md',
		thickness = 3,
		color = 'currentColor',
		speed = 'normal',
		label = 'Loading...',
		class: className = '',
		...restProps
	}: Props = $props();

	const pixelSize = $derived.by(() => {
		if (typeof size === 'number') return size;
		switch (size) {
			case 'xs':
				return 14;
			case 'sm':
				return 18;
			case 'lg':
				return 32;
			case 'xl':
				return 44;
			case 'md':
			default:
				return 24;
		}
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	width={pixelSize}
	height={pixelSize}
	role="status"
	aria-label={label}
	class="f-spinner {className}"
	data-speed={speed}
	style="color: {color};"
	{...restProps}
>
	<!-- Track ring -->
	<circle
		cx="12"
		cy="12"
		r={12 - thickness}
		stroke="currentColor"
		stroke-width={thickness}
		opacity="0.2"
	/>
	<!-- Animated spinner segment -->
	<circle
		cx="12"
		cy="12"
		r={12 - thickness}
		stroke="currentColor"
		stroke-width={thickness}
		stroke-linecap="round"
		stroke-dasharray="80"
		stroke-dashoffset="60"
		class="f-spinner-arc"
	/>
</svg>

<style>
	@layer fractalsvelte-ui.components {
		.f-spinner {
			display: inline-block;
			vertical-align: middle;
			flex-shrink: 0;
		}

		.f-spinner[data-speed='fast'] {
			animation: f-spin 0.5s linear infinite;
		}

		.f-spinner[data-speed='normal'] {
			animation: f-spin 0.75s linear infinite;
		}

		.f-spinner[data-speed='slow'] {
			animation: f-spin 1.2s linear infinite;
		}

		@keyframes f-spin {
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
