<!-- @component Slow drifting blurred colour fields, used as a section background, with children on top. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Strength of the colour fields, from 0 (none) to 1 (strong). */
		intensity?: number;
		/** Seconds for one drift cycle of the fields. */
		speed?: number;
		/** Content rendered on top of the aurora. */
		children?: Snippet;
	}

	let {
		intensity = 0.45,
		speed = 18,
		class: klass,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={['aurora', klass]}
	{@attach vars({ 'aurora-intensity': intensity, aurora: speed })}
	{...rest}
>
	{@render children?.()}
</div>
