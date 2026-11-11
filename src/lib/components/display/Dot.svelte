<!-- @component A compact status dot indicator with optional pulsing animation and status variants. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { Variant, Message } from '$lib/types.js';

	export type DotSize = 'sm' | 'md' | 'lg';

	interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'size'> {
		variant?: Variant | Message;
		size?: DotSize;
		/** Whether the dot pulsates with an animated outer ping ring */
		animated?: boolean;
		class?: string;
	}

	let {
		variant = 'primary',
		size = 'md',
		animated = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const PX: Record<DotSize, number> = { sm: 6, md: 8, lg: 12 };
	// The dot is drawn in currentColor, so its colour is a text class.
	const INK: Record<string, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		themed: 'text-theme',
		outline: 'text-primary',
		ghost: 'text-muted',
		link: 'text-info',
		info: 'text-info',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};
	const px = $derived(PX[size]);
</script>

<!-- The ping is SVG animation (SMIL), so nothing here needs keyframes of its own. -->
<svg
	width={px * 2}
	height={px * 2}
	viewBox="0 0 24 24"
	aria-hidden="true"
	class="shrink-0 {INK[variant] ?? 'text-primary'} {className}"
	{...restProps}
>
	{#if animated}
		<circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.6">
			<animate attributeName="r" values="6;12" dur="1.5s" repeatCount="indefinite" />
			<animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
		</circle>
	{/if}
	{#if variant === 'outline'}
		<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2" />
	{:else}
		<circle cx="12" cy="12" r="6" fill="currentColor" />
	{/if}
</svg>
