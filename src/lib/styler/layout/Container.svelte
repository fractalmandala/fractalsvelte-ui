<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { MEASURE, type FsMeasure } from '../classes';

	/**
	 * fractalstyler's page measures: .content-section in its narrow modes
	 * (640 / 720px, responsive padding) and .prose (the 65ch reading measure).
	 */
	export type ContainerSize = FsMeasure;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: ContainerSize;
		class?: string;
		children?: Snippet;
	}

	let { size = 'wide', class: className = '', children, ...restProps }: Props = $props();
</script>

<div class="{MEASURE[size]} {className}" {...restProps}>
	{@render children?.()}
</div>
