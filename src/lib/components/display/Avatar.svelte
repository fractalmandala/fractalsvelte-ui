<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Shape } from '../../types';

	export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src?: string;
		alt?: string;
		initials?: string;
		status?: AvatarStatus;
		size?: Size;
		shape?: Shape;
		class?: string;
		fallback?: Snippet;
	}

	let {
		src,
		alt = 'Avatar',
		initials,
		status,
		size = 'md',
		shape = 'pill',
		class: className = '',
		fallback,
		...restProps
	}: Props = $props();

	let imgError = $state(false);

	function handleImgError() {
		imgError = true;
	}
</script>

<div
	class="f-avatar {className}"
	data-size={size}
	data-shape={shape}
	{...restProps}
>
	{#if src && !imgError}
		<img
			{src}
			{alt}
			class="f-avatar-img"
			onerror={handleImgError}
		/>
	{:else if initials}
		<span class="f-avatar-initials">{initials}</span>
	{:else if fallback}
		<span class="f-avatar-fallback">
			{@render fallback()}
		</span>
	{:else}
		<!-- Default user icon silhouette -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="f-avatar-icon"
			aria-hidden="true"
		>
			<path
				d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
			/>
		</svg>
	{/if}

	{#if status}
		<span
			class="f-avatar-status"
			data-status={status}
			aria-label={`Status: ${status}`}
		></span>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-avatar {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			vertical-align: middle;
			background: var(--f-sunken);
			color: var(--f-text-muted);
			border: 1px solid var(--f-border);
			box-sizing: border-box;
			overflow: visible;
			flex-shrink: 0;
			user-select: none;
		}

		.f-avatar-img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: inherit;
			display: block;
		}

		.f-avatar-initials {
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--f-text);
			line-height: 1;
		}

		.f-avatar-fallback,
		.f-avatar-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 60%;
			height: 60%;
			color: var(--f-text-subtle);
		}

		/* Shapes */
		.f-avatar[data-shape='pill'] {
			border-radius: var(--f-radius-full);
		}
		.f-avatar[data-shape='rounded'] {
			border-radius: var(--f-radius-md);
		}
		.f-avatar[data-shape='square'] {
			border-radius: 0;
		}

		/* Sizes */
		.f-avatar[data-size='xs'] {
			width: 24px;
			height: 24px;
			font-size: 10px;
		}
		.f-avatar[data-size='sm'] {
			width: 32px;
			height: 32px;
			font-size: var(--f-text-xs);
		}
		.f-avatar[data-size='md'] {
			width: 40px;
			height: 40px;
			font-size: var(--f-text-sm);
		}
		.f-avatar[data-size='lg'] {
			width: 48px;
			height: 48px;
			font-size: var(--f-text-base);
		}
		.f-avatar[data-size='xl'] {
			width: 60px;
			height: 60px;
			font-size: var(--f-text-xl);
		}

		/* Status Dot */
		.f-avatar-status {
			position: absolute;
			bottom: -1px;
			right: -1px;
			border-radius: var(--f-radius-full);
			box-sizing: border-box;
			border: 2px solid var(--f-surface);
			z-index: 1;
		}

		.f-avatar[data-size='xs'] .f-avatar-status {
			width: 8px;
			height: 8px;
			border-width: 1.5px;
		}
		.f-avatar[data-size='sm'] .f-avatar-status {
			width: 10px;
			height: 10px;
			border-width: 2px;
		}
		.f-avatar[data-size='md'] .f-avatar-status {
			width: 12px;
			height: 12px;
			border-width: 2px;
		}
		.f-avatar[data-size='lg'] .f-avatar-status {
			width: 14px;
			height: 14px;
			border-width: 2.5px;
		}
		.f-avatar[data-size='xl'] .f-avatar-status {
			width: 16px;
			height: 16px;
			border-width: 3px;
		}

		.f-avatar-status[data-status='online'] {
			background-color: var(--f-success);
		}
		.f-avatar-status[data-status='busy'] {
			background-color: var(--f-danger);
		}
		.f-avatar-status[data-status='away'] {
			background-color: var(--f-warning);
		}
		.f-avatar-status[data-status='offline'] {
			background-color: var(--f-text-subtle);
		}
	}
</style>
