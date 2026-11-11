<!-- @component Styled media card with video player, title, caption, aspect ratio, poster, and tokenized frame. -->

<script lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klVideo } from '$lib/icons/keylinestroke.js';
	import type { Surface, Border, Shape, Shadow, TextSize, Frame } from '$lib/types.js';

	interface Props extends HTMLVideoAttributes {
		/** Video file URL. */
		src?: string;
		poster?: string;
		/** Heading shown above the video. */
		title?: string;
		/** Line under the title. */
		caption?: string;
		/** Shows the browser's playback controls. */
		controls?: boolean;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		/** Aspect ratio, as one of the frame classes. */
		ratio?: Frame;
		preload?: 'auto' | 'metadata' | 'none';
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
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
		ratio = 'frame-16-9',
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

<figure class="box gap-sm wfull {surface} {border} {shape} {shadow} {padding} {textsize} {className}">
	{#if title || caption}
		<figcaption class="row ycenter gap-sm">
			<span class="btn-icon inline-flex row xcenter ycenter h-lg mincurved state-hover text-secondary" aria-hidden="true">
				<Icon icon={klVideo} />
			</span>
			<div class="box grow min0">
				{#if title}<span class="text-sm lh12 weight-500 text-primary">{title}</span>{/if}
				{#if caption}<span class="text-xs lh12 text-secondary">{caption}</span>{/if}
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
		class="block wfull fit-cover bg-black {ratio} {shape}"
		aria-label={restProps['aria-label'] ?? title}
	>
		{@render children?.()}
	</video>
</figure>

