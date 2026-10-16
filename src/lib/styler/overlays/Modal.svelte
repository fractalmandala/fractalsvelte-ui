<script lang="ts" module>
	export type ModalPlacement = 'center' | 'top' | 'left' | 'right' | 'top-edge' | 'bottom-edge';
</script>

<script lang="ts">
	/*
	 * Native modal <dialog> shell shared by Dialog, AlertDialog, Drawer,
	 * MobileNav and CommandPalette.
	 *
	 * Browsers centre a modal dialog with `margin: auto`, but fractalstyler's
	 * base reset (`* { margin: 0 }`) removes that, and the system has no
	 * margin-auto or inset utilities to put it back. So the <dialog> itself is
	 * a transparent, viewport-sized layer (.card[data-variant="ghost"] is the
	 * one transparent fill fractalstyler has; .full sizes it; .mt-bs/.ml-bs
	 * split the browser's 2em + 6px max-size allowance evenly), and an inner
	 * flex row places the visible panel — centred, or against an edge.
	 *
	 * The platform still provides focus trapping, inertness of the page,
	 * ::backdrop, Escape (the cancel event) and focus restoration on close.
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLDialogAttributes, 'open' | 'children'> {
		open?: boolean;
		placement?: ModalPlacement;
		/** Clicking outside the panel closes */
		closeOnBackdrop?: boolean;
		/** Escape closes (the browser's cancel event) */
		closeOnEscape?: boolean;
		/** Called when Escape is pressed but closeOnEscape is false */
		onescape?: () => void;
		onclose?: () => void;
		/** Classes for the visible panel */
		panelClass?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'center',
		closeOnBackdrop = true,
		closeOnEscape = true,
		onescape,
		onclose,
		panelClass = '',
		children,
		...restProps
	}: Props = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) dialogEl.showModal();
		else if (!open && dialogEl.open) dialogEl.close();
	});

	// Where the panel sits inside the viewport-sized layer. Each string carries
	// its own .row / .box base for the alignment modifiers.
	const ALIGN_CLASSES: Record<ModalPlacement, string> = {
		center: 'row xcenter ycenter full',
		top: 'row xcenter ytop full pt-3xl',
		left: 'row xleft full',
		right: 'row xright full',
		'top-edge': 'box ytop full',
		'bottom-edge': 'box ybot full'
	};
</script>

<dialog
	bind:this={dialogEl}
	class="card full mt-bs ml-bs pad-xs"
	data-variant="ghost"
	oncancel={(e) => {
		if (!closeOnEscape) {
			e.preventDefault();
			onescape?.();
		}
	}}
	onclose={() => {
		if (open) {
			open = false;
			onclose?.();
		}
	}}
	onclick={(e) => {
		if (closeOnBackdrop && panelEl && !panelEl.contains(e.target as Node)) open = false;
	}}
	{...restProps}
>
	<div class={ALIGN_CLASSES[placement]}>
		<div bind:this={panelEl} class="box bg-surface text-primary border shadow-2xl radius-md {panelClass}">
			{@render children?.()}
		</div>
	</div>
</dialog>
