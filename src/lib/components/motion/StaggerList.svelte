<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface StaggerListItem {
		id: string;
		[key: string]: any;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: StaggerListItem[];
		stagger?: number; // ms delay per item
		class?: string;
		itemSnippet?: Snippet<[{ item: StaggerListItem; index: number }]>;
		children?: Snippet;
	}

	let {
		items = [],
		stagger = 60,
		class: className = '',
		itemSnippet,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-stagger-list {className}"
	role="list"
	{...restProps}
>
	{#if itemSnippet}
		{#each items as item, index (item.id)}
			<div
				class="f-stagger-item"
				role="listitem"
				style="animation-delay: {index * stagger}ms;"
			>
				{@render itemSnippet({ item, index })}
			</div>
		{/each}
	{:else if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-stagger-list {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			width: 100%;
			box-sizing: border-box;
		}

		.f-stagger-item {
			opacity: 0;
			animation: f-stagger-slide-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}

		@keyframes f-stagger-slide-in {
			0% {
				opacity: 0;
				transform: translateY(14px) scale(0.97);
			}
			100% {
				opacity: 1;
				transform: translateY(0) scale(1);
			}
		}
	}
</style>
