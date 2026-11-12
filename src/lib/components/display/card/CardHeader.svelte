<!-- @component Groups the title and description, with an optional trailing action. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** A control placed at the trailing edge, such as a menu button or a status tag. */
		action?: Snippet;
		/** The title and description. */
		children?: Snippet;
	}

	let { action, class: klass, children, ...rest }: Props = $props();
</script>

<header class={['row xbetween ytop gap-bs', klass]} {...rest}>
	<div class="box gap-xs grow wmin0">
		{@render children?.()}
	</div>
	{#if action}
		<div class="row ycenter gap-xs shrink-0">
			{@render action()}
		</div>
	{/if}
</header>
