<!-- @component A centred wrapper that caps content at a maximum width. -->

<script lang="ts" module>
	export type ContainerSize = 'half' | 'wide' | 'full' | 'fluid' | 'prose';
	export const MEASURE: Record<ContainerSize, string> = {
		half: 'content-section narrow-half',
		wide: 'content-section narrow-wide',
		full: 'content-section narrow-full',
		fluid: 'content-section',
		prose: 'prose'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * fractalstyler's page measures: .content-section in its narrow modes
	 * (640 / 720px, responsive padding) and .prose (the 65ch reading measure).
	 */

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
