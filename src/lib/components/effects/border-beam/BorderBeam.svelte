<!-- @component A single beam of light that travels around the border of its parent. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Seconds for one trip around the border. */
		duration?: number;
		/** Length of the beam along the border, as a CSS share of the conic gradient. */
		size?: string;
		/** Seconds to wait before the first trip. */
		delay?: number;
		/** Travels the other way around the border. */
		reverse?: boolean;
	}

	let {
		duration = 8,
		size = '8%',
		delay = 0,
		reverse = false,
		class: klass,
		...rest
	}: Props = $props();
</script>

<div
	class={['cover', 'pointer-none', 'ring-grad', 'ring-beam', 'spin', reverse && 'reverse', klass]}
	aria-hidden="true"
	{@attach vars({ spin: duration, 'spin-delay': delay, 'beam-size': size })}
	{...rest}
></div>
