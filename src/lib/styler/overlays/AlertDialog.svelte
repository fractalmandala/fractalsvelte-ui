<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon } from 'fractalicons';
	import { luTriangleAlert } from 'fractalicons/lucide';
	import Button from '../actions/Button.svelte';
	import Modal from './Modal.svelte';

	export type AlertConfirmVariant = 'destructive' | 'primary';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		confirmVariant?: AlertConfirmVariant;
		/** Disables both actions and blocks Escape while an async confirm runs */
		loading?: boolean;
		class?: string;
		onconfirm?: () => void;
		oncancel?: () => void;
		icon?: Snippet;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title = 'Are you sure?',
		description,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		confirmVariant = 'destructive',
		loading = false,
		class: className = '',
		onconfirm,
		oncancel,
		icon,
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
	aria-labelledby="{uid}-title"
	aria-describedby={description ? `${uid}-desc` : undefined}
	panelClass="prose gap-md pad-md {className}"
>
	<div class="row ytop gap-md">
		{#if icon}
			<span class="row ycenter shrink-0 text-2xl">{@render icon()}</span>
		{:else if confirmVariant === 'destructive'}
			<span class="row ycenter shrink-0 text-2xl text-danger" aria-hidden="true"><Icon icon={luTriangleAlert} /></span>
		{/if}
		<div class="box gap-xs min0">
			<h2 id="{uid}-title" class="page-heading-lg">{title}</h2>
			{#if description}<p id="{uid}-desc" class="text-body-sm text-secondary">{description}</p>{/if}
		</div>
	</div>
	{#if children}<div class="box gap-sm text-body-sm">{@render children()}</div>{/if}
	<div class="row ycenter xright gap-xs">
		<Button variant="ghost" size="lg" disabled={loading} onclick={cancel} autofocus>{cancelText}</Button>
		<Button variant={confirmVariant} size="lg" {loading} onclick={() => !loading && onconfirm?.()}>{confirmText}</Button>
	</div>
</Modal>
