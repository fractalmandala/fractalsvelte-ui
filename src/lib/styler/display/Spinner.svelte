<!-- @component A spinning loading indicator sized to the surrounding text. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { MessageText, TextSize } from '../types';

	interface Props extends SVGAttributes<SVGSVGElement> {
		/** Rides the type scale: the spinner is 1em of this text size. Omit to follow the parent. */
		size?: TextSize;
		/** Ink of the arc. Omit to follow the parent's colour. */
		tone?: MessageText;
		/** Seconds per revolution. */
		duration?: number;
		label?: string;
		class?: string;
	}

	let {
		size,
		tone,
		duration = 0.8,
		label = 'Loading',
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<!-- The rotation is SVG (SMIL), not CSS: fractalstyler ships no spin keyframes. -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width="1em"
	height="1em"
	fill="none"
	role="status"
	aria-label={label}
	class={[size, tone, 'shrink-0', className]}
	{...restProps}
>
	<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.2" />
	<circle
		cx="12"
		cy="12"
		r="9"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
		stroke-dasharray="56.5"
		stroke-dashoffset="42"
	>
		<animateTransform
			attributeName="transform"
			type="rotate"
			from="0 12 12"
			to="360 12 12"
			dur="{duration}s"
			repeatCount="indefinite"
		/>
	</circle>
</svg>
