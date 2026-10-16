<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luPackage } from 'fractalicons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
	}

	let { title, description, class: className = '', icon, action, children, ...restProps }: Props = $props();
</script>

<div class="box xcenter gap-sm py-2xl px-lg {className}" {...restProps}>
	<span class="row xcenter ycenter text-4xl text-muted" aria-hidden="true">
		{#if icon}{@render icon()}{:else}<Icon icon={luPackage} />{/if}
	</span>
	<h3 class="page-heading-lg">{title}</h3>
	{#if description}<p class="text-body text-secondary">{description}</p>{/if}
	{#if children}<div class="box xcenter gap-xs">{@render children()}</div>{/if}
	{#if action}<div class="row xcenter ycenter gap-xs wrap pt-sm">{@render action()}</div>{/if}
</div>
