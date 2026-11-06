<!-- @component Enhanced image component with aspect ratio, object-fit, fallback snippet, and shape. -->

<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { Icon } from '@fractaldesign/icons';
	import { luImage } from '@fractaldesign/icons/lucide';
	import type { Shape, Shadow } from '$lib/types.js';

	interface Props extends HTMLImgAttributes {
		alt?: string;
		src?: string;
		ratio?: string;
		fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
		shape?: Shape;
		shadow?: Shadow;
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
		class="img-fallback box xcenter ycenter text-secondary {shape} {shadow} {className}"
		style:aspect-ratio={ratio}
		role="img"
		aria-label={alt}
	>
		{#if fallback}
			{@render fallback()}
		{:else}
			<div class="row ycenter gap-xs text-xs">
				<Icon icon={luImage} />
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
		class="img-element shape {shape} {shadow} {className}"
		style:aspect-ratio={ratio}
		style:object-fit={fit}
		onerror={(e) => {
			failed = true;
			onerror?.(e);
		}}
	/>
{/if}

<style>
	.img-element {
		display: block;
		max-width: 100%;
		height: auto;
	}

	.img-fallback {
		width: 100%;
		min-height: 4rem;
		border: 1px dashed var(--border-strong, #ccc);
		background: var(--bg-sunken, #f4f4f4);
		padding: 1rem;
	}
</style>
