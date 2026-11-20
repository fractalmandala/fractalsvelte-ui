<!-- @component Aspect-ratio framed image with skeleton placeholder, error fallback and optional caption. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luImageOff } from '@fractaldesign/icons/lucide';
	import type { Shape } from '../../../internal/tokens.js';

	type AspectRatio = '1-1' | '16-9' | '4-3' | '3-2' | '21-9';
	type ObjectFit = 'cover' | 'contain' | 'fill' | 'scale-down';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Image source URL. */
		src?: string;
		/** Alternative text description for assistive technologies. */
		alt?: string;
		/** Aspect ratio frame using Fractalstyler frame classes. */
		aspectRatio?: AspectRatio;
		/** How the bitmap scales inside the frame. */
		fit?: ObjectFit;
		/** Corner shape of the image frame. */
		shape?: Shape;
		/** Optional caption displayed underneath in `<figcaption>`. */
		caption?: string;
		/** Custom fallback snippet shown when the image fails or `src` is empty. */
		fallback?: Snippet;
	}

	let {
		src,
		alt = '',
		aspectRatio = '16-9',
		fit = 'cover',
		shape = 'modern',
		caption,
		fallback,
		class: className,
		...rest
	}: Props = $props();

	let status = $state<'loading' | 'loaded' | 'error'>('loading');
	let imgEl = $state<HTMLImageElement | null>(null);

	$effect(() => {
		if (!src) {
			status = 'error';
			return;
		}
		if (imgEl?.complete) {
			status = imgEl.naturalWidth > 0 ? 'loaded' : 'error';
		} else {
			status = 'loading';
		}
	});

	const frameClass = $derived(`frame-${aspectRatio}`);
	const fitClass = $derived(`fit-${fit}`);
</script>

<figure class={['column gap-xs image-figure', className]} {...rest}>
	<div class={['image-frame relative bg-panel border-subtle overflow-hidden', frameClass, shape]}>
		{#if status === 'loading'}
			<div class="cover bone anim-pulse" aria-hidden="true"></div>
		{/if}
		{#if src && status !== 'error'}
			<img
				bind:this={imgEl}
				{src}
				{alt}
				hidden={status === 'loading'}
				class={fitClass}
				onload={() => (status = 'loaded')}
				onerror={() => (status = 'error')}
			/>
		{:else}
			<div class="cover row xcenter ycenter text-muted gap-xs text-sm">
				{#if fallback}
					{@render fallback()}
				{:else}
					<Icon icon={luImageOff} />
					{#if alt}<span>{alt}</span>{/if}
				{/if}
			</div>
		{/if}
	</div>
	{#if caption}
		<figcaption class="text-xs text-muted">{caption}</figcaption>
	{/if}
</figure>
