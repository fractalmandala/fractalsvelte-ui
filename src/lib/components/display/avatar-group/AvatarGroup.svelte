<!-- @component An overlapped stack of avatars, with a "+N" overflow and a spring that spreads the stack on hover. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SpringValue, vars } from '../../../motion/index.js';
	import type { Size } from '../../../internal/tokens.js';
	import Avatar from '../avatar/Avatar.svelte';
	import { avatarSizeClass } from '../avatar/avatar.js';
	import { setAvatarContext, type AvatarShape, type AvatarStatus } from '../avatar/context.js';

	interface AvatarItem {
		/** The portrait URL. */
		src?: string;
		/** Alternative text for the portrait. Defaults to `name`. */
		alt?: string;
		/** The person's name. */
		name: string;
		/** A presence indicator for this member. */
		status?: AvatarStatus;
	}

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The avatars to render. When set, `max` is applied and overflow is shown as "+N". */
		items?: AvatarItem[];
		/** The number of avatars to show before collapsing the rest into a "+N" tile. */
		max?: number;
		/** The size of every member, including the overflow tile. */
		size?: Size;
		/** The corner treatment applied to every member and the overflow tile. */
		shape?: AvatarShape;
		/** Springs the stack apart on hover. Turn off for a still group. */
		spread?: boolean;
		/** Member avatars, used when `items` is omitted. Overflow is not applied to children. */
		children?: Snippet;
	}

	let {
		items,
		max,
		size = 'md',
		shape = 'circle',
		spread = true,
		class: klass,
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
		avatarSizeClass[size],
		shape,
		spread && 'spread',
		klass
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
			<span class={['avatar', 'avatar-more', avatarSizeClass[size], shape]} aria-label="{overflow} more">
				+{overflow}
			</span>
		{/if}
	{:else}
		{@render children?.()}
	{/if}
</div>
