<!-- @component Enhanced image component with aspect ratio, object-fit, fallback snippet, and shape. -->

<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klImage } from '$lib/icons/keylinestroke.js';
	import type { Shape, Shadow, Frame } from '$lib/types.js';

	interface Props extends HTMLImgAttributes {
		/** Text that describes the image, read by screen readers and shown in the fallback. */
		alt?: string;
		/** Image URL. Without one, or if it fails, the fallback shows. */
		src?: string;
		/** Aspect ratio, as one of the frame classes. */
		ratio?: Frame;
		fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
		shape?: Shape;
		shadow?: Shadow;
		/** `lazy` waits until the image is near the viewport; `eager` loads it straight away. */
		loading?: 'lazy' | 'eager';
		fallback?: Snippet;
		class?: string;
	}

	let {
		alt = '',
		src,
		ratio,
		fit = 'cover',
		shape = 'modern',
		shadow = 'shad-none',
		loading = 'lazy',
		fallback,
		onerror,
		class: className = '',
		...restProps
	}: Props = $props();

	let failed = $state(false);
</script>

{#if failed || !src}
	<div
		class="box xcenter ycenter wfull pad-bs border-dashed state-hover text-secondary {ratio ?? ''} {shape} {shadow} {className}"
		role="img"
		aria-label={alt}
	>
		{#if fallback}
			{@render fallback()}
		{:else}
			<div class="row ycenter gap-xs text-xs">
				<Icon icon={klImage} />
				<span>{alt || 'Image unavailable'}</span>
			</div>
		{/if}
	</div>
{:else}
	<img
		{...restProps}
		{src}
		{alt}
		{loading}
		class="{ratio ? `wfull ${ratio}` : ''} fit-{fit} {shape} {shadow} {className}"
		onerror={(e) => {
			failed = true;
			onerror?.(e);
		}}
	/>
{/if}

