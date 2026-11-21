<!-- @component An overlapped stack of avatars, with a "+N" overflow and a spring that spreads the stack on hover. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { SpringValue, vars } from '../../../motion/index.js';
	import Avatar from '../avatar/Avatar.svelte';
	
	import { setAvatarContext, type AvatarStatus } from '../avatar/context.js';
	import type { Shape, Size } from '../../../internal/tokens.js';

	interface AvatarItem {
		src?: string;
		alt?: string;
		name: string;
		status?: AvatarStatus;
	}

	interface Props extends HTMLAttributes<HTMLElement> {
		items?: AvatarItem[];
		max?: number;
		size?: Size;
		shape?: Shape;
		spread?: boolean;
		children?: Snippet;
	}

	let {
		items,
		max,
		size = 'h-lg',
		shape = 'round',
		spread = true,
		class: className,
		children,
		...rest
	}: Props = $props();

	setAvatarContext({
		get size() {
			return size;
		},
		get shape() {
			return shape;
		}
	});

	const visible = $derived(items ? (max !== undefined ? items.slice(0, max) : items) : []);
	const overflow = $derived(items && max !== undefined ? Math.max(0, items.length - max) : 0);

	const spreadSpring = new SpringValue(0, 'snappy');

	function onpointerenter(): void {
		if (spread) spreadSpring.target = 1;
	}
	function onpointerleave(): void {
		spreadSpring.target = 0;
	}

	const classes = $derived([
		'avatar-group',
		'row',
		'ycenter',
		'gap-overlap',
		size,
		shape,
		spread && 'spread',
		className
	]);
</script>

<div
	class={classes}
	{@attach vars({ spread: spreadSpring.current })}
	{onpointerenter}
	{onpointerleave}
	{...rest}
>
	{#if items}
		{#each visible as person, i (person.name + String(i))}
			<Avatar src={person.src} alt={person.alt} name={person.name} status={person.status} />
		{/each}
		{#if overflow > 0}
			<span class={['avatar', 'avatar-more', size, shape]} aria-label="{overflow} more">
				+{overflow}
			</span>
		{/if}
	{:else}
		{@render children?.()}
	{/if}
</div>
