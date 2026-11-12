<!-- @component A row (<tr>); `selected` gives it the selected fill. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableRowElement> {
		/** Marks the row as selected: it takes the selected fill. Say so in the row too (a checkbox, a label) for assistive technology. */
		selected?: boolean;
		/** The cells. */
		children?: Snippet;
	}

	let { selected = false, class: klass, children, ...rest }: Props = $props();
</script>

<tr class={[selected && 'selected', klass]} {...rest}>
	{@render children?.()}
</tr>
