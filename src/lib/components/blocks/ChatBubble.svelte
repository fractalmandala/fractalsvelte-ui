<!-- @component A chat message bubble with avatar, timestamp and status. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klCheck, klClock, klDoubleCheck } from '$lib/icons/keylinestroke.js';
	import Avatar from '../display/Avatar.svelte';
	import type { Size, TextSize } from '$lib/types.js';

	export type ChatRole = 'user' | 'assistant' | 'system';
	export type ChatStatus = 'sending' | 'sent' | 'delivered' | 'read';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
		role?: ChatRole;
		/** Message text, used when no `children` snippet is given. */
		message?: string;
		timestamp?: string;
		status?: ChatStatus;
		avatar?: string;
		avatarFallback?: string;
		avatarSize?: Size;
		textsize?: TextSize;
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
		avatarSize = 'h-lg',
		textsize = 'text-md',
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
	<div class="row xcenter py-xs {textsize} {className}" {...restProps}>
		<span class="px-sm mincurved text-xs state-hover text-muted">{message}{@render children?.()}</span>
	</div>
{:else}
	<!-- The user's turn sits on the right: the same row, end-justified, with the
	     avatar after the bubble. -->
	<div class="row ytop gap-sm {isUser ? 'xright' : 'xleft'} {textsize} {className}" {...restProps}>
		{#if !isUser}
			{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} initials={initials} size={avatarSize} />{/if}
		{/if}
		<div class="box gap-xs min0 {isUser ? 'xright' : 'xleft'}">
			<!-- The user's own turn takes the strong fill; replies sit on the soft one. -->
			<div class="box gap-xs px-md py-sm curved {isUser ? 'primary' : 'secondary'}">
				{#if message}<p class="text-body-sm">{message}</p>{/if}
				{@render children?.()}
			</div>
			{#if timestamp || (status && isUser)}
				<div class="row ycenter gap-xs text-sm text-muted">
					{#if timestamp}<span>{timestamp}</span>{/if}
					{#if status && isUser}
						<span class="row ycenter {status === 'read' ? 'text-theme' : ''}" title={status} aria-label="Message {status}">
							{#if status === 'sending'}<Icon icon={klClock} />{:else if status === 'sent'}<Icon icon={klCheck} />{:else}<Icon
									icon={klDoubleCheck}
								/>{/if}
						</span>
					{/if}
				</div>
			{/if}
			{#if actions}<div class="row ycenter gap-xs">{@render actions()}</div>{/if}
		</div>
		{#if isUser}
			{#if avatarSnippet}{@render avatarSnippet()}{:else}<Avatar src={avatar} initials={initials} size={avatarSize} />{/if}
		{/if}
	</div>
{/if}
