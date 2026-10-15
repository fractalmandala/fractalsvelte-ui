<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the mobile menu drawer is currently visible */
		open?: boolean;
		/** Slide-in origin position */
		position?: 'left' | 'right' | 'top' | 'bottom';
		/** Optional drawer title header */
		title?: string;
		/** Whether clicking the backdrop overlay closes the drawer */
		closeOnBackdrop?: boolean;
		/** Whether pressing the Escape key closes the drawer */
		closeOnEscape?: boolean;
		/** Width of the drawer panel (for left/right positions) */
		width?: string;
		/** Additional CSS classes */
		class?: string;
		/** Custom drawer header slot */
		header?: Snippet;
		/** Main navigation links slot */
		children?: Snippet;
		/** Bottom actions/footer slot */
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		position = 'left',
		title = '',
		closeOnBackdrop = true,
		closeOnEscape = true,
		width = '300px',
		class: className = '',
		header,
		children,
		footer,
		...restProps
	}: Props = $props();

	function handleBackdropClick() {
		if (closeOnBackdrop) {
			open = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && closeOnEscape && event.key === 'Escape') {
			event.preventDefault();
			open = false;
		}
	}

	// Lock body scroll when drawer is open
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (open) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="f-mobile-nav-root {className}"
	class:is-open={open}
	data-position={position}
	aria-hidden={!open}
	{...restProps}
>
	<!-- Backdrop overlay -->
	<div
		class="f-mobile-nav-backdrop"
		onclick={handleBackdropClick}
		aria-hidden="true"
	></div>

	<!-- Drawer panel -->
	<div
		class="f-mobile-nav-drawer"
		style="--drawer-width: {width};"
		role="dialog"
		aria-modal="true"
		aria-label={title || 'Mobile Navigation'}
	>
		<div class="f-mobile-nav-header">
			{#if header}
				{@render header()}
			{:else}
				<div class="f-mobile-nav-title">{title}</div>
			{/if}

			<button
				type="button"
				class="f-mobile-nav-close"
				aria-label="Close navigation"
				onclick={() => (open = false)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>
		</div>

		<div class="f-mobile-nav-content">
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if footer}
			<div class="f-mobile-nav-footer">
				{@render footer()}
			</div>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-mobile-nav-root {
			position: fixed;
			inset: 0;
			z-index: 100;
			pointer-events: none;
			visibility: hidden;
			transition: visibility var(--f-duration-normal);
		}

		.f-mobile-nav-root.is-open {
			pointer-events: auto;
			visibility: visible;
		}

		.f-mobile-nav-backdrop {
			position: absolute;
			inset: 0;
			background: var(--f-overlay);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			opacity: 0;
			transition: opacity var(--f-duration-normal) var(--f-ease);
		}

		.f-mobile-nav-root.is-open .f-mobile-nav-backdrop {
			opacity: 1;
		}

		.f-mobile-nav-drawer {
			position: absolute;
			background: var(--f-panel);
			color: var(--f-text);
			display: flex;
			flex-direction: column;
			box-shadow: var(--f-shadow-xl);
			box-sizing: border-box;
			transition: transform var(--f-duration-normal) var(--f-ease-spring);
		}

		/* Positions */
		.f-mobile-nav-root[data-position='left'] .f-mobile-nav-drawer {
			top: 0;
			bottom: 0;
			left: 0;
			width: min(var(--drawer-width, 300px), 85vw);
			border-right: 1px solid var(--f-border);
			transform: translateX(-100%);
		}

		.f-mobile-nav-root[data-position='right'] .f-mobile-nav-drawer {
			top: 0;
			bottom: 0;
			right: 0;
			width: min(var(--drawer-width, 300px), 85vw);
			border-left: 1px solid var(--f-border);
			transform: translateX(100%);
		}

		.f-mobile-nav-root[data-position='top'] .f-mobile-nav-drawer {
			top: 0;
			left: 0;
			right: 0;
			max-height: 80vh;
			border-bottom: 1px solid var(--f-border);
			transform: translateY(-100%);
		}

		.f-mobile-nav-root[data-position='bottom'] .f-mobile-nav-drawer {
			bottom: 0;
			left: 0;
			right: 0;
			max-height: 80vh;
			border-top: 1px solid var(--f-border);
			transform: translateY(100%);
		}

		.f-mobile-nav-root.is-open .f-mobile-nav-drawer {
			transform: translate(0, 0);
		}

		.f-mobile-nav-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: var(--f-space-md);
			border-bottom: 1px solid var(--f-border-subtle);
			flex-shrink: 0;
		}

		.f-mobile-nav-title {
			font-weight: 600;
			font-size: var(--f-text-base);
			color: var(--f-text);
		}

		.f-mobile-nav-close {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			background: transparent;
			border: none;
			border-radius: var(--f-radius-sm);
			color: var(--f-text-muted);
			cursor: pointer;
			padding: 0;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-mobile-nav-close:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-mobile-nav-close:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-mobile-nav-content {
			flex: 1;
			padding: var(--f-space-md);
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-sm);
		}

		.f-mobile-nav-footer {
			padding: var(--f-space-md);
			border-top: 1px solid var(--f-border-subtle);
			flex-shrink: 0;
		}
	}
</style>
