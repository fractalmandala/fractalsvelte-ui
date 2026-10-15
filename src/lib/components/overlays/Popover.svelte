<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Placement } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Bindable open state */
		open?: boolean;
		/** Anchored floating placement */
		placement?: Placement;
		/** Pixel gap distance between trigger and popover */
		offset?: number;
		/** Close popover when clicking outside */
		closeOnClickOutside?: boolean;
		/** Close popover on Escape key press */
		closeOnEscape?: boolean;
		/** Show visual directional arrow pointing to trigger */
		arrow?: boolean;
		/** Additional CSS classes for popover content */
		class?: string;
		/** Callback triggered on open state change */
		onopenchange?: (open: boolean) => void;
		/** Slotted trigger element receiving state and toggle helper */
		trigger?: Snippet<[{ open: boolean; toggle: () => void }]>;
		/** Popover body content */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		offset = 8,
		closeOnClickOutside = true,
		closeOnEscape = true,
		arrow = false,
		class: className = '',
		onopenchange,
		trigger,
		children,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let popoverEl: HTMLDivElement | undefined = $state();

	function toggle() {
		open = !open;
		onopenchange?.(open);
	}

	function close() {
		if (!open) return;
		open = false;
		onopenchange?.(false);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (open && event.key === 'Escape' && closeOnEscape) {
			event.preventDefault();
			event.stopPropagation();
			close();
		}
	}

	$effect(() => {
		if (!open || !closeOnClickOutside || typeof document === 'undefined') return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			if (containerEl && !containerEl.contains(target) && (!popoverEl || !popoverEl.contains(target))) {
				close();
			}
		}

		document.addEventListener('mousedown', handleClickOutside, true);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<div
	bind:this={containerEl}
	class="f-popover-container"
>
	{#if trigger}
		{@render trigger({ open, toggle })}
	{/if}

	{#if open}
		<div
			bind:this={popoverEl}
			role="dialog"
			tabindex="-1"
			class="f-popover-panel {className}"
			data-placement={placement}
			data-has-arrow={arrow ? 'true' : 'false'}
			style:--f-popover-offset="{offset}px"
			{...restProps}
		>
			{#if arrow}
				<span class="f-popover-arrow" aria-hidden="true"></span>
			{/if}
			<div class="f-popover-inner">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-popover-container {
			position: relative;
			display: inline-block;
		}

		.f-popover-panel {
			position: absolute;
			z-index: var(--f-z-popover, 1100);
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			box-shadow: var(--f-shadow-lg);
			outline: none;
			box-sizing: border-box;
			animation: f-popover-appear var(--f-duration-fast) var(--f-ease);
		}

		.f-popover-inner {
			padding: var(--f-space-md);
			max-height: 400px;
			overflow-y: auto;
		}

		/* Placements */
		.f-popover-panel[data-placement='bottom'] {
			top: calc(100% + var(--f-popover-offset, 8px));
			left: 50%;
			transform: translateX(-50%);
		}
		.f-popover-panel[data-placement='bottom-start'] {
			top: calc(100% + var(--f-popover-offset, 8px));
			left: 0;
		}
		.f-popover-panel[data-placement='bottom-end'] {
			top: calc(100% + var(--f-popover-offset, 8px));
			right: 0;
		}

		.f-popover-panel[data-placement='top'] {
			bottom: calc(100% + var(--f-popover-offset, 8px));
			left: 50%;
			transform: translateX(-50%);
		}
		.f-popover-panel[data-placement='top-start'] {
			bottom: calc(100% + var(--f-popover-offset, 8px));
			left: 0;
		}
		.f-popover-panel[data-placement='top-end'] {
			bottom: calc(100% + var(--f-popover-offset, 8px));
			right: 0;
		}

		.f-popover-panel[data-placement='left'] {
			right: calc(100% + var(--f-popover-offset, 8px));
			top: 50%;
			transform: translateY(-50%);
		}
		.f-popover-panel[data-placement='left-start'] {
			right: calc(100% + var(--f-popover-offset, 8px));
			top: 0;
		}
		.f-popover-panel[data-placement='left-end'] {
			right: calc(100% + var(--f-popover-offset, 8px));
			bottom: 0;
		}

		.f-popover-panel[data-placement='right'] {
			left: calc(100% + var(--f-popover-offset, 8px));
			top: 50%;
			transform: translateY(-50%);
		}
		.f-popover-panel[data-placement='right-start'] {
			left: calc(100% + var(--f-popover-offset, 8px));
			top: 0;
		}
		.f-popover-panel[data-placement='right-end'] {
			left: calc(100% + var(--f-popover-offset, 8px));
			bottom: 0;
		}

		/* Arrow */
		.f-popover-arrow {
			position: absolute;
			width: 8px;
			height: 8px;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			transform: rotate(45deg);
			z-index: -1;
		}

		.f-popover-panel[data-placement^='bottom'] .f-popover-arrow {
			top: -5px;
			left: 50%;
			margin-left: -4px;
			border-bottom-color: transparent;
			border-right-color: transparent;
		}
		.f-popover-panel[data-placement^='top'] .f-popover-arrow {
			bottom: -5px;
			left: 50%;
			margin-left: -4px;
			border-top-color: transparent;
			border-left-color: transparent;
		}
		.f-popover-panel[data-placement^='left'] .f-popover-arrow {
			right: -5px;
			top: 50%;
			margin-top: -4px;
			border-left-color: transparent;
			border-bottom-color: transparent;
		}
		.f-popover-panel[data-placement^='right'] .f-popover-arrow {
			left: -5px;
			top: 50%;
			margin-top: -4px;
			border-right-color: transparent;
			border-top-color: transparent;
		}

		@keyframes f-popover-appear {
			from {
				opacity: 0;
				transform: scale(0.96);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}
	}
</style>
