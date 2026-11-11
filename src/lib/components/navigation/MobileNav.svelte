<!-- @component A slide-in navigation panel for small screens. -->

<script lang="ts">
	import type { TextSize } from '$lib/types.js';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klX } from '$lib/icons/keylinestroke.js';
	import Modal, { type ModalPlacement } from '../core/Modal.svelte';

	export type MobileNavPosition = 'left' | 'right' | 'top' | 'bottom';

	interface Props {
		open?: boolean;
		position?: MobileNavPosition;
		title?: string;
		closeOnBackdrop?: boolean;
		textsize?: TextSize;
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		position = 'left',
		title = '',
		closeOnBackdrop = true,
		textsize = 'text-md',
		class: className = '',
		header,
		children,
		footer
	}: Props = $props();

	const PLACE: Record<MobileNavPosition, ModalPlacement> = {
		left: 'left',
		right: 'right',
		top: 'top-edge',
		bottom: 'bottom-edge'
	};
</script>

<!-- A native modal drawer: focus trap, Escape and backdrop from the platform. -->
<Modal bind:open placement={PLACE[position]} {closeOnBackdrop} aria-label={title || 'Navigation'} panelClass="{textsize} {className}">
	<header class="row ycenter xbetween gap-md px-md py-sm bb">
		{#if header}
			{@render header()}
		{:else}
			<span class="page-heading-bs">{title}</span>
		{/if}
		<button type="button" class="btn-icon inline-flex row xcenter ycenter ghost h-lg mincurved text-muted" aria-label="Close navigation" onclick={() => (open = false)}>
			<Icon icon={klX} />
		</button>
	</header>
	<nav class="box gap-xs pad-sm grow scroll-y" aria-label={title || 'Navigation'}>
		{@render children?.()}
	</nav>
	{#if footer}<footer class="box gap-xs pad-sm bt">{@render footer()}</footer>{/if}
</Modal>
