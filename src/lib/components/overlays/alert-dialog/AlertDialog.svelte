<!-- @component A confirmation dialog that requires a choice, with an imperative confirm() helper. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLDialogAttributes  } from 'svelte/elements';
	import type {  Tone  } from '../../../internal/tokens.js';
	import { Button } from '../../actions/button/index.js';
	import {Dialog} from '../dialog/index.js';
	import type {  OverlayContent, OverlayTrigger  } from '../dialog/dialog.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string | Snippet;
		description?: string | Snippet;
		tone?: Tone;
		confirmLabel?: string;
		cancelLabel?: string;
		confirmButtonProps?: ComponentProps<typeof Button>;
		cancelButtonProps?: ComponentProps<typeof Button>;
		onConfirm?: () => void | boolean | Promise<void | boolean>;
		onCancel?: () => void;
		trigger?: Snippet<[OverlayTrigger]>;
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
		confirmButtonProps,
		cancelButtonProps,
		onConfirm,
		onCancel,
		trigger: triggerSnippet,
		children,
		class: className,
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
	width="measure-sm"
	dismissible={false}
	closeButton={false}
	role="alertdialog"
	class={className}
	{...rest}
>
	{#snippet trigger(api)}
		{@render triggerSnippet?.(api)}
	{/snippet}
	{#if children}
		{@render children({ close })}
	{/if}
	{#snippet footer()}
		<Button variant="ghost" autofocus disabled={busy} onclick={handleCancel} {...cancelButtonProps}>{cancelLabel}</Button>
		<Button variant={confirmVariant[tone]} loading={busy} onclick={handleConfirm} {...confirmButtonProps}>{confirmLabel}</Button>
	{/snippet}
</Dialog>
