<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
	export type SkeletonAnimation = 'pulse' | 'none';

	interface Props extends SVGAttributes<SVGSVGElement> {
		variant?: SkeletonVariant;
		animation?: SkeletonAnimation;
		/** Any SVG length: a number is px, a string can be %, em, rem… */
		width?: string | number;
		height?: string | number;
		/** text variant: number of lines; the last one is shortened */
		lines?: number;
		class?: string;
	}

	let {
		variant = 'text',
		animation = 'pulse',
		width,
		height,
		lines = 1,
		class: className = '',
		...restProps
	}: Props = $props();

	// Placeholder geometry is SVG attributes; the pulse is SMIL, not a CSS keyframe.
	const defaults = $derived.by(() => {
		switch (variant) {
			case 'circular':
				return { w: height ?? width ?? '2.5em', h: height ?? width ?? '2.5em', rx: '50%' };
			case 'rectangular':
				return { w: width ?? '100%', h: height ?? '6em', rx: '0' };
			case 'rounded':
				return { w: width ?? '100%', h: height ?? '6em', rx: '0.5em' };
			default:
				return { w: width ?? '100%', h: height ?? '1em', rx: '0.25em' };
		}
	});
</script>

{#snippet block(w: string | number, h: string | number, rx: string)}
	<svg width={w} height={h} class="text-muted shrink-0 {className}" aria-hidden="true" {...restProps}>
		<rect width="100%" height="100%" {rx} fill="currentColor" opacity="0.25">
			{#if animation === 'pulse'}
				<animate attributeName="opacity" values="0.25;0.1;0.25" dur="1.6s" repeatCount="indefinite" />
			{/if}
		</rect>
	</svg>
{/snippet}

{#if variant === 'text' && lines > 1}
	<div class="box gap-xs wfull" aria-hidden="true">
		{#each Array.from({ length: lines }) as _, i (i)}
			{@render block(i === lines - 1 && !width ? '70%' : defaults.w, defaults.h, defaults.rx)}
		{/each}
	</div>
{:else}
	{@render block(defaults.w, defaults.h, defaults.rx)}
{/if}
