<!-- @component Non-modal draggable, collapsible, and pinnable floating tool panel. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { luMaximize2, luMinus, luPin, luPinOff, luX } from '@fractaldesign/icons/lucide';
	import { IconButton } from '../../actions/icon-button/index.js';
	import type {  Pad, Shape, Surface, TextSize  } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title: string;
		x?: number;
		y?: number;
		width?: string;
		minimized?: boolean;
		pinnable?: boolean;
		pinned?: boolean;
		closable?: boolean;
		pinButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		minimizeButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		closeButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		surface?: Surface;
		shape?: Shape;
		textSize?: TextSize;
		children?: Snippet;
		headerActions?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(true),
		onOpenChange,
		title,
		x = $bindable(24),
		y = $bindable(24),
		width = '22rem',
		minimized = $bindable(false),
		pinnable = false,
		pinned = $bindable(false),
		closable = true,
		pinButtonProps,
		minimizeButtonProps,
		closeButtonProps,
		surface = 'elevated',
		shape = 'curved',
		textSize = 'text-sm',
		children,
		headerActions,
		footer,
		class: className,
		...rest
	}: Props = $props();

	let dragging = $state(false);
	let panelEl = $state<HTMLElement | null>(null);
	let offset = { x: 0, y: 0 };

	function close() {
		open = false;
		onOpenChange?.(false);
	}

	function onHeaderPointerDown(event: PointerEvent) {
		if (pinned || event.button > 0) return;
		if (event.target instanceof Element && event.target.closest('button')) return;
		const header = event.currentTarget as HTMLElement;
		header.setPointerCapture(event.pointerId);
		dragging = true;
		offset = { x: event.clientX - x, y: event.clientY - y };
	}

	function onHeaderPointerMove(event: PointerEvent) {
		if (!dragging || pinned) return;
		const maxX = typeof window !== 'undefined' ? Math.max(0, window.innerWidth - (panelEl?.offsetWidth ?? 240)) : 2000;
		const maxY = typeof window !== 'undefined' ? Math.max(0, window.innerHeight - 48) : 2000;
		x = Math.round(Math.min(maxX, Math.max(8, event.clientX - offset.x)));
		y = Math.round(Math.min(maxY, Math.max(8, event.clientY - offset.y)));
	}

	function onHeaderPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const header = event.currentTarget as HTMLElement;
		if (header.hasPointerCapture(event.pointerId)) {
			header.releasePointerCapture(event.pointerId);
		}
	}
</script>

{#if open}
	<aside
		bind:this={panelEl}
		role="dialog"
		aria-modal="false"
		aria-label={title}
		class={['floating-panel box pad-none overflow-hidden', surface, shape, className]}
		{@attach vars({ 'panel-x': x, 'panel-y': y, 'panel-w': width })}
		{...rest}
	>
		<header
			role="toolbar"
			tabindex="-1"
			aria-label={`${title} window controls`}
			class={['row ycenter xbetween gap-sm px-md py-sm bb', !pinned && (dragging ? 'grabbing' : 'grab')]}
			onpointerdown={onHeaderPointerDown}
			onpointermove={onHeaderPointerMove}
			onpointerup={onHeaderPointerUp}
			onpointercancel={onHeaderPointerUp}
		>
			<span class={['weight-600 truncate', textSize]}>{title}</span>
			<div class="row ycenter gap-xs shrink-0">
				{#if headerActions}
					{@render headerActions()}
				{/if}
				{#if pinnable}
					<IconButton
						variant={pinned ? 'secondary' : 'ghost'}
						size="h-sm"
						icon={pinned ? luPinOff : luPin}
						label={pinned ? 'Unpin panel' : 'Pin panel position'}
						aria-pressed={pinned}
						onclick={() => (pinned = !pinned)}
						{...pinButtonProps}
					/>
				{/if}
				<IconButton
					variant="ghost"
					size="h-sm"
					icon={minimized ? luMaximize2 : luMinus}
					label={minimized ? 'Expand panel' : 'Minimize panel'}
					aria-expanded={!minimized}
					onclick={() => (minimized = !minimized)}
					{...minimizeButtonProps}
				/>
				{#if closable}
					<IconButton variant="ghost" size="h-sm" icon={luX} label="Close panel" onclick={close} {...closeButtonProps} />
				{/if}
			</div>
		</header>

		{#if !minimized}
			<div class={['scroll-y', 'pad-md']}>
				{@render children?.()}
			</div>
			{#if footer}
				<footer class="px-md py-sm bt row xright gap-sm">
					{@render footer()}
				</footer>
			{/if}
		{/if}
	</aside>
{/if}
