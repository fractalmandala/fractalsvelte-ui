<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: Orientation;
		attached?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		attached = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-btn-group {className}"
	data-orientation={orientation}
	data-attached={attached}
	role="group"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-btn-group {
			display: inline-flex;
			align-items: stretch;
			box-sizing: border-box;
		}

		.f-btn-group[data-orientation='horizontal'] {
			flex-direction: row;
		}

		.f-btn-group[data-orientation='vertical'] {
			flex-direction: column;
		}

		/* Attached variant */
		.f-btn-group[data-attached='true'][data-orientation='horizontal'] > :global(.f-btn:not(:first-child)),
		.f-btn-group[data-attached='true'][data-orientation='horizontal'] > :global(.f-icon-btn:not(:first-child)) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			margin-left: -1px;
		}

		.f-btn-group[data-attached='true'][data-orientation='horizontal'] > :global(.f-btn:not(:last-child)),
		.f-btn-group[data-attached='true'][data-orientation='horizontal'] > :global(.f-icon-btn:not(:last-child)) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		.f-btn-group[data-attached='true'][data-orientation='vertical'] > :global(.f-btn:not(:first-child)),
		.f-btn-group[data-attached='true'][data-orientation='vertical'] > :global(.f-icon-btn:not(:first-child)) {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			margin-top: -1px;
		}

		.f-btn-group[data-attached='true'][data-orientation='vertical'] > :global(.f-btn:not(:last-child)),
		.f-btn-group[data-attached='true'][data-orientation='vertical'] > :global(.f-icon-btn:not(:last-child)) {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		/* Unattached variant (gap) */
		.f-btn-group[data-attached='false'] {
			gap: var(--f-space-xs);
		}
	}
</style>
