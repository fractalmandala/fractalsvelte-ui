<!-- @component A group that keeps one radio item selected. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getMenu, setMenuRadio } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The selected item's value. */
		value?: string;
		/** Called when a radio item is chosen. */
		onValueChange?: (value: string) => void;
		/** The radio items. */
		children?: Snippet;
	}

	let { value = $bindable(''), onValueChange, children, class: klass, ...rest }: Props = $props();

	const menu = getMenu();

	function setValue(next: string) {
		value = next;
		onValueChange?.(next);
		menu.close();
	}

	setMenuRadio({
		value: () => value,
		setValue
	});
</script>

<div role="group" class={['box', klass]} {...rest}>
	{@render children?.()}
</div>
