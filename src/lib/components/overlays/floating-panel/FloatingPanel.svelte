<!-- @component Non-modal draggable, collapsible, and pinnable floating tool panel. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { luMaximize2, luMinus, luPin, luPinOff, luX } from '@fractaldesign/icons/lucide';
	import { IconButton } from '../../actions/icon-button/index.js';
	import type { Shape, Surface } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
		/** Controls whether the panel is mounted/visible; bindable. */
		open?: boolean;
		/** Called when open state changes (for example via the close button or Escape). */
		onOpenChange?: (open: boolean) => void;
		/** Title shown in the draggable header bar. */
		title: string;
		/** Horizontal viewport offset in pixels; bindable. */
		x?: number;
		/** Vertical viewport offset in pixels; bindable. */
		y?: number;
		/** CSS panel width (for example `'22rem'`). */
		width?: string;
		/** Collapses the body and footer while keeping the header bar visible; bindable. */
		minimized?: boolean;
		/** Shows a pin button that locks panel dragging. */
		pinnable?: boolean;
		/** Prevents dragging when `true`; bindable. */
		pinned?: boolean;
		/** Shows a close button in the header. */
		closable?: boolean;
		/** Surface styling on the shared surface axis. */
		surface?: Surface;
		/** Corner shape. */
		shape?: Shape;
		/** Panel body content. */
		children?: Snippet;
		/** Extra controls rendered beside the window buttons in the header. */
		headerActions?: Snippet;
		/** Optional panel footer action row. */
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
		surface = 'elevated',
		shape = 'curved',
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
		class={['floating-panel box pad-none overflow-hidden shad-lg', surface, shape, className]}
		{@attach vars({ 'panel-x': x, 'panel-y': y, 'panel-w': width })}
		{...rest}
	>
		<header
			role="toolbar"
			tabindex="-1"
			aria-label={`${title} window controls`}
			class={['row ycenter xbetween gap-sm px-md py-sm bb bg-panel', !pinned && (dragging ? 'grabbing' : 'grab')]}
			onpointerdown={onHeaderPointerDown}
			onpointermove={onHeaderPointerMove}
			onpointerup={onHeaderPointerUp}
			onpointercancel={onHeaderPointerUp}
		>
			<span class="text-sm weight-600 truncate">{title}</span>
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
					/>
				{/if}
				<IconButton
					variant="ghost"
					size="h-sm"
					icon={minimized ? luMaximize2 : luMinus}
					label={minimized ? 'Expand panel' : 'Minimize panel'}
					aria-expanded={!minimized}
					onclick={() => (minimized = !minimized)}
				/>
				{#if closable}
					<IconButton variant="ghost" size="h-sm" icon={luX} label="Close panel" onclick={close} />
				{/if}
			</div>
		</header>

		{#if !minimized}
			<div class="pad-md scroll-y">
				{@render children?.()}
			</div>
			{#if footer}
				<footer class="px-md py-sm bt bg-panel row xright gap-sm">
					{@render footer()}
				</footer>
			{/if}
		{/if}
	</aside>
{/if}
