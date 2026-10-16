<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luX } from 'fractalicons/lucide';
	import type { Intent } from '../types';
	import { TONE_TEXT } from '../classes';

	export type BannerVariant = 'filled' | 'subtle' | 'outline';

	interface Props extends HTMLAttributes<HTMLElement> {
		intent?: Intent;
		variant?: BannerVariant;
		dismissible?: boolean;
		onclose?: () => void;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		intent = 'info',
		variant = 'subtle',
		dismissible = false,
		onclose,
		class: className = '',
		icon,
		action,
		children,
		...restProps
	}: Props = $props();

	// filled paints the status colour; the other two keep a neutral surface and
	// carry the status in the icon ink.
	const FILL_CLASSES: Record<Intent, string> = {
		info: 'bg-info text-white',
		success: 'bg-success text-white',
		warning: 'bg-warning text-black',
		danger: 'bg-danger text-white'
	};
	const SHELL_CLASSES: Record<BannerVariant, string> = {
		filled: '',
		subtle: 'bg-sunken text-primary bb',
		outline: 'border-strong text-primary'
	};

	let closed = $state(false);

	function dismiss() {
		closed = true;
		onclose?.();
	}
</script>

{#if !closed}
	<aside
		aria-label="Announcement"
		class="row ycenter xbetween gap-md px-md py-sm wfull {variant === 'filled'
			? FILL_CLASSES[intent]
			: SHELL_CLASSES[variant]} {className}"
		{...restProps}
	>
		<div class="row ycenter gap-sm min0">
			{#if icon}
				<span class="row ycenter shrink-0 {variant === 'filled' ? '' : TONE_TEXT[intent]}" aria-hidden="true">
					{@render icon()}
				</span>
			{/if}
			<div class="text-body-sm min0">{@render children?.()}</div>
		</div>
		<div class="row ycenter gap-xs shrink-0">
			{@render action?.()}
			{#if dismissible}
				<button
					type="button"
					data-variant="iconbox"
					class="px-xs"
					data-size="icon-md"
					aria-label="Dismiss banner"
					title="Dismiss"
					onclick={dismiss}
				>
					<Icon icon={luX} />
				</button>
			{/if}
		</div>
	</aside>
{/if}
