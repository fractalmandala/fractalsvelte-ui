<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types';

	export type BannerVariant = 'filled' | 'subtle' | 'outline';

	interface Props extends HTMLAttributes<HTMLElement> {
		intent?: Intent;
		variant?: BannerVariant;
		sticky?: boolean;
		dismissible?: boolean;
		onclose?: () => void;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		intent = 'info',
		variant = 'subtle',
		sticky = false,
		dismissible = false,
		onclose,
		class: className = '',
		icon,
		action,
		children,
		...restProps
	}: Props = $props();

	let closed = $state(false);

	function handleDismiss() {
		closed = true;
		onclose?.();
	}
</script>

{#if !closed}
	<aside
		role="region"
		aria-label="Announcement"
		class="f-banner {className}"
		data-intent={intent}
		data-variant={variant}
		data-sticky={sticky ? '' : undefined}
		{...restProps}
	>
		<div class="f-banner-inner">
			<div class="f-banner-content">
				{#if icon}
					<span class="f-banner-icon" aria-hidden="true">
						{@render icon()}
					</span>
				{/if}
				{#if children}
					<div class="f-banner-text">
						{@render children()}
					</div>
				{/if}
			</div>

			<div class="f-banner-actions">
				{#if action}
					<div class="f-banner-action">
						{@render action()}
					</div>
				{/if}

				{#if dismissible}
					<button
						type="button"
						class="f-banner-dismiss"
						aria-label="Dismiss banner"
						title="Dismiss"
						onclick={handleDismiss}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</aside>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-banner {
			width: 100%;
			box-sizing: border-box;
			border-bottom: 1px solid transparent;
			font-family: inherit;
			font-size: var(--f-text-sm);
			line-height: 1.4;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-banner[data-sticky] {
			position: sticky;
			top: 0;
			z-index: 40;
		}

		.f-banner-inner {
			max-width: 1200px;
			margin: 0 auto;
			padding: var(--f-space-xs) var(--f-space-lg);
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-md);
		}

		.f-banner-content {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			min-width: 0;
		}

		.f-banner-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.f-banner-text {
			font-weight: 500;
		}

		.f-banner-actions {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			flex-shrink: 0;
		}

		.f-banner-dismiss {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 4px;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-sm);
			color: inherit;
			opacity: 0.7;
			cursor: pointer;
			transition: opacity var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-banner-dismiss:hover {
			opacity: 1;
			background: rgba(0, 0, 0, 0.08);
		}

		:global([data-theme='dark']) .f-banner-dismiss:hover {
			background: rgba(255, 255, 255, 0.12);
		}

		.f-banner-dismiss:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: 1px;
		}

		/* Subtle variant */
		.f-banner[data-variant='subtle'][data-intent='info'] {
			background: var(--f-info-bg);
			color: var(--f-info-text);
			border-color: rgba(59, 130, 246, 0.25);
		}
		.f-banner[data-variant='subtle'][data-intent='success'] {
			background: var(--f-success-bg);
			color: var(--f-success-text);
			border-color: rgba(16, 185, 129, 0.25);
		}
		.f-banner[data-variant='subtle'][data-intent='warning'] {
			background: var(--f-warning-bg);
			color: var(--f-warning-text);
			border-color: rgba(245, 158, 11, 0.25);
		}
		.f-banner[data-variant='subtle'][data-intent='danger'] {
			background: var(--f-danger-bg);
			color: var(--f-danger-text);
			border-color: rgba(239, 68, 68, 0.25);
		}

		/* Filled variant */
		.f-banner[data-variant='filled'][data-intent='info'] {
			background: var(--f-info);
			color: #ffffff;
			border-color: var(--f-info);
		}
		.f-banner[data-variant='filled'][data-intent='success'] {
			background: var(--f-success);
			color: #ffffff;
			border-color: var(--f-success);
		}
		.f-banner[data-variant='filled'][data-intent='warning'] {
			background: var(--f-warning);
			color: #18181b;
			border-color: var(--f-warning);
		}
		.f-banner[data-variant='filled'][data-intent='danger'] {
			background: var(--f-danger);
			color: #ffffff;
			border-color: var(--f-danger);
		}

		/* Outline variant */
		.f-banner[data-variant='outline'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}
	}
</style>
