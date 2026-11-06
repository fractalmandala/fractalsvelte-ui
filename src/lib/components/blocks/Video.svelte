<!-- @component Styled media card with video player, title, caption, aspect ratio, poster, and tokenized frame. -->

<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { Icon } from '@fractaldesign/icons';
	import { luVideo } from '@fractaldesign/icons/lucide';
	import type { Surface, Border, Shape, Shadow, Pad, TextSize } from '$lib/types.js';

	interface Props extends HTMLVideoAttributes {
		src?: string;
		poster?: string;
		title?: string;
		caption?: string;
		controls?: boolean;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		ratio?: string;
		preload?: 'auto' | 'metadata' | 'none';
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		padding?: Pad;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		src,
		poster,
		title,
		caption,
		controls = true,
		autoplay = false,
		muted = false,
		loop = false,
		ratio = '16 / 9',
		preload = 'metadata',
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow = 'shad-none',
		padding = 'pad-sm',
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<figure
	class="video-card box gap-sm {surface} {border} {shape} {shadow} {padding} {textsize} {className}"
>
	{#if title || caption}
		<figcaption class="row ycenter gap-sm">
			<span class="icon-wrap row ycenter xcenter text-secondary" aria-hidden="true">
				<Icon icon={luVideo} />
			</span>
			<div class="box gap-none grow min0">
				{#if title}<span class="video-title text-primary font-medium">{title}</span>{/if}
				{#if caption}<span class="video-caption text-secondary text-xs">{caption}</span>{/if}
			</div>
		</figcaption>
	{/if}
	<video
		{...restProps}
		{src}
		{poster}
		{controls}
		{autoplay}
		{muted}
		{loop}
		{preload}
		class="video-element wfull {shape}"
		style:aspect-ratio={ratio}
		aria-label={restProps['aria-label'] ?? title}
	>
		{@render children?.()}
	</video>
</figure>

<style>
	.video-card {
		margin: 0;
		width: 100%;
	}

	.icon-wrap {
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm, 4px);
		background: var(--bg-sunken, #f4f4f4);
		flex-shrink: 0;
	}

	.video-title {
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.video-caption {
		font-size: 0.75rem;
		line-height: 1.25;
	}

	.video-element {
		display: block;
		object-fit: cover;
		background: #000;
		outline: none;
	}
</style>
