<!-- @component A short code snippet in running text. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The code snippet. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<code class={['font-mono text-sm pad-xs bg-panel curved', klass]} {...rest}>{@render children?.()}</code>
