<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Bindable visibility state of the dialog */
		open?: boolean;
		/** Accessible dialog title */
		title?: string;
		/** Accessible dialog description */
		description?: string;
		/** Dialog modal maximum width tier */
		size?: DialogSize;
		/** Close dialog when backdrop is clicked */
		closeOnBackdrop?: boolean;
		/** Close dialog on Escape key press */
		closeOnEscape?: boolean;
		/** Render default close button in top right */
		showCloseButton?: boolean;
		/** Additional CSS classes for dialog panel */
		class?: string;
		/** Callback invoked when the dialog closes */
		onclose?: () => void;
		/** Trigger element snippet */
		trigger?: Snippet<[{ open: () => void }]>;
		/** Custom full header snippet */
		header?: Snippet;
		/** Footer action buttons slot */
		footer?: Snippet;
		/** Dialog body content */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		class: className = '',
		onclose,
		trigger,
		header,
		footer,
		children,
		...restProps
	}: Props = $props();

	let dialogEl: HTMLDivElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = null;
	const titleId = `f-dialog-title-${Math.random().toString(36).slice(2, 9)}`;
	const descId = `f-dialog-desc-${Math.random().toString(36).slice(2, 9)}`;

	function openDialog() {
		open = true;
	}

	function closeDialog() {
		open = false;
		onclose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			closeDialog();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!open) return;

		if (event.key === 'Escape' && closeOnEscape) {
			event.preventDefault();
			event.stopPropagation();
			closeDialog();
			return;
		}

		if (event.key === 'Tab' && dialogEl) {
			const focusables = dialogEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			if (focusables.length === 0) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	}

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (open) {
			previousActiveElement = document.activeElement as HTMLElement | null;
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			// Focus trap initial placement
			requestAnimationFrame(() => {
				if (dialogEl) {
					const first = dialogEl.querySelector<HTMLElement>(
						'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
					);
					if (first) {
						first.focus();
					} else {
						dialogEl.focus();
					}
				}
			});

			return () => {
				document.body.style.overflow = originalOverflow;
				if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
					previousActiveElement.focus();
				}
			};
		}
	});

	const hasHeader = $derived(Boolean(header || title || description));
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if trigger}
	{@render trigger({ open: openDialog })}
{/if}

{#if open}
	<div
		class="f-dialog-backdrop"
		role="presentation"
		onclick={handleBackdropClick}
	>
		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
			aria-describedby={description ? descId : undefined}
			tabindex="-1"
			class="f-dialog-panel {className}"
			data-size={size}
			{...restProps}
		>
			{#if showCloseButton}
				<button
					type="button"
					class="f-dialog-close"
					aria-label="Close dialog"
					onclick={closeDialog}
				>
					<svg
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			{/if}

			{#if hasHeader}
				<div class="f-dialog-header">
					{#if header}
						{@render header()}
					{:else}
						{#if title}
							<h2 id={titleId} class="f-dialog-title">{title}</h2>
						{/if}
						{#if description}
							<p id={descId} class="f-dialog-desc">{description}</p>
						{/if}
					{/if}
				</div>
			{/if}

			{#if children}
				<div class="f-dialog-body">
					{@render children()}
				</div>
			{/if}

			{#if footer}
				<div class="f-dialog-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-dialog-backdrop {
			position: fixed;
			inset: 0;
			z-index: 1000;
			background: var(--f-overlay);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--f-space-md);
			box-sizing: border-box;
			animation: f-dialog-fade-in var(--f-duration-normal) var(--f-ease);
		}

		.f-dialog-panel {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xl);
			box-shadow: var(--f-shadow-xl);
			display: flex;
			flex-direction: column;
			max-height: calc(100vh - 2rem);
			overflow: hidden;
			outline: none;
			animation: f-dialog-scale-in var(--f-duration-normal) var(--f-ease-spring);
		}

		/* Dialog Size Tiers */
		.f-dialog-panel[data-size='sm'] {
			max-width: 400px;
		}
		.f-dialog-panel[data-size='md'] {
			max-width: 540px;
		}
		.f-dialog-panel[data-size='lg'] {
			max-width: 720px;
		}
		.f-dialog-panel[data-size='xl'] {
			max-width: 960px;
		}
		.f-dialog-panel[data-size='full'] {
			max-width: calc(100vw - 2rem);
			height: calc(100vh - 2rem);
		}

		.f-dialog-close {
			position: absolute;
			top: var(--f-space-md);
			right: var(--f-space-md);
			z-index: 2;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			padding: 0;
			border: none;
			border-radius: var(--f-radius-md);
			background: transparent;
			color: var(--f-text-muted);
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-dialog-close:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-dialog-close:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-dialog-header {
			padding: var(--f-space-xl) var(--f-space-xl) var(--f-space-md) var(--f-space-xl);
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
		}

		.f-dialog-title {
			margin: 0;
			font-size: var(--f-text-xl);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-dialog-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.5;
		}

		.f-dialog-body {
			flex: 1;
			padding: var(--f-space-md) var(--f-space-xl);
			overflow-y: auto;
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.5;
		}

		.f-dialog-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--f-space-sm);
			padding: var(--f-space-md) var(--f-space-xl);
			background: var(--f-sunken);
			border-top: 1px solid var(--f-border-subtle);
		}

		@keyframes f-dialog-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes f-dialog-scale-in {
			from {
				opacity: 0;
				transform: scale(0.96) translateY(8px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}
</style>
