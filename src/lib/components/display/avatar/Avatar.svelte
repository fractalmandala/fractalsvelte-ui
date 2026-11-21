<!-- @component A portrait that falls back from an image to initials, then to an icon, with an optional status dot. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luUser } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import { hueFromName, initialsFromName } from './avatar.js';
	import { getAvatarContext, type AvatarStatus } from './context.js';
	import type { Shape, Size } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		src?: string;
		alt?: string;
		name?: string;
		size?: Size;
		shape?: Shape;
		status?: AvatarStatus;
		icon?: IconData;
		onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
	}

	let {
		src,
		alt,
		name,
		size,
		shape = 'round',
		status,
		icon = luUser,
		onStatusChange,
		class: className,
		...rest
	}: Props = $props();

	const group = getAvatarContext();
	const resolvedSize = $derived(size ?? group?.size ?? 'h-lg');
	const resolvedShape = $derived(shape ?? group?.shape ?? 'round');
	const initials = $derived(name ? initialsFromName(name) : '');
	const hue = $derived(name ? hueFromName(name) : undefined);

	let failedSrc = $state<string | undefined>();
	let lastReportedSrc: string | undefined;
	const showImage = $derived(!!src && failedSrc !== src);

	$effect(() => {
		if (!src) return;
		if (src !== lastReportedSrc) {
			lastReportedSrc = src;
			onStatusChange?.('loading');
		}
	});

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

		const classes = $derived(['avatar', resolvedSize, resolvedShape, className]);
</script>

<span
	class={classes}
	role="img"
	aria-label={label}
	{@attach vars({ 'avatar-hue': hue })}
	{...rest}
>
	{#if showImage}
		<img
			{src}
			alt=""
			class="fit-cover"
			onload={() => onStatusChange?.('loaded')}
			onerror={() => {
				failedSrc = src;
				onStatusChange?.('error');
			}}
		/>
	{:else if initials}
		{initials}
	{:else}
		<Icon {icon} />
	{/if}
	{#if status}
		<span class={['avatar-status', 'dot', statusClass[status]]}></span>
	{/if}
</span>
