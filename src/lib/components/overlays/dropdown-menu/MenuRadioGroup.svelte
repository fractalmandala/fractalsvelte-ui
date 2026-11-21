<!-- @component A group that keeps one radio item selected. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { getMenu, setMenuRadio } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: string;
		onValueChange?: (value: string) => void;
		children?: Snippet;
	}

	let { value = $bindable(''), onValueChange, children, class: className, ...rest }: Props = $props();

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

<div role="group" class={['box', className]} {...rest}>
	{@render children?.()}
</div>
