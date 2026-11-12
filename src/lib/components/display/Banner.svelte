<!-- @component A full-width notice strip: tinted by `message`, or plain with coloured text and icon via `messageText`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import type { IconNode } from '$lib/icons/types.js';
	import { klCircleCheck, klCircleX, klInfo, klTriangleAlert, klX, klBell } from '$lib/icons/keylinestroke.js';
	import type { Message, MessageText, Size, Shape, TextSize } from '$lib/types.js';
	import IconButton from '../actions/IconButton.svelte';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Tinted strip in this tone (background, border and icon) */
		message?: Message;
		/** Plain strip with only the icon and text in this tone; overrides message */
		messageText?: MessageText;
		/** Padding and text step, h-sm … h-xl */
		size?: Size;
		/** Corner treatment; square suits a full-width strip, the others an inline notice */
		shape?: Shape;
		dismissible?: boolean;
		onclose?: () => void;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to one per tone */
		icon?: IconNode;
		textsize?: TextSize;
		class?: string;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		message = 'info',
		messageText,
		size = 'h-md',
		shape = 'rect',
		dismissible = false,
		onclose,
		icon,
		textsize = 'text-md',
		class: className = '',
		action,
		children,
		...restProps
	}: Props = $props();

	const ICONS: Record<Message, IconNode> = { info: klInfo, success: klCircleCheck, warning: klTriangleAlert, danger: klCircleX, neutral: klBell };
	const tone = $derived<Message>(messageText ? (messageText.replace('text-', '') as Message) : message);
	const toneText = $derived(messageText ?? `text-${message}`);
	let closed = $state(false);

	function dismiss() {
		closed = true;
		onclose?.();
	}
</script>

{#if !closed}
	<aside
		aria-label="Announcement"
		class="banner tint row ycenter xbetween gap-md wfull {shape === 'rect' ? 'bb' : 'border'} {shape} {size} {messageText ? 'bg-panel' : message} {textsize} {className}"
		{...restProps}
	>
		<div class="row ycenter gap-sm min0">
			<span class="row ycenter shrink-0 {toneText}" aria-hidden="true"><Icon icon={icon ?? ICONS[tone]} /></span>
			<div class="min0 {messageText ?? ''}">{@render children?.()}</div>
		</div>
		<div class="row ycenter gap-xs shrink-0">
			{@render action?.()}
			{#if dismissible}
				<IconButton icon="ghost" size="h-sm" label="Dismiss banner" class="text-muted" onclick={dismiss}>
					<Icon icon={klX} />
				</IconButton>
			{/if}
		</div>
	</aside>
{/if}
