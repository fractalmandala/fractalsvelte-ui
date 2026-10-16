<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCheck, luCheckCheck, luClock } from 'fractalicons/lucide';
	import Avatar from '../display/Avatar.svelte';

	export type ChatRole = 'user' | 'assistant' | 'system';
	export type ChatStatus = 'sending' | 'sent' | 'delivered' | 'read';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
		role?: ChatRole;
		message?: string;
		timestamp?: string;
		status?: ChatStatus;
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

	const initials = $derived(avatarFallback || (role === 'user' ? 'U' : role === 'assistant' ? 'AI' : 'S'));
	const isUser = $derived(role === 'user');
</script>

{#if role === 'system'}
	<div class="row xcenter py-xs {className}" {...restProps}>
		<span class="chip bg-sunken text-muted">{message}{@render children?.()}</span>
	</div>
{:else}
	<!-- The user's turn sits on the right: the same row, end-justified, with the
	     avatar after the bubble. -->
	<div class="row ytop gap-sm {isUser ? 'xright' : 'xleft'} {className}" {...restProps}>
		{#if !isUser}
			{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} initials={initials} size="lg" />{/if}
		{/if}
		<div class="box gap-xs min0 {isUser ? 'xright' : 'xleft'}">
			<div
				class="card box gap-xs text-primary"
				data-variant={isUser ? 'secondary' : 'primary'}
				data-shape="curved"
				data-pad="sm"
			>
				{#if message}<p class="text-body-sm">{message}</p>{/if}
				{@render children?.()}
			</div>
			{#if timestamp || (status && isUser)}
				<div class="row ycenter gap-xs text-sm text-muted">
					{#if timestamp}<span>{timestamp}</span>{/if}
					{#if status && isUser}
						<span class="row ycenter {status === 'read' ? 'text-theme' : ''}" title={status} aria-label="Message {status}">
							{#if status === 'sending'}<Icon icon={luClock} />{:else if status === 'sent'}<Icon icon={luCheck} />{:else}<Icon
									icon={luCheckCheck}
								/>{/if}
						</span>
					{/if}
				</div>
			{/if}
			{#if actions}<div class="row ycenter gap-xs">{@render actions()}</div>{/if}
		</div>
		{#if isUser}
			{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} initials={initials} size="lg" />{/if}
		{/if}
	</div>
{/if}
