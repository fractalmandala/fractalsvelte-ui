<!-- @component Groups the title and description, with an optional trailing action. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  AlignContent, Gap  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		action?: Snippet;
		gap?: Gap;
		alignContent?: AlignContent;
		children?: Snippet;
	}

	let { action, gap = 'gap-bs', alignContent = 'xbetween', class: className, children, ...rest }: Props = $props();
</script>

<header class={['row ytop', gap, alignContent, className]} {...rest}>
	<div class="box gap-xs grow wmin0">
		{@render children?.()}
	</div>
	{#if action}
		<div class="row ycenter gap-xs shrink-0">
			{@render action()}
		</div>
	{/if}
</header>
