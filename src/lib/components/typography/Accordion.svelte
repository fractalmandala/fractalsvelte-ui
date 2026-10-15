<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface AccordionItemData {
		id: string;
		title: string;
		content?: string;
		disabled?: boolean;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: AccordionItemData[];
		multiple?: boolean;
		value?: string | string[];
		class?: string;
		children?: Snippet;
		itemSnippet?: Snippet<[{ item: AccordionItemData; isOpen: boolean; toggle: () => void }]>;
	}

	let {
		items = [],
		multiple = false,
		value = $bindable(),
		class: className = '',
		children,
		itemSnippet,
		...restProps
	}: Props = $props();

	let internalValue = $state<string[]>(
		value ? (Array.isArray(value) ? value : [value]) : []
	);

	$effect(() => {
		if (value !== undefined) {
			const arr = Array.isArray(value) ? value : [value];
			if (JSON.stringify(arr) !== JSON.stringify(internalValue)) {
				internalValue = arr;
			}
		}
	});

	function isItemOpen(id: string): boolean {
		return internalValue.includes(id);
	}

	function toggleItem(id: string) {
		if (multiple) {
			if (internalValue.includes(id)) {
				internalValue = internalValue.filter((i) => i !== id);
			} else {
				internalValue = [...internalValue, id];
			}
			value = internalValue;
		} else {
			if (internalValue.includes(id)) {
				internalValue = [];
				value = '';
			} else {
				internalValue = [id];
				value = id;
			}
		}
	}
</script>

<div
	class="f-accordion {className}"
	{...restProps}
>
	{#if items.length > 0}
		{#each items as item (item.id)}
			{@const open = isItemOpen(item.id)}
			<div
				class="f-accordion-item"
				data-open={open ? '' : undefined}
				data-disabled={item.disabled ? '' : undefined}
			>
				{#if itemSnippet}
					{@render itemSnippet({ item, isOpen: open, toggle: () => !item.disabled && toggleItem(item.id) })}
				{:else}
					<button
						type="button"
						class="f-accordion-trigger"
						aria-expanded={open}
						aria-controls={`f-acc-content-${item.id}`}
						disabled={item.disabled}
						onclick={() => toggleItem(item.id)}
					>
						<span class="f-accordion-title">{item.title}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="f-accordion-chevron"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>

					<div
						id={`f-acc-content-${item.id}`}
						role="region"
						class="f-accordion-content-wrapper"
						data-open={open ? '' : undefined}
					>
						<div class="f-accordion-content-inner">
							<div class="f-accordion-body">
								{item.content ?? ''}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-accordion {
			width: 100%;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			background: var(--f-surface);
			overflow: hidden;
			box-sizing: border-box;
			font-family: inherit;
		}

		.f-accordion-item {
			border-bottom: 1px solid var(--f-border);
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-accordion-item:last-child {
			border-bottom: none;
		}

		.f-accordion-trigger {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-md);
			padding: var(--f-space-md) var(--f-space-lg);
			background: transparent;
			border: none;
			font-family: inherit;
			font-size: var(--f-text-base);
			font-weight: 500;
			color: var(--f-text);
			text-align: left;
			cursor: pointer;
			user-select: none;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-accordion-trigger:hover:not(:disabled) {
			background: var(--f-hover);
		}

		.f-accordion-trigger:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: -2px;
		}

		.f-accordion-trigger:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.f-accordion-chevron {
			color: var(--f-text-muted);
			flex-shrink: 0;
			transition: transform var(--f-duration-normal) var(--f-ease);
		}

		.f-accordion-item[data-open] .f-accordion-chevron {
			transform: rotate(180deg);
			color: var(--f-primary);
		}

		.f-accordion-content-wrapper {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows var(--f-duration-normal) var(--f-ease);
		}

		.f-accordion-content-wrapper[data-open] {
			grid-template-rows: 1fr;
		}

		.f-accordion-content-inner {
			overflow: hidden;
		}

		.f-accordion-body {
			padding: 0 var(--f-space-lg) var(--f-space-md) var(--f-space-lg);
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.6;
		}
	}
</style>
