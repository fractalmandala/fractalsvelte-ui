<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		intent?: Intent;
		title?: string;
		description?: string;
		dismissible?: boolean;
		onclose?: () => void;
		class?: string;
		icon?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		intent = 'info',
		title,
		description,
		dismissible = false,
		onclose,
		class: className = '',
		icon,
		actions,
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
	<div
		role="alert"
		class="f-alert {className}"
		data-intent={intent}
		{...restProps}
	>
		<div class="f-alert-icon" aria-hidden="true">
			{#if icon}
				{@render icon()}
			{:else if intent === 'success'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			{:else if intent === 'warning'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
					/>
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			{:else if intent === 'danger'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="15" y1="9" x2="9" y2="15" />
					<line x1="9" y1="9" x2="15" y2="15" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="16" x2="12" y2="12" />
					<line x1="12" y1="8" x2="12.01" y2="8" />
				</svg>
			{/if}
		</div>

		<div class="f-alert-content">
			{#if title}
				<h5 class="f-alert-title">{title}</h5>
			{/if}
			{#if description}
				<div class="f-alert-description">{description}</div>
			{/if}
			{#if children}
				<div class="f-alert-body">
					{@render children()}
				</div>
			{/if}
			{#if actions}
				<div class="f-alert-actions">
					{@render actions()}
				</div>
			{/if}
		</div>

		{#if dismissible}
			<button
				type="button"
				class="f-alert-dismiss"
				aria-label="Dismiss alert"
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
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-alert {
			position: relative;
			display: flex;
			align-items: flex-start;
			gap: var(--f-space-md);
			padding: var(--f-space-md) var(--f-space-lg);
			border-radius: var(--f-radius-md);
			border: 1px solid transparent;
			box-sizing: border-box;
			font-family: inherit;
			line-height: 1.5;
		}

		.f-alert-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			margin-top: 2px;
		}

		.f-alert-content {
			flex: 1 1 auto;
			min-width: 0;
		}

		.f-alert-title {
			margin: 0 0 var(--f-space-2xs) 0;
			font-size: var(--f-text-sm);
			font-weight: 600;
			line-height: 1.3;
			color: inherit;
		}

		.f-alert-description {
			font-size: var(--f-text-sm);
			opacity: 0.9;
		}

		.f-alert-body {
			font-size: var(--f-text-sm);
			margin-top: var(--f-space-2xs);
		}

		.f-alert-actions {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			margin-top: var(--f-space-sm);
		}

		.f-alert-dismiss {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 2px;
			margin: -2px -4px 0 0;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-sm);
			color: inherit;
			opacity: 0.65;
			cursor: pointer;
			flex-shrink: 0;
			transition: opacity var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-alert-dismiss:hover {
			opacity: 1;
			background: rgba(0, 0, 0, 0.08);
		}

		:global([data-theme='dark']) .f-alert-dismiss:hover {
			background: rgba(255, 255, 255, 0.12);
		}

		.f-alert-dismiss:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: 1px;
		}

		/* Intents */
		.f-alert[data-intent='info'] {
			background: var(--f-info-bg);
			color: var(--f-info-text);
			border-color: rgba(59, 130, 246, 0.25);
		}

		.f-alert[data-intent='success'] {
			background: var(--f-success-bg);
			color: var(--f-success-text);
			border-color: rgba(16, 185, 129, 0.25);
		}

		.f-alert[data-intent='warning'] {
			background: var(--f-warning-bg);
			color: var(--f-warning-text);
			border-color: rgba(245, 158, 11, 0.25);
		}

		.f-alert[data-intent='danger'] {
			background: var(--f-danger-bg);
			color: var(--f-danger-text);
			border-color: rgba(239, 68, 68, 0.25);
		}
	}
</style>
