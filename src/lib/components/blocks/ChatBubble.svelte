<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		role?: 'user' | 'assistant' | 'system';
		message?: string;
		timestamp?: string;
		status?: 'sending' | 'sent' | 'delivered' | 'read';
		avatar?: string;
		avatarFallback?: string;
		class?: string;
		avatarSnippet?: Snippet;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		role = 'assistant',
		message,
		timestamp,
		status,
		avatar,
		avatarFallback,
		class: className = '',
		avatarSnippet,
		children,
		actions,
		...restProps
	}: Props = $props();

	const fallbackInitials = $derived(
		avatarFallback || (role === 'user' ? 'U' : role === 'assistant' ? 'AI' : 'S')
	);
</script>

<div
	class="f-chat-bubble-wrap {className}"
	data-role={role}
	{...restProps}
>
	{#if role !== 'system'}
		<div class="f-bubble-avatar-col">
			{#if avatarSnippet}
				{@render avatarSnippet()}
			{:else if avatar}
				<img src={avatar} alt="Avatar" class="f-bubble-avatar-img" />
			{:else}
				<div class="f-bubble-avatar-fallback">
					{fallbackInitials}
				</div>
			{/if}
		</div>
	{/if}

	<div class="f-bubble-content-col">
		<div class="f-chat-bubble" data-role={role}>
			{#if message}
				<div class="f-bubble-message">{message}</div>
			{/if}

			{#if children}
				<div class="f-bubble-slot">
					{@render children()}
				</div>
			{/if}

			{#if timestamp || status}
				<div class="f-bubble-meta">
					{#if timestamp}
						<span class="f-bubble-time">{timestamp}</span>
					{/if}

					{#if status && role === 'user'}
						<span class="f-bubble-status" data-status={status} title={status}>
							{#if status === 'sending'}
								<span class="f-status-dot"></span>
							{:else if status === 'sent'}
								<svg class="f-tick-icon" viewBox="0 0 16 16" fill="currentColor">
									<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
								</svg>
							{:else if status === 'delivered'}
								<svg class="f-tick-icon" viewBox="0 0 16 16" fill="currentColor">
									<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-3 0a.5.5 0 0 0-.708-.708L5 7.293 6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l2.647-2.646z"/>
								</svg>
							{:else if status === 'read'}
								<svg class="f-tick-icon f-tick-read" viewBox="0 0 16 16" fill="currentColor">
									<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-3 0a.5.5 0 0 0-.708-.708L5 7.293 6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l2.647-2.646z"/>
								</svg>
							{/if}
						</span>
					{/if}
				</div>
			{/if}
		</div>

		{#if actions}
			<div class="f-bubble-actions">
				{@render actions()}
			</div>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-chat-bubble-wrap {
			display: flex;
			align-items: flex-start;
			gap: var(--f-space-sm);
			max-width: 85%;
			font-family: var(--f-font-sans);
			margin-bottom: var(--f-space-md);
		}

		.f-chat-bubble-wrap[data-role='user'] {
			align-self: flex-end;
			margin-left: auto;
			flex-direction: row-reverse;
		}

		.f-chat-bubble-wrap[data-role='assistant'] {
			align-self: flex-start;
			margin-right: auto;
			flex-direction: row;
		}

		.f-chat-bubble-wrap[data-role='system'] {
			align-self: center;
			margin: 0 auto var(--f-space-md) auto;
			max-width: 90%;
			justify-content: center;
		}

		.f-bubble-avatar-col {
			flex-shrink: 0;
		}

		.f-bubble-avatar-img {
			width: 2rem;
			height: 2rem;
			border-radius: var(--f-radius-full);
			object-fit: cover;
			display: block;
		}

		.f-bubble-avatar-fallback {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			border-radius: var(--f-radius-full);
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			color: var(--f-text);
			font-size: var(--f-text-xs);
			font-weight: 600;
		}

		.f-bubble-content-col {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}

		.f-chat-bubble {
			position: relative;
			padding: var(--f-space-sm) var(--f-space-lg);
			border-radius: var(--f-radius-lg);
			box-sizing: border-box;
			line-height: 1.5;
			font-size: var(--f-text-sm);
		}

		.f-chat-bubble[data-role='user'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-bottom-right-radius: 2px;
		}

		.f-chat-bubble[data-role='assistant'] {
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-xs);
			border-bottom-left-radius: 2px;
		}

		.f-chat-bubble[data-role='system'] {
			background: var(--f-sunken);
			color: var(--f-text-muted);
			font-size: var(--f-text-xs);
			border-radius: var(--f-radius-full);
			padding: 0.25rem 0.75rem;
			text-align: center;
		}

		.f-bubble-message {
			white-space: pre-wrap;
			word-break: break-word;
		}

		.f-bubble-meta {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 0.35rem;
			margin-top: 0.25rem;
			font-size: var(--f-text-xs);
			opacity: 0.75;
		}

		.f-bubble-status {
			display: inline-flex;
			align-items: center;
		}

		.f-tick-icon {
			width: 0.85rem;
			height: 0.85rem;
		}

		.f-tick-read {
			color: #38bdf8;
		}

		.f-status-dot {
			width: 0.4rem;
			height: 0.4rem;
			border-radius: var(--f-radius-full);
			background: currentColor;
		}

		.f-bubble-actions {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin-top: 0.25rem;
		}
	}
</style>
