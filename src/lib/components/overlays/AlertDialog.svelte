<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertConfirmVariant = 'destructive' | 'primary';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Bindable dialog visibility state */
		open?: boolean;
		/** Heading warning or alert prompt */
		title?: string;
		/** Detailed explanation of consequences */
		description?: string;
		/** Label for the positive/action button */
		confirmText?: string;
		/** Label for the abort/dismiss button */
		cancelText?: string;
		/** Visual variant for the confirm button */
		confirmVariant?: AlertConfirmVariant;
		/** Shows spinner and disables actions during async tasks */
		loading?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Callback invoked when the user confirms */
		onconfirm?: () => void;
		/** Callback invoked when the user cancels */
		oncancel?: () => void;
		/** Custom icon badge rendered above the title */
		icon?: Snippet;
		/** Slotted trigger element */
		trigger?: Snippet<[{ open: () => void }]>;
		/** Additional custom modal body content */
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
		children,
		...restProps
	}: Props = $props();

	let dialogEl: HTMLDivElement | undefined = $state();
	let cancelBtnEl: HTMLButtonElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = null;
	const titleId = `f-alert-title-${Math.random().toString(36).slice(2, 9)}`;
	const descId = `f-alert-desc-${Math.random().toString(36).slice(2, 9)}`;

	function openDialog() {
		open = true;
	}

	function handleConfirm() {
		if (loading) return;
		onconfirm?.();
	}

	function handleCancel() {
		if (loading) return;
		open = false;
		oncancel?.();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!open) return;

		if (event.key === 'Escape' && !loading) {
			event.preventDefault();
			event.stopPropagation();
			handleCancel();
			return;
		}

		if (event.key === 'Tab' && dialogEl) {
			const focusables = dialogEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

			// Focus the safe cancel button by default
			requestAnimationFrame(() => {
				if (cancelBtnEl) {
					cancelBtnEl.focus();
				} else if (dialogEl) {
					dialogEl.focus();
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
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if trigger}
	{@render trigger({ open: openDialog })}
{/if}

{#if open}
	<div
		class="f-alert-backdrop"
		role="presentation"
		onclick={(e) => {
			if (!loading && e.target === e.currentTarget) handleCancel();
		}}
	>
		<div
			bind:this={dialogEl}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-describedby={description ? descId : undefined}
			tabindex="-1"
			class="f-alert-panel {className}"
			data-variant={confirmVariant}
			{...restProps}
		>
			<div class="f-alert-content">
				{#if icon}
					<div class="f-alert-icon">
						{@render icon()}
					</div>
				{:else if confirmVariant === 'destructive'}
					<div class="f-alert-icon f-alert-icon-destructive" aria-hidden="true">
						<svg
							viewBox="0 0 24 24"
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
							/>
							<line x1="12" y1="9" x2="12" y2="13" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</div>
				{/if}

				<div class="f-alert-text">
					<h3 id={titleId} class="f-alert-title">{title}</h3>
					{#if description}
						<p id={descId} class="f-alert-desc">{description}</p>
					{/if}
				</div>
			</div>

			{#if children}
				<div class="f-alert-body">
					{@render children()}
				</div>
			{/if}

			<div class="f-alert-footer">
				<button
					bind:this={cancelBtnEl}
					type="button"
					class="f-alert-btn f-alert-btn-cancel"
					disabled={loading}
					onclick={handleCancel}
				>
					{cancelText}
				</button>
				<button
					type="button"
					class="f-alert-btn f-alert-btn-confirm"
					data-variant={confirmVariant}
					disabled={loading}
					onclick={handleConfirm}
				>
					{#if loading}
						<span class="f-alert-spinner" aria-hidden="true"></span>
					{/if}
					<span>{confirmText}</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-alert-backdrop {
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
			animation: f-alert-fade-in var(--f-duration-normal) var(--f-ease);
		}

		.f-alert-panel {
			position: relative;
			width: 100%;
			max-width: 460px;
			box-sizing: border-box;
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xl);
			box-shadow: var(--f-shadow-xl);
			padding: var(--f-space-xl);
			display: flex;
			flex-direction: column;
			gap: var(--f-space-lg);
			outline: none;
			animation: f-alert-scale-in var(--f-duration-normal) var(--f-ease-spring);
		}

		.f-alert-content {
			display: flex;
			align-items: flex-start;
			gap: var(--f-space-md);
		}

		.f-alert-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 44px;
			height: 44px;
			flex-shrink: 0;
			border-radius: var(--f-radius-full);
		}

		.f-alert-icon-destructive {
			background: var(--f-danger-bg);
			color: var(--f-danger);
		}

		.f-alert-text {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			flex: 1;
		}

		.f-alert-title {
			margin: 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-alert-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.5;
		}

		.f-alert-body {
			font-size: var(--f-text-sm);
			line-height: 1.5;
		}

		.f-alert-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--f-space-sm);
		}

		.f-alert-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--f-space-xs);
			padding: var(--f-space-xs) var(--f-space-md);
			font-family: inherit;
			font-size: var(--f-text-sm);
			font-weight: 500;
			border-radius: var(--f-radius-md);
			cursor: pointer;
			user-select: none;
			border: 1px solid transparent;
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				opacity var(--f-duration-fast) var(--f-ease);
		}

		.f-alert-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-alert-btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.f-alert-btn-cancel {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-alert-btn-cancel:hover:not(:disabled) {
			background: var(--f-hover);
			border-color: var(--f-border-strong);
		}

		.f-alert-btn-confirm[data-variant='destructive'] {
			background: var(--f-danger);
			color: #ffffff;
			border-color: var(--f-danger);
		}

		.f-alert-btn-confirm[data-variant='destructive']:hover:not(:disabled) {
			filter: brightness(0.9);
		}

		.f-alert-btn-confirm[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-color: var(--f-primary);
		}

		.f-alert-btn-confirm[data-variant='primary']:hover:not(:disabled) {
			background: var(--f-primary-hover);
		}

		.f-alert-spinner {
			width: 14px;
			height: 14px;
			border: 2px solid currentColor;
			border-top-color: transparent;
			border-radius: 50%;
			animation: f-alert-spin 0.6s linear infinite;
		}

		@keyframes f-alert-spin {
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes f-alert-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes f-alert-scale-in {
			from {
				opacity: 0;
				transform: scale(0.96) translateY(6px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}
</style>
