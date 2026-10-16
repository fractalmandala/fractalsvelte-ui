<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		id?: string;
		title?: string;
		message?: string;
		intent?: Intent;
		duration?: number;
		dismissible?: boolean;
		class?: string;
		onclose?: () => void;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		id,
		title,
		message,
		intent = 'info',
		duration = 4000,
		dismissible = true,
		class: className = '',
		onclose,
		action,
		children,
		...restProps
	}: Props = $props();

	let visible = $state(true);
	let progress = $state(100);

	$effect(() => {
		if (duration <= 0) return;

		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
			progress = remaining;

			if (remaining <= 0) {
				clearInterval(interval);
				dismiss();
			}
		}, 30);

		return () => clearInterval(interval);
	});

	function dismiss() {
		visible = false;
		setTimeout(() => {
			onclose?.();
		}, 200);
	}
</script>

{#if visible}
	<div
		class="f-toast {className}"
		data-intent={intent}
		role="status"
		aria-live="polite"
		{...restProps}
	>
		<div class="f-toast-inner">
			<div class="f-toast-icon">
				{#if intent === 'success'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
				{:else if intent === 'warning'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
				{:else if intent === 'danger'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
				{/if}
			</div>

			<div class="f-toast-content">
				{#if title}
					<h5 class="f-toast-title">{title}</h5>
				{/if}
				{#if message}
					<p class="f-toast-message">{message}</p>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if action}
				<div class="f-toast-action">
					{@render action()}
				</div>
			{/if}

			{#if dismissible}
				<button type="button" class="f-toast-close" onclick={dismiss} aria-label="Close notification">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
				</button>
			{/if}
		</div>

		{#if duration > 0}
			<div class="f-toast-progress-track">
				<div class="f-toast-progress-fill" style="width: {progress}%;"></div>
			</div>
		{/if}
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-toast {
			position: relative;
			overflow: hidden;
			width: 100%;
			max-width: 360px;
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			box-shadow: var(--f-shadow-lg);
			box-sizing: border-box;
			animation: f-toast-in var(--f-duration-normal) var(--f-ease);
			transition: opacity var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-toast-inner {
			display: flex;
			align-items: flex-start;
			gap: 0.75rem;
			padding: 0.85rem 1rem;
		}

		.f-toast-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 2px;
			flex-shrink: 0;
		}

		.f-toast[data-intent='info'] .f-toast-icon { color: var(--f-info); }
		.f-toast[data-intent='success'] .f-toast-icon { color: var(--f-success); }
		.f-toast[data-intent='warning'] .f-toast-icon { color: var(--f-warning); }
		.f-toast[data-intent='danger'] .f-toast-icon { color: var(--f-danger); }

		.f-toast-content {
			flex: 1;
			min-width: 0;
		}

		.f-toast-title {
			margin: 0 0 0.2rem 0;
			font-size: var(--f-text-sm);
			font-weight: 600;
			color: var(--f-text);
		}

		.f-toast-message {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.4;
		}

		.f-toast-action {
			flex-shrink: 0;
			margin-left: 0.25rem;
		}

		.f-toast-close {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 22px;
			height: 22px;
			padding: 0;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-sm);
			color: var(--f-text-muted);
			cursor: pointer;
			flex-shrink: 0;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-toast-close:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-toast-progress-track {
			height: 3px;
			width: 100%;
			background: var(--f-border-subtle);
		}

		.f-toast-progress-fill {
			height: 100%;
			background: var(--f-primary);
			transition: width 30ms linear;
		}

		.f-toast[data-intent='info'] .f-toast-progress-fill { background: var(--f-info); }
		.f-toast[data-intent='success'] .f-toast-progress-fill { background: var(--f-success); }
		.f-toast[data-intent='warning'] .f-toast-progress-fill { background: var(--f-warning); }
		.f-toast[data-intent='danger'] .f-toast-progress-fill { background: var(--f-danger); }

		@keyframes f-toast-in {
			from {
				opacity: 0;
				transform: translateY(8px) scale(0.96);
			}
			to {
				opacity: 1;
				transform: translateY(0) scale(1);
			}
		}
	}
</style>
