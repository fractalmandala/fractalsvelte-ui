<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Hidden members, shown as a "+N" chip. */
		excess?: number;
		class?: string;
		children?: Snippet;
		overflowSnippet?: Snippet<[{ count: number }]>;
	}

	let { excess, class: className = '', children, overflowSnippet, ...restProps }: Props = $props();
</script>

<!-- fractalstyler has no negative margins, so avatars sit side by side on the
     smallest gap rather than overlapping. -->
<div class="row ycenter gap-xs {className}" role="group" {...restProps}>
	{@render children?.()}
	{#if excess && excess > 0}
		{#if overflowSnippet}
			{@render overflowSnippet({ count: excess })}
		{:else}
			<span class="chip bg-sunken text-secondary border shrink-0" aria-label="{excess} more">+{excess}</span>
		{/if}
	{/if}
</div>
