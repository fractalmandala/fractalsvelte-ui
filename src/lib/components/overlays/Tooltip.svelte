<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Plain text content to display */
		content?: string;
		/** Position placement relative to trigger */
		placement?: TooltipPlacement;
		/** Milliseconds to wait before displaying on hover */
		delay?: number;
		/** Render pointer arrow pointing toward trigger */
		arrow?: boolean;
		/** Disable tooltip appearance */
		disabled?: boolean;
		/** Additional CSS classes for tooltip panel */
		class?: string;
		/** Custom rich HTML tooltip content */
		tooltipSnippet?: Snippet;
		/** Trigger element wrapped by tooltip */
		children?: Snippet;
	}

	let {
		content,
		placement = 'top',
		delay = 200,
		arrow = true,
		disabled = false,
		class: className = '',
		tooltipSnippet,
		children,
		...restProps
	}: Props = $props();

	let visible = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	const tooltipId = `f-tooltip-${Math.random().toString(36).slice(2, 9)}`;

	function show() {
		if (disabled || (!content && !tooltipSnippet)) return;
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hide() {
		if (timeoutId) clearTimeout(timeoutId);
		visible = false;
	}
</script>

<div
	class="f-tooltip-wrapper"
	role="presentation"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	aria-describedby={visible ? tooltipId : undefined}
>
	{#if children}
		{@render children()}
	{/if}

	{#if visible}
		<div
			id={tooltipId}
			role="tooltip"
			class="f-tooltip-panel {className}"
			data-placement={placement}
			data-arrow={arrow ? 'true' : 'false'}
			{...restProps}
		>
			{#if arrow}
				<span class="f-tooltip-arrow" aria-hidden="true"></span>
			{/if}
			{#if tooltipSnippet}
				{@render tooltipSnippet()}
			{:else}
				{content}
			{/if}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-tooltip-wrapper {
			position: relative;
			display: inline-flex;
		}

		.f-tooltip-panel {
			position: absolute;
			z-index: 1000;
			padding: var(--f-space-3xs) var(--f-space-sm);
			font-size: var(--f-text-xs);
			font-weight: 500;
			line-height: 1.4;
			white-space: nowrap;
			background: var(--f-text);
			color: var(--f-text-inverse);
			border-radius: var(--f-radius-sm);
			box-shadow: var(--f-shadow-md);
			pointer-events: none;
			animation: f-tooltip-fade var(--f-duration-fast) var(--f-ease);
		}

		/* Placement offsets */
		.f-tooltip-panel[data-placement='top'] {
			bottom: calc(100% + 6px);
			left: 50%;
			transform: translateX(-50%);
		}

		.f-tooltip-panel[data-placement='bottom'] {
			top: calc(100% + 6px);
			left: 50%;
			transform: translateX(-50%);
		}

		.f-tooltip-panel[data-placement='left'] {
			right: calc(100% + 6px);
			top: 50%;
			transform: translateY(-50%);
		}

		.f-tooltip-panel[data-placement='right'] {
			left: calc(100% + 6px);
			top: 50%;
			transform: translateY(-50%);
		}

		/* Arrow */
		.f-tooltip-arrow {
			position: absolute;
			width: 6px;
			height: 6px;
			background: var(--f-text);
			transform: rotate(45deg);
		}

		.f-tooltip-panel[data-placement='top'] .f-tooltip-arrow {
			bottom: -3px;
			left: 50%;
			margin-left: -3px;
		}

		.f-tooltip-panel[data-placement='bottom'] .f-tooltip-arrow {
			top: -3px;
			left: 50%;
			margin-left: -3px;
		}

		.f-tooltip-panel[data-placement='left'] .f-tooltip-arrow {
			right: -3px;
			top: 50%;
			margin-top: -3px;
		}

		.f-tooltip-panel[data-placement='right'] .f-tooltip-arrow {
			left: -3px;
			top: 50%;
			margin-top: -3px;
		}

		@keyframes f-tooltip-fade {
			from {
				opacity: 0;
				transform: scale(0.95);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}
	}
</style>
