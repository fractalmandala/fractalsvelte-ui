<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luInfo, luCircleCheck, luTriangleAlert, luCircleX, luX } from 'fractalicons/lucide';
	import type { Intent } from '../types';
	import { TONE_TEXT } from '../classes';
	import Bar from '../display/Bar.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		id?: string;
		title?: string;
		message?: string;
		intent?: Intent;
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

	const ICONS = { info: luInfo, success: luCircleCheck, warning: luTriangleAlert, danger: luCircleX };
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
	<div
		{id}
		class="card box gap-sm shadow-lg {className}"
		data-variant="primary"
		data-shape="curved"
		data-pad="md"
		role={intent === 'danger' ? 'alert' : 'status'}
		aria-live={intent === 'danger' ? 'assertive' : 'polite'}
		onpointerenter={() => (paused = true)}
		onpointerleave={() => (paused = false)}
		{...restProps}
	>
		<div class="row ytop gap-sm">
			<span class="row ycenter shrink-0 text-lg {TONE_TEXT[intent]}" aria-hidden="true"><Icon icon={ICONS[intent]} /></span>
			<div class="box gap-xs grow min0">
				{#if title}<span class="text-sm weight-600">{title}</span>{/if}
				{#if message}<p class="text-body-sm text-secondary">{message}</p>{/if}
				{@render children?.()}
			</div>
			{#if action}<div class="row ycenter shrink-0">{@render action()}</div>{/if}
			{#if dismissible}
				<button type="button" data-variant="iconbox" class="px-xs text-muted shrink-0" aria-label="Close notification" onclick={dismiss}>
					<Icon icon={luX} />
				</button>
			{/if}
		</div>
		{#if duration > 0}<Bar fraction={remaining} tone={intent} size="sm" />{/if}
	</div>
{/if}
