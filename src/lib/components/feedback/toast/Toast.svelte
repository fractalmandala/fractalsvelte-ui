<!-- @component An imperative notification, stacked in a pile at the edge of the viewport. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import {
		luCircleAlert,
		luCircleCheck,
		luInfo,
		luLoaderCircle,
		luTriangleAlert,
		luX
	} from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { toneText } from '../../../internal/helpers.js';
	import type { ToastAction, ToastTone } from './toast.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The meaning of the toast. `danger` and `warning` are announced assertively; the rest politely. */
		tone?: ToastTone;
		/** The main message. Used when `children` is omitted. */
		message?: string;
		/** Supporting text under the message. */
		description?: string;
		/** A button for the next step. The toast is dismissed after it is pressed. */
		action?: ToastAction;
		/** A quieter button that dismisses the toast. */
		cancel?: ToastAction;
		/** Shows a close button. */
		dismissible?: boolean;
		/** Called when the toast is dismissed by the close button, cancel, or the action. */
		onDismiss?: () => void;
		/** The message, as a snippet. Replaces `message` when provided. */
		children?: Snippet;
	}

	let {
		tone = 'neutral',
		message,
		description,
		action,
		cancel,
		dismissible = true,
		onDismiss,
		children,
		class: className,
		role,
		...rest
	}: Props = $props();

	const defaults: Record<ToastTone, IconData> = {
		neutral: luInfo,
		info: luInfo,
		success: luCircleCheck,
		warning: luTriangleAlert,
		danger: luCircleAlert,
		loading: luLoaderCircle
	};

	const toneClass: Record<ToastTone, string> = {
		neutral: toneText.neutral,
		info: toneText.info,
		success: toneText.success,
		warning: toneText.warning,
		danger: toneText.danger,
		loading: toneText.neutral
	};

	const urgent = $derived(tone === 'danger' || tone === 'warning');

	function run(next?: ToastAction) {
		next?.onClick?.();
		onDismiss?.();
	}
</script>

<div
	class={['row gap-md pad-md modern glass rim shad-md border bg-overlay measure-sm', className]}
	role={role ?? (urgent ? 'alert' : 'status')}
	aria-live={role ? undefined : urgent ? 'assertive' : 'polite'}
	aria-atomic="true"
	{...rest}
>
	<span class={['shrink-0 text-bs lh14', toneClass[tone], tone === 'loading' && 'anim-spin']}>
		<Icon icon={defaults[tone]} />
	</span>
	<div class="box grow wmin0 gap-xs">
		{#if children}
			<div class="weight-500 text-sm lh14">{@render children()}</div>
		{:else if message}
			<p class="weight-500 text-sm lh14">{message}</p>
		{/if}
		{#if description}
			<p class="text-sm text-secondary lh15">{description}</p>
		{/if}
		{#if action || cancel}
			<div class="row ycenter wrap gap-sm mt-xs">
				{#if action}
					{#if action.href}
						<Button size="h-sm" variant="primary" href={action.href} onclick={() => run(action)}>{action.label}</Button>
					{:else}
						<Button size="h-sm" variant="primary" onclick={() => run(action)}>{action.label}</Button>
					{/if}
				{/if}
				{#if cancel}
					<Button size="h-sm" variant="ghost" onclick={() => run(cancel)}>{cancel.label}</Button>
				{/if}
			</div>
		{/if}
	</div>
	{#if dismissible}
		<button type="button" class="dismiss focus-ring text-bs" aria-label="Dismiss" onclick={() => onDismiss?.()}>
			<Icon icon={luX} />
		</button>
	{/if}
</div>
