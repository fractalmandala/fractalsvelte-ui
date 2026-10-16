<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';
	import type { FsSize } from '../types';

	export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';
	export type AvatarShape = 'circle' | 'rounded' | 'square';

	interface Props extends SVGAttributes<SVGSVGElement> {
		src?: string;
		alt?: string;
		initials?: string;
		status?: AvatarStatus;
		/** Control height: sm 20 · md 24 · bs 28 · lg 32px */
		size?: FsSize;
		shape?: AvatarShape;
		class?: string;
		/** Rendered beside the avatar when there is no image or initials. */
		fallback?: Snippet;
	}

	let {
		src,
		alt = 'Avatar',
		initials,
		status,
		size = 'lg',
		shape = 'circle',
		class: className = '',
		fallback,
		...restProps
	}: Props = $props();

	let imgError = $state(false);
	const uid = $props.id();

	// fractalstyler has no avatar: the whole thing is one SVG, square by its
	// viewBox, sized by a control-height class, inked by text-* classes.
	const HEIGHT_CLASSES: Record<FsSize, string> = { sm: 'h-sm', md: 'h-md', bs: 'h-bs', lg: 'h-lg' };
	const STATUS_CLASSES: Record<AvatarStatus, string> = {
		online: 'text-success',
		busy: 'text-danger',
		away: 'text-warning',
		offline: 'text-muted'
	};
	const rx = $derived(shape === 'circle' ? 50 : shape === 'rounded' ? 12 : 0);
	const showImage = $derived(Boolean(src) && !imgError);
</script>

{#if !showImage && !initials && fallback}
	{@render fallback()}
{:else}
	<svg
		viewBox="0 0 100 100"
		class="shrink-0 {HEIGHT_CLASSES[size]} {className}"
		role="img"
		aria-label={status ? `${alt} (${status})` : alt}
		{...restProps}
	>
		<defs>
			<clipPath id="{uid}-clip"><rect width="100" height="100" {rx} /></clipPath>
		</defs>
		<g clip-path="url(#{uid}-clip)">
			<rect width="100" height="100" class="text-muted" fill="currentColor" opacity="0.35" />
			{#if showImage}
				<image
					href={src}
					width="100"
					height="100"
					preserveAspectRatio="xMidYMid slice"
					onerror={() => (imgError = true)}
				/>
			{:else if initials}
				<text
					x="50"
					y="50"
					text-anchor="middle"
					dominant-baseline="central"
					font-size="40"
					font-weight="600"
					class="text-primary"
					fill="currentColor">{initials.slice(0, 2).toUpperCase()}</text
				>
			{:else}
				<path
					class="text-secondary"
					fill="currentColor"
					d="M50 52c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-13 0-40 7-40 20v18h80V82c0-13-27-20-40-20z"
				/>
			{/if}
		</g>
		{#if status}
			<circle cx="84" cy="84" r="13" class="text-inverse" fill="currentColor" />
			<circle cx="84" cy="84" r="9" class={STATUS_CLASSES[status]} fill="currentColor" />
		{/if}
	</svg>
{/if}
