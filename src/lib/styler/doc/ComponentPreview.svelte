<!-- @component A docs block showing a live component demo with its code. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeSnippet from '../typography/CodeSnippet.svelte';

	interface Props {
		title: string;
		description?: string | null;
		code?: string;
		class?: string;
		children?: Snippet;
		controls?: Snippet;
	}

	let { title, description, code = '', class: className = '', children, controls }: Props = $props();
</script>

<section class="card box gap-md {className}">
	<header class="row ytop xbetween gap-md">
		<div class="box gap-xs min0">
			<h2 class="page-heading-lg">{title}</h2>
			{#if description}<p class="text-body-sm text-secondary">{description}</p>{/if}
		</div>
	</header>
	<div class="row xcenter ycenter wrap gap-md pad-xl bg-sunken border-subtle radius-md">
		{@render children?.()}
	</div>
	{#if controls}<div class="row ycenter wrap gap-sm pt-sm bt-sub">{@render controls()}</div>{/if}
	{#if code}<CodeSnippet {code} language="svelte" />{/if}
</section>
