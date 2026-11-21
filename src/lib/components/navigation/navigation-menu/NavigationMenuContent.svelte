<!-- @component The flyout body for an item, rendered in the shared viewport. -->

<script lang="ts">
	import { untrack } from 'svelte';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { getNavigationMenu, getNavigationMenuItem } from './navigation-menu.js';
	import type { Pad } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		pad?: Pad;
		children?: Snippet;
	}

	let { pad = 'pad-bs', children, class: className, ...rest }: Props = $props();

	const nav = getNavigationMenu();
	const item = getNavigationMenuItem();
	const active = $derived(nav.value() === item.value);

	let mounted = $state(false);
	let node = $state<HTMLDivElement>();

	$effect(() => {
		mounted = true;
	});

	$effect(() => {
		const el = node;
		const target = nav.viewport();
		if (!el || !target) return;
		if (el.parentElement !== target) target.appendChild(el);
		const unregister = untrack(() => nav.registerPanel());
		return () => {
			unregister();
			if (el.parentElement === target) target.removeChild(el);
		};
	});
</script>

{#if mounted}
	<div
		bind:this={node}
		id={item.contentId}
		data-content={item.value}
		data-active={active ? '' : undefined}
		class={[pad, 'px-md', className]}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
