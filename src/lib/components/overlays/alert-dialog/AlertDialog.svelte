<!-- @component A confirmation dialog that requires a choice, with an imperative confirm() helper. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import type { Tone } from '../../../internal/tokens.js';
	import { Button } from '../../actions/button/index.js';
	import { Dialog } from '../dialog/index.js';
	import type { OverlayContent, OverlayTrigger } from '../dialog/dialog.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		/** Whether the confirmation dialog is open. Bind it, or let the `trigger` drive it. */
		open?: boolean;
		/** Called whenever the dialog opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** The heading. Wired as the accessible name. */
		title?: string | Snippet;
		/** A line under the heading. Wired as the accessible description. */
		description?: string | Snippet;
		/** The colour of the confirm action. */
		tone?: Tone;
		/** The label of the confirm action. */
		confirmLabel?: string;
		/** The label of the cancel action — the least destructive choice, and where focus lands. */
		cancelLabel?: string;
		/** Called when the confirm action is pressed. If it returns a promise, the action stays in a loading state until it settles; returning `false` keeps the dialog open. */
		onConfirm?: () => void | boolean | Promise<void | boolean>;
		/** Called when the cancel action is pressed. */
		onCancel?: () => void;
		/** Renders the element that opens the dialog. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
		/** Optional body between the description and the actions. Receives `close`. */
		children?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		tone = 'neutral',
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm,
		onCancel,
		trigger: triggerSnippet,
		children,
		class: klass,
		...rest
	}: Props = $props();

	let busy = $state(false);

	const confirmVariant: Record<Tone, 'primary' | 'info' | 'success' | 'warning' | 'danger'> = {
		neutral: 'primary',
		info: 'info',
		success: 'success',
		warning: 'warning',
		danger: 'danger'
	};

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
		if (!next) busy = false;
	}
	const close = () => setOpen(false);

	async function handleConfirm() {
		if (busy) return;
		if (!onConfirm) {
			close();
			return;
		}
		busy = true;
		try {
			const result = await onConfirm();
			if (result !== false) close();
		} finally {
			busy = false;
		}
	}

	function handleCancel() {
		onCancel?.();
		close();
	}
</script>

<Dialog
	bind:open
	{onOpenChange}
	{title}
	{description}
	size="sm"
	dismissible={false}
	closeButton={false}
	role="alertdialog"
	class={klass}
	{...rest}
>
	{#snippet trigger(api)}
		{@render triggerSnippet?.(api)}
	{/snippet}
	{#if children}
		{@render children({ close })}
	{/if}
	{#snippet footer()}
		<Button variant="ghost" autofocus disabled={busy} onclick={handleCancel}>{cancelLabel}</Button>
		<Button variant={confirmVariant[tone]} loading={busy} onclick={handleConfirm}>{confirmLabel}</Button>
	{/snippet}
</Dialog>
