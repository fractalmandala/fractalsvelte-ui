<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		open?: boolean;
		triggerLabel?: string;
		title?: string;
		description?: string;
		class?: string;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet<[{ close: () => void }]>;
		footer?: Snippet<[{ close: () => void }]>;
		onopenchange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		triggerLabel = 'Open Modal',
		title = 'Modal Dialog',
		description,
		class: className = '',
		trigger,
		children,
		footer,
		onopenchange,
		...restProps
	}: Props = $props();

	function openModal() {
		open = true;
		onopenchange?.(true);
	}

	function closeModal() {
		open = false;
		onopenchange?.(false);
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="f-center-morph-container {className}" {...restProps}>
	{#if trigger}
		{@render trigger({ open: openModal })}
	{:else}
		<button
			type="button"
			class="f-morph-trigger-btn"
			onclick={openModal}
		>
			{triggerLabel}
		</button>
	{/if}

	{#if open}
		<!-- Backdrop -->
		<div
			class="f-morph-backdrop"
			role="presentation"
			onclick={handleBackdropClick}
		>
			<div
				class="f-morph-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="f-morph-title"
			>
				<div class="f-morph-header">
					<div class="f-morph-titles">
						<h3 id="f-morph-title" class="f-morph-title">{title}</h3>
						{#if description}
							<p class="f-morph-desc">{description}</p>
						{/if}
					</div>

					<button
						type="button"
						class="f-morph-close-btn"
						aria-label="Close dialog"
						onclick={closeModal}
					>
						<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div class="f-morph-body">
					{#if children}
						{@render children({ close: closeModal })}
					{:else}
						<p>This modal smoothly scaled and morphed from its originating trigger.</p>
					{/if}
				</div>

				{#if footer}
					<div class="f-morph-footer">
						{@render footer({ close: closeModal })}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-center-morph-container {
			display: inline-block;
		}

		.f-morph-trigger-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 8px 18px;
			background: var(--f-primary);
			color: #ffffff;
			border: none;
			border-radius: var(--f-radius-md);
			font-family: inherit;
			font-size: var(--f-text-sm);
			font-weight: 500;
			cursor: pointer;
			box-shadow: var(--f-shadow-sm);
			transition: background var(--f-duration-fast) var(--f-ease), transform var(--f-duration-fast) var(--f-ease);
		}

		.f-morph-trigger-btn:hover {
			background: var(--f-primary-hover);
			transform: translateY(-1px);
		}

		.f-morph-trigger-btn:active {
			transform: translateY(0);
		}

		.f-morph-backdrop {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.65);
			backdrop-filter: blur(6px);
			-webkit-backdrop-filter: blur(6px);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1.5rem;
			z-index: var(--f-z-modal, 1300);
			animation: f-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}

		.f-morph-dialog {
			width: 100%;
			max-width: 480px;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xl);
			box-shadow: var(--f-shadow-xl);
			display: flex;
			flex-direction: column;
			overflow: hidden;
			transform-origin: center center;
			animation: f-morph-scale 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.15);
		}

		.f-morph-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 1.25rem 1.5rem;
			border-bottom: 1px solid var(--f-border);
			gap: 1rem;
		}

		.f-morph-title {
			margin: 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
		}

		.f-morph-desc {
			margin: 0.25rem 0 0 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
		}

		.f-morph-close-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: var(--f-radius-md);
			background: transparent;
			border: none;
			color: var(--f-text-muted);
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease), color var(--f-duration-fast) var(--f-ease);
		}

		.f-morph-close-btn:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-morph-body {
			padding: 1.5rem;
			font-size: var(--f-text-sm);
			color: var(--f-text);
			line-height: 1.6;
		}

		.f-morph-footer {
			padding: 1rem 1.5rem;
			border-top: 1px solid var(--f-border);
			background: var(--f-sunken);
			display: flex;
			justify-content: flex-end;
			gap: 0.75rem;
		}

		@keyframes f-fade-in {
			from { opacity: 0; }
			to { opacity: 1; }
		}

		@keyframes f-morph-scale {
			0% {
				opacity: 0;
				transform: scale(0.85);
			}
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}
	}
</style>
