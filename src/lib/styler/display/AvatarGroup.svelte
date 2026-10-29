<!-- @component A row or column of avatars, overlapping or spaced apart, with a "+N" chip for hidden members. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface } from '../types';
	import Avatar, { type AvatarStatus, type AvatarShape } from './Avatar.svelte';

	/** Spacing between avatars, from overlapping, to touching, to increasing gaps. */
	export type AvatarGroupGap = 'overlap' | 'touch' | 'xs' | 'sm' | 'md' | 'lg';

	export interface AvatarItem {
		src?: string;
		initials?: string;
		alt?: string;
		status?: AvatarStatus;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		avatars?: AvatarItem[];
		/** Avatars shown before the rest collapse into "+N" */
		max?: number;
		/** Extra hidden members added to the "+N" count */
		excess?: number;
		size?: Size;
		shape?: AvatarShape;
		surface?: Surface;
		/** Spacing between avatars: `overlap` stacks them, `touch` sets them edge to edge, `xs`…`lg` add a growing gap. */
		gap?: AvatarGroupGap;
		direction?: 'horizontal' | 'vertical';
		class?: string;
		children?: Snippet;
		overflowSnippet?: Snippet<[{ count: number }]>;
	}

	let {
		avatars = [],
		max = avatars.length,
		excess = 0,
		size = 'h-lg',
		shape = 'circle',
		surface = 'bg-sunken',
		gap = 'overlap',
		direction = 'horizontal',
		class: className = '',
		children,
		overflowSnippet,
		...restProps
	}: Props = $props();

	const shown = $derived(avatars.slice(0, max));
	const hidden = $derived(Math.max(0, avatars.length - max) + excess);
</script>

<div
	class="avatar-group {direction === 'vertical' ? 'box' : 'row'} ycenter {shape} gap-{gap} {className}"
	style:--avatar-size="var(--height-{size.replace('h-', '')})"
	role="group"
	{...restProps}
>
	{#each shown as a, i (i)}
		<Avatar {...a} {size} {shape} {surface} />
	{/each}
	{@render children?.()}
	{#if hidden > 0}
		{#if overflowSnippet}
			{@render overflowSnippet({ count: hidden })}
		{:else}
			<span class="avatar-more row xcenter ycenter shrink-0 ink-auto {surface}" style:--ink-bg="var(--{surface === 'bg-main' ? 'bg' : surface})" aria-label="{hidden} more">+{hidden}</span>
		{/if}
	{/if}
</div>
