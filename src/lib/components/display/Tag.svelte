<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Size } from '../../types';

	export type TagVariant = 'primary' | 'secondary' | 'soft' | 'outline' | 'surface';
	export type TagSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: TagVariant;
		size?: TagSize;
		removable?: boolean;
		removeLabel?: string;
		onremove?: (event: MouseEvent) => void;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		variant = 'soft',
		size = 'md',
		removable = false,
		removeLabel = 'Remove tag',
		onremove,
		class: className = '',
		icon,
		children,
		...restProps
	}: Props = $props();

	function handleRemove(event: MouseEvent) {
		event.stopPropagation();
		onremove?.(event);
	}
</script>

<span
	class="f-tag {className}"
	data-variant={variant}
	data-size={size}
	data-removable={removable ? '' : undefined}
	{...restProps}
>
	{#if icon}
		<span class="f-tag-icon" aria-hidden="true">
			{@render icon()}
		</span>
	{/if}
	{#if children}
		<span class="f-tag-label">
			{@render children()}
		</span>
	{/if}
	{#if removable}
		<button
			type="button"
			class="f-tag-remove"
			aria-label={removeLabel}
			title={removeLabel}
			onclick={handleRemove}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	{/if}
</span>

<style>
	@layer fractalsvelte-ui.components {
		.f-tag {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-family: inherit;
			font-weight: 500;
			line-height: 1;
			border-radius: var(--f-radius-sm);
			border: 1px solid transparent;
			box-sizing: border-box;
			user-select: none;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		.f-tag-label {
			display: inline-flex;
			align-items: center;
			white-space: nowrap;
		}

		.f-tag-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		/* Sizes */
		.f-tag[data-size='sm'] {
			height: 22px;
			font-size: var(--f-text-xs);
			padding: 0 var(--f-space-xs);
			gap: 4px;
		}

		.f-tag[data-size='md'] {
			height: 26px;
			font-size: var(--f-text-sm);
			padding: 0 var(--f-space-sm);
			gap: 6px;
		}

		.f-tag[data-size='lg'] {
			height: 32px;
			font-size: var(--f-text-base);
			padding: 0 var(--f-space-md);
			gap: 8px;
		}

		/* Remove Button */
		.f-tag-remove {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			margin-left: 2px;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-xs);
			color: currentColor;
			opacity: 0.65;
			cursor: pointer;
			line-height: 1;
			transition: opacity var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-tag-remove:hover {
			opacity: 1;
			background: rgba(0, 0, 0, 0.08);
		}

		:global([data-theme='dark']) .f-tag-remove:hover {
			background: rgba(255, 255, 255, 0.12);
		}

		.f-tag-remove:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
			opacity: 1;
		}

		.f-tag[data-size='sm'] .f-tag-remove {
			width: 14px;
			height: 14px;
		}
		.f-tag[data-size='md'] .f-tag-remove {
			width: 16px;
			height: 16px;
		}
		.f-tag[data-size='lg'] .f-tag-remove {
			width: 18px;
			height: 18px;
		}

		/* Variants */
		.f-tag[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-color: var(--f-primary);
		}

		.f-tag[data-variant='secondary'] {
			background: var(--f-sunken);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-tag[data-variant='soft'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border-color: transparent;
		}

		.f-tag[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}

		.f-tag[data-variant='surface'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}
	}
</style>
