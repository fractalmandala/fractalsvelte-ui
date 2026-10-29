<!-- @component An inline message box: tinted by `message`, or plain with coloured text and icon via `messageText`. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luInfo, luCircleCheck, luTriangleAlert, luCircleX, luX } from '@fractaldesign/icons/lucide';
	import type { Message, MessageText, Shape, Pad } from '../types';
	import Card from '../layout/Card.svelte';
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
		/** An icon from @fractaldesign/icons; defaults to one per tone */
		icon?: IconData;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		padding?: Pad;
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
		padding = 'pad-md',
		class: className = '',
		actions,
		children,
		...restProps
	}: Props = $props();

	const ICONS: Record<Message, IconData> = { info: luInfo, success: luCircleCheck, warning: luTriangleAlert, danger: luCircleX };
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
		class="tint {messageText ? '' : message} {className}"
		{...restProps}
	>
		<div class="row ytop gap-sm">
			<span class="row ycenter shrink-0 text-lg {toneText}" aria-hidden="true">
				<Icon icon={icon ?? ICONS[tone]} />
			</span>
			<div class="box gap-xs grow min0 xleft ta-l">
				{#if title}<h5 class="page-heading-bs lh11 {toneText}">{title}</h5>{/if}
				{#if description}<p class="text-body-sm lh11 text-secondary">{description}</p>{/if}
				{#if children}<div class="text-body-sm text-secondary">{@render children()}</div>{/if}
				{#if actions}<div class="row ycenter gap-xs wrap pt-xs">{@render actions()}</div>{/if}
			</div>
			{#if dismissible}
				<IconButton icon="ghost" size="h-sm" label="Dismiss alert" class="text-muted" onclick={dismiss}>
					<Icon icon={luX} />
				</IconButton>
			{/if}
		</div>
	</Card>
{/if}
