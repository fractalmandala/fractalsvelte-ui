<!-- @component A portrait that falls back from an image to initials, then to an icon, with an optional status dot. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luUser } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import type { Size } from '../../../internal/tokens.js';
	import { avatarSizeClass, hueFromName, initialsFromName } from './avatar.js';
	import { getAvatarContext, type AvatarShape, type AvatarStatus } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The portrait. When it fails to load, the avatar falls back to initials, then to the icon. */
		src?: string;
		/** Alternative text for the portrait. Defaults to `name`. */
		alt?: string;
		/** The person's name. Used for initials, the deterministic hue, and the accessible label. */
		name?: string;
		/** The avatar's size. Inherited from an enclosing `AvatarGroup` when omitted. */
		size?: Size;
		/** The corner treatment: a circle, a rounded square, or a square. Inherited from an enclosing `AvatarGroup` when omitted. */
		shape?: AvatarShape;
		/** A presence indicator at the bottom-right corner. */
		status?: AvatarStatus;
		/** The fallback icon used when there is no image and no name to draw initials from. */
		icon?: IconData;
	}

	let {
		src,
		alt,
		name,
		size,
		shape,
		status,
		icon = luUser,
		class: klass,
		...rest
	}: Props = $props();

	const group = getAvatarContext();
	const resolvedSize = $derived(size ?? group?.size ?? 'md');
	const resolvedShape = $derived(shape ?? group?.shape ?? 'circle');
	const initials = $derived(name ? initialsFromName(name) : '');
	const hue = $derived(name ? hueFromName(name) : undefined);

	let failedSrc = $state<string | undefined>();
	const showImage = $derived(!!src && failedSrc !== src);

	const statusLabel: Record<AvatarStatus, string> = {
		online: 'Online',
		away: 'Away',
		busy: 'Busy',
		offline: 'Offline'
	};
	const statusClass: Record<AvatarStatus, string> = {
		online: 'text-success',
		away: 'text-warning',
		busy: 'text-danger',
		offline: 'text-muted'
	};

	const label = $derived(
		[alt || name || 'Avatar', status ? statusLabel[status] : '']
			.filter(Boolean)
			.join(', ')
	);

	const shapeClass = { circle: 'round', rounded: 'rounded', square: 'square' } as const;
	const classes = $derived(['avatar', avatarSizeClass[resolvedSize], shapeClass[resolvedShape], klass]);
</script>

<span
	class={classes}
	role="img"
	aria-label={label}
	{@attach vars({ 'avatar-hue': hue })}
	{...rest}
>
	{#if showImage}
		<img {src} alt="" class="fit-cover" onerror={() => (failedSrc = src)} />
	{:else if initials}
		{initials}
	{:else}
		<Icon {icon} />
	{/if}
	{#if status}
		<span class={['avatar-status', 'dot', statusClass[status]]}></span>
	{/if}
</span>
