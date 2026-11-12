<!-- @component An inline message box: tinted by `message`, or plain with coloured text and icon via `messageText`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';
	import type { IconNode } from '$lib/icons/types.js';
	import { klCircleCheck, klCircleX, klInfo, klTriangleAlert, klX, klBell } from '$lib/icons/keylinestroke.js';
	import type { Message, MessageText, Shape, TextSize, ChildTextSize } from '$lib/types.js';
	import Card from './Card.svelte';
	import IconButton from '../actions/IconButton.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		/** Tinted box in this tone (background, border, icon and title) */
		message?: Message;
		/** Plain box with only the icon and title in this tone; overrides message */
		messageText?: MessageText;
		title?: string;
		description?: string;
		dismissible?: boolean;
		onclose?: () => void;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to one per tone */
		icon?: IconNode;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		padding?: string;
		textsize?: TextSize;
		childtextsize?: ChildTextSize;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		message = 'info',
		messageText,
		title,
		description,
		dismissible = false,
		onclose,
		icon,
		shape = 'modern',
		padding = 'py-bs pl-lg pr-xl',
		textsize = 'text-sm',
		childtextsize = 'text-sm',
		class: className = '',
		actions,
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
	<Card
		role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
		{shape}
		{padding}
		class="msg {message} {messageText ? '' : message} {className}"
		{...restProps}
	>
		<div class="row ytop gap-sm">
			<Icon icon={icon ?? ICONS[tone]} />
			<div class="box gap-xs grow min0 xleft ta-l">
				{#if title}<h5 class="{textsize} weight-500 lh11">{title}</h5>{/if}
				{#if description}<p class="{textsize} lh11 text-secondary">{description}</p>{/if}
				{#if children}<div class="{childtextsize} text-secondary">{@render children()}</div>{/if}
				{#if actions}<div class="row ycenter gap-xs wrap pt-xs">{@render actions()}</div>{/if}
			</div>
			{#if dismissible}
				<IconButton icon="ghost" size="h-md" fit label="Dismiss alert" class="text-muted" onclick={dismiss}>
					<Icon size={8} icon={klX} />
				</IconButton>
			{/if}
		</div>
	</Card>
{/if}
