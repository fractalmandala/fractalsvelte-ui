<!-- @component A single notification with title, description, tone, action and auto-dismiss. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luInfo, luCircleCheck, luTriangleAlert, luCircleX } from '@fractaldesign/icons/lucide';
	import type { Message, MessageText, Surface, Border, Shadow, Shape, Pad } from '../types';
	import Bar from '../display/Bar.svelte';
	import Card from '../layout/Card.svelte';
	import CloseButton from '../actions/CloseButton.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		id?: string;
		title?: string;
		description?: string;
		/** Tone of the icon and progress bar */
		messageText?: MessageText;
		/** An icon from @fractaldesign/icons; defaults to one per tone */
		icon?: IconData;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		padding?: Pad;
		/** ms until auto-dismiss; 0 keeps it open */
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
		description,
		messageText = 'text-info',
		icon,
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-lg',
		shape = 'curved',
		padding = 'pad-md',
		duration = 4000,
		dismissible = true,
		class: className = '',
		onclose,
		action,
		children,
		...restProps
	}: Props = $props();

	const ICONS: Record<Message, IconData> = { info: luInfo, success: luCircleCheck, warning: luTriangleAlert, danger: luCircleX };
	const tone = $derived(messageText.replace('text-', '') as Message);
	let visible = $state(true);
	let remaining = $state(1);
	let paused = $state(false);

	// Time left is drawn by the shared SVG bar, so the countdown needs no CSS width.
	$effect(() => {
		if (duration <= 0) return;
		let last = performance.now();
		let raf = requestAnimationFrame(function tick(now) {
			if (!paused) remaining = Math.max(0, remaining - (now - last) / duration);
			last = now;
			if (remaining <= 0) return dismiss();
			raf = requestAnimationFrame(tick);
		});
		return () => cancelAnimationFrame(raf);
	});

	function dismiss() {
		if (!visible) return;
		visible = false;
		onclose?.();
	}
</script>

{#if visible}
	<Card
		{id}
		{surface}
		{border}
		{shadow}
		{shape}
		{padding}
		class={className}
		role={tone === 'danger' ? 'alert' : 'status'}
		aria-live={tone === 'danger' ? 'assertive' : 'polite'}
		onpointerenter={() => (paused = true)}
		onpointerleave={() => (paused = false)}
		{...restProps}
	>
		<div class="row ytop gap-sm">
			<span class="row ycenter shrink-0 text-lg {messageText}" aria-hidden="true"><Icon icon={icon ?? ICONS[tone]} /></span>
			<div class="box gap-xs grow min0">
				{#if title}<span class="text-sm weight-600">{title}</span>{/if}
				{#if description}<p class="text-body-sm text-secondary">{description}</p>{/if}
				{@render children?.()}
			</div>
			{#if action}<div class="row ycenter shrink-0">{@render action()}</div>{/if}
			{#if dismissible}
				<CloseButton label="Close notification" size="h-sm" class="shrink-0" onclick={dismiss} />
			{/if}
		</div>
		{#if duration > 0}<Bar fraction={remaining} tone={messageText} size="h-sm" />{/if}
	</Card>
{/if}
