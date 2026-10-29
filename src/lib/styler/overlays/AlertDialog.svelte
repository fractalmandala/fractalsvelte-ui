<!-- @component A modal that asks the user to confirm or cancel an action. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luTriangleAlert } from '@fractaldesign/icons/lucide';
	import Button from '../actions/Button.svelte';
	import Modal from './Modal.svelte';
	import type { Message, Surface, Border, Shadow, Shape } from '../types';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		/** Tone of the icon; danger also paints the confirm button */
		message?: Message;
		/** Disables both actions and blocks Escape while an async confirm runs */
		loading?: boolean;
		class?: string;
		onconfirm?: () => void;
		oncancel?: () => void;
		/** An icon from @fractaldesign/icons; defaults to a warning triangle */
		icon?: IconData;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title = 'Are you sure?',
		description,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		message = 'danger',
		loading = false,
		class: className = '',
		onconfirm,
		oncancel,
		icon,
		surface = 'bg-surface',
		border = 'border',
		shadow = 'shad-2xl',
		shape = 'curved',
		trigger,
		children
	}: Props = $props();

	const uid = $props.id();

	function cancel() {
		if (loading) return;
		open = false;
		oncancel?.();
	}
</script>

{@render trigger?.({ open: () => (open = true) })}

<!-- An alert dialog only closes through its buttons: no backdrop dismissal,
     and Escape maps to Cancel. The cancel button takes initial focus. -->
<Modal
	bind:open
	role="alertdialog"
	closeOnBackdrop={false}
	closeOnEscape={false}
	onescape={cancel}
	{surface}
	{border}
	{shadow}
	{shape}
	aria-labelledby="{uid}-title"
	aria-describedby={description ? `${uid}-desc` : undefined}
	width="32em"
	panelClass="gap-md pad-lg {className}"
>
	<div class="row ytop gap-md">
		<span class="row ycenter shrink-0 text-2xl text-{message}" aria-hidden="true"><Icon icon={icon ?? luTriangleAlert} /></span>
		<div class="box gap-xs min0">
			<h2 id="{uid}-title" class="page-heading-lg">{title}</h2>
			{#if description}<p id="{uid}-desc" class="text-body-sm text-secondary">{description}</p>{/if}
		</div>
	</div>
	{#if children}<div class="box gap-sm text-body-sm">{@render children()}</div>{/if}
	<div class="row ycenter xright gap-xs">
		<Button variant="ghost" size="h-lg" disabled={loading} onclick={cancel} autofocus>{cancelText}</Button>
		<Button variant="primary" class={message === 'danger' ? 'danger' : ''} size="h-lg" {loading} onclick={() => !loading && onconfirm?.()}>{confirmText}</Button>
	</div>
</Modal>
