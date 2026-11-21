<!-- @component A row (<tr>); `selected` gives it the selected fill. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableRowElement> {
		selected?: boolean;
		children?: Snippet;
	}

	let { selected = false, class: className, children, ...rest }: Props = $props();
</script>

<tr class={[selected && 'selected', className]} {...rest}>
	{@render children?.()}
</tr>
