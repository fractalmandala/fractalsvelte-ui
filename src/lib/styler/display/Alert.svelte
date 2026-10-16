<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luInfo, luCircleCheck, luTriangleAlert, luCircleX, luX } from 'fractalicons/lucide';
	import type { Intent } from '../types';
	import { TONE_TEXT } from '../classes';

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

	const ICONS = { info: luInfo, success: luCircleCheck, warning: luTriangleAlert, danger: luCircleX };
	let closed = $state(false);

	function dismiss() {
		closed = true;
		onclose?.();
	}
</script>

{#if !closed}
	<div
		role={intent === 'danger' || intent === 'warning' ? 'alert' : 'status'}
		class="card row ytop gap-sm {className}"
		data-variant="primary"
		data-shape="curved"
		data-pad="md"
		{...restProps}
	>
		<span class="row ycenter shrink-0 text-lg {TONE_TEXT[intent]}" aria-hidden="true">
			{#if icon}
				{@render icon()}
			{:else}
				<Icon icon={ICONS[intent]} />
			{/if}
		</span>
		<div class="box gap-xs grow min0">
			{#if title}<h5 class="page-heading-bs {TONE_TEXT[intent]}">{title}</h5>{/if}
			{#if description}<p class="text-body-sm text-secondary">{description}</p>{/if}
			{#if children}<div class="text-body-sm text-secondary">{@render children()}</div>{/if}
			{#if actions}<div class="row ycenter gap-xs wrap pt-xs">{@render actions()}</div>{/if}
		</div>
		{#if dismissible}
			<button
				type="button"
				data-variant="iconbox"
				data-size="icon-md"
				class="px-xs text-muted shrink-0"
				aria-label="Dismiss alert"
				title="Dismiss"
				onclick={dismiss}
			>
				<Icon icon={luX} />
			</button>
		{/if}
	</div>
{/if}
