<!-- @component Wraps content with a sweeping shimmer highlight. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		active?: boolean;
		/** Seconds per sweep */
		duration?: number;
		/** Sweep angle in degrees */
		angle?: number;
		/** Peak opacity of the sheen */
		intensity?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		active = true,
		duration = 2,
		angle = 20,
		intensity = 0.18,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const uid = $props.id();
</script>

<!-- A white sheen band sweeps across: a gradient rect whose x is animated by
     SMIL, drawn over the content in a padding-free .relative host. -->
<div class="relative box {className}" {...restProps}>
	<div class="box">{@render children?.()}</div>
	{#if active}
		<svg class="absolute full text-white" pointer-events="none" aria-hidden="true">
			<defs>
				<linearGradient id="{uid}-sheen" gradientTransform="rotate({angle})">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0" />
					<stop offset="50%" stop-color="currentColor" stop-opacity={intensity} />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
				</linearGradient>
			</defs>
			<rect y="0" width="40%" height="100%" fill="url(#{uid}-sheen)">
				<animate attributeName="x" values="-40%;100%" dur="{duration}s" repeatCount="indefinite" />
			</rect>
		</svg>
	{/if}
</div>
