<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { DialogSize } from './Dialog.svelte';

	export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Bindable visibility state of drawer */
		open?: boolean;
		/** Screen edge from which the drawer slides out */
		placement?: DrawerPlacement;
		/** Dimension tier along the sliding axis */
		size?: DialogSize;
		/** Heading title for the drawer */
		title?: string;
		/** Optional descriptive subtitle */
		description?: string;
		/** Close drawer when backdrop is clicked */
		closeOnBackdrop?: boolean;
		/** Close drawer on Escape key press */
		closeOnEscape?: boolean;
		/** Render close icon button in header */
		showCloseButton?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Callback invoked when the drawer closes */
		onclose?: () => void;
		/** Trigger snippet */
		trigger?: Snippet<[{ open: () => void }]>;
		/** Custom full header slot */
		header?: Snippet;
		/** Footer slot */
		footer?: Snippet;
		/** Drawer main content */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'right',
		size = 'md',
		title,
		description,
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

	let drawerEl: HTMLDivElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = null;
	const titleId = `f-drawer-title-${Math.random().toString(36).slice(2, 9)}`;
	const descId = `f-drawer-desc-${Math.random().toString(36).slice(2, 9)}`;

	function openDrawer() {
		open = true;
	}

	function closeDrawer() {
		open = false;
		onclose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			closeDrawer();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!open) return;

		if (event.key === 'Escape' && closeOnEscape) {
			event.preventDefault();
			event.stopPropagation();
			closeDrawer();
			return;
		}

		if (event.key === 'Tab' && drawerEl) {
			const focusables = drawerEl.querySelectorAll<HTMLElement>(
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

			requestAnimationFrame(() => {
				if (drawerEl) {
					const first = drawerEl.querySelector<HTMLElement>(
						'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
					);
					if (first) {
						first.focus();
					} else {
						drawerEl.focus();
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
	{@render trigger({ open: openDrawer })}
{/if}

{#if open}
	<div
		class="f-drawer-backdrop"
		role="presentation"
		onclick={handleBackdropClick}
	>
		<div
			bind:this={drawerEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
			aria-describedby={description ? descId : undefined}
			tabindex="-1"
			class="f-drawer-panel {className}"
			data-placement={placement}
			data-size={size}
			{...restProps}
		>
			{#if showCloseButton}
				<button
					type="button"
					class="f-drawer-close"
					aria-label="Close drawer"
					onclick={closeDrawer}
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
				<div class="f-drawer-header">
					{#if header}
						{@render header()}
					{:else}
						{#if title}
							<h2 id={titleId} class="f-drawer-title">{title}</h2>
						{/if}
						{#if description}
							<p id={descId} class="f-drawer-desc">{description}</p>
						{/if}
					{/if}
				</div>
			{/if}

			{#if children}
				<div class="f-drawer-body">
					{@render children()}
				</div>
			{/if}

			{#if footer}
				<div class="f-drawer-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-drawer-backdrop {
			position: fixed;
			inset: 0;
			z-index: 1000;
			background: var(--f-overlay);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			display: flex;
			box-sizing: border-box;
			animation: f-drawer-fade-in var(--f-duration-normal) var(--f-ease);
		}

		.f-drawer-panel {
			position: fixed;
			background: var(--f-surface);
			color: var(--f-text);
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			box-shadow: var(--f-shadow-xl);
			outline: none;
			z-index: 1001;
			transition: transform var(--f-duration-normal) var(--f-ease);
		}

		/* Placement: Right */
		.f-drawer-panel[data-placement='right'] {
			top: 0;
			right: 0;
			bottom: 0;
			border-left: 1px solid var(--f-border);
			animation: f-drawer-slide-in-right var(--f-duration-normal) var(--f-ease);
		}
		.f-drawer-panel[data-placement='right'][data-size='sm'] {
			width: 320px;
		}
		.f-drawer-panel[data-placement='right'][data-size='md'] {
			width: 440px;
		}
		.f-drawer-panel[data-placement='right'][data-size='lg'] {
			width: 600px;
		}
		.f-drawer-panel[data-placement='right'][data-size='xl'] {
			width: 800px;
		}
		.f-drawer-panel[data-placement='right'][data-size='full'] {
			width: 100vw;
		}

		/* Placement: Left */
		.f-drawer-panel[data-placement='left'] {
			top: 0;
			left: 0;
			bottom: 0;
			border-right: 1px solid var(--f-border);
			animation: f-drawer-slide-in-left var(--f-duration-normal) var(--f-ease);
		}
		.f-drawer-panel[data-placement='left'][data-size='sm'] {
			width: 320px;
		}
		.f-drawer-panel[data-placement='left'][data-size='md'] {
			width: 440px;
		}
		.f-drawer-panel[data-placement='left'][data-size='lg'] {
			width: 600px;
		}
		.f-drawer-panel[data-placement='left'][data-size='xl'] {
			width: 800px;
		}
		.f-drawer-panel[data-placement='left'][data-size='full'] {
			width: 100vw;
		}

		/* Placement: Top */
		.f-drawer-panel[data-placement='top'] {
			top: 0;
			left: 0;
			right: 0;
			border-bottom: 1px solid var(--f-border);
			animation: f-drawer-slide-in-top var(--f-duration-normal) var(--f-ease);
		}
		.f-drawer-panel[data-placement='top'][data-size='sm'] {
			height: 240px;
		}
		.f-drawer-panel[data-placement='top'][data-size='md'] {
			height: 360px;
		}
		.f-drawer-panel[data-placement='top'][data-size='lg'] {
			height: 500px;
		}
		.f-drawer-panel[data-placement='top'][data-size='xl'] {
			height: 700px;
		}
		.f-drawer-panel[data-placement='top'][data-size='full'] {
			height: 100vh;
		}

		/* Placement: Bottom */
		.f-drawer-panel[data-placement='bottom'] {
			bottom: 0;
			left: 0;
			right: 0;
			border-top: 1px solid var(--f-border);
			animation: f-drawer-slide-in-bottom var(--f-duration-normal) var(--f-ease);
		}
		.f-drawer-panel[data-placement='bottom'][data-size='sm'] {
			height: 240px;
		}
		.f-drawer-panel[data-placement='bottom'][data-size='md'] {
			height: 360px;
		}
		.f-drawer-panel[data-placement='bottom'][data-size='lg'] {
			height: 500px;
		}
		.f-drawer-panel[data-placement='bottom'][data-size='xl'] {
			height: 700px;
		}
		.f-drawer-panel[data-placement='bottom'][data-size='full'] {
			height: 100vh;
		}

		.f-drawer-close {
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

		.f-drawer-close:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-drawer-close:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-drawer-header {
			padding: var(--f-space-xl) var(--f-space-xl) var(--f-space-md) var(--f-space-xl);
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			border-bottom: 1px solid var(--f-border-subtle);
		}

		.f-drawer-title {
			margin: 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-drawer-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.45;
		}

		.f-drawer-body {
			flex: 1;
			padding: var(--f-space-lg) var(--f-space-xl);
			overflow-y: auto;
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.5;
		}

		.f-drawer-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--f-space-sm);
			padding: var(--f-space-md) var(--f-space-xl);
			background: var(--f-sunken);
			border-top: 1px solid var(--f-border-subtle);
		}

		@keyframes f-drawer-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes f-drawer-slide-in-right {
			from {
				transform: translateX(100%);
			}
			to {
				transform: translateX(0);
			}
		}

		@keyframes f-drawer-slide-in-left {
			from {
				transform: translateX(-100%);
			}
			to {
				transform: translateX(0);
			}
		}

		@keyframes f-drawer-slide-in-top {
			from {
				transform: translateY(-100%);
			}
			to {
				transform: translateY(0);
			}
		}

		@keyframes f-drawer-slide-in-bottom {
			from {
				transform: translateY(100%);
			}
			to {
				transform: translateY(0);
			}
		}
	}
</style>
