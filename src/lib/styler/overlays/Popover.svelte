<!-- @component A floating panel that opens from a trigger. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Anchor, { type Placement } from './Anchor.svelte';
	import type { Surface, Border, Shadow, Shape, Pad } from '../types';

	interface Props {
		open?: boolean;
		placement?: Placement;
		closeOnClickOutside?: boolean;
		closeOnEscape?: boolean;
		/** Accessible name for the popover panel */
		label?: string;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		padding?: Pad;
		class?: string;
		onopenchange?: (open: boolean) => void;
		trigger?: Snippet<[{ open: boolean; toggle: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		closeOnClickOutside = true,
		closeOnEscape = true,
		label,
		surface = 'bg-surface',
		border = 'border',
		shadow = 'shad-lg',
		shape = 'curved',
		padding = 'pad-md',
		class: className = '',
		onopenchange,
		trigger: triggerSnippet,
		children
	}: Props = $props();

	let rootEl = $state<HTMLDivElement | null>(null);

	function setOpen(v: boolean) {
		if (open === v) return;
		open = v;
		onopenchange?.(v);
	}

	$effect(() => {
		if (!open) return;
		const away = (e: PointerEvent) => {
			if (closeOnClickOutside && rootEl && !rootEl.contains(e.target as Node)) setOpen(false);
		};
		const esc = (e: KeyboardEvent) => {
			if (closeOnEscape && e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('pointerdown', away, true);
		window.addEventListener('keydown', esc);
		return () => {
			document.removeEventListener('pointerdown', away, true);
			window.removeEventListener('keydown', esc);
		};
	});
</script>

<div bind:this={rootEl} class="row">
	<Anchor {placement} {open}>
		{#snippet trigger()}
			{@render triggerSnippet?.({ open, toggle: () => setOpen(!open) })}
		{/snippet}
		{#snippet panel()}
			<div role="dialog" aria-label={label} class="box gap-sm text-body-sm el-shape {padding} {surface} {border} {shadow} {shape} {className}">
				{@render children?.()}
			</div>
		{/snippet}
	</Anchor>
</div>
