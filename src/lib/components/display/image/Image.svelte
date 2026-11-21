<!-- @component Aspect-ratio framed image with skeleton placeholder, error fallback and optional caption. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luImageOff } from '@fractaldesign/icons/lucide';
	import type {  ChildTextColor, ChildTextSize, Gap, Shape, Surface, TextColor, TextSize  } from '../../../internal/tokens.js';

	type AspectRatio = '1-1' | '16-9' | '4-3' | '3-2' | '21-9';
	type ObjectFit = 'cover' | 'contain' | 'fill' | 'scale-down';

	interface Props extends HTMLAttributes<HTMLElement> {
		src?: string;
		alt?: string;
		aspectRatio?: AspectRatio;
		fit?: ObjectFit;
		shape?: Shape;
		caption?: string;
		fallback?: Snippet;
		surface?: Surface;
		gap?: Gap;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
	}

	let {
		src,
		alt = '',
		aspectRatio = '16-9',
		fit = 'cover',
		shape = 'modern',
		caption,
		fallback,
		surface = 'paneled',
		gap = 'gap-xs',
		textSize = 'text-sm',
		textColor = 'text-muted',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
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

<figure class={['column image-figure', gap, className]} {...rest}>
	<div class={['image-frame relative overflow-hidden', surface, frameClass, shape]}>
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
			<div class={['cover row xcenter ycenter gap-xs', textSize, textColor]}>
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
		<figcaption class={[childTextSize, childTextColor]}>{caption}</figcaption>
	{/if}
</figure>
