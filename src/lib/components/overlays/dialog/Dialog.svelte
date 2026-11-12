<!-- @component A modal dialog on the native <dialog> element, with a spring pop and a blurred backdrop. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { luX } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/floating.js';
	import { vars } from '../../../motion/index.js';
	import { Button } from '../../actions/button/index.js';
	import {
		dialogWidth,
		surfaceClass,
		type DialogScrollBehavior,
		type DialogSize,
		type OverlayContent,
		type OverlaySurface,
		type OverlayTrigger
	} from './dialog.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		/** Whether the dialog is open. Bind it, or let the `trigger` drive it. */
		open?: boolean;
		/** Called whenever the dialog opens or closes — by the trigger, Esc, the backdrop or the close button. */
		onOpenChange?: (open: boolean) => void;
		/** The heading. Wired to the dialog as its accessible name (`aria-labelledby`). */
		title?: string | Snippet;
		/** A line under the heading. Wired as the accessible description (`aria-describedby`). */
		description?: string | Snippet;
		/** The width, on the measure ladder. `full` fills the viewport less a margin. */
		size?: DialogSize;
		/** Whether Esc and a click on the backdrop close the dialog. */
		dismissible?: boolean;
		/** Shows a close button in the top-right corner. */
		closeButton?: boolean;
		/** `inside` scrolls the body between a fixed header and footer; `outside` lets the whole panel scroll past the viewport. */
		scrollBehavior?: DialogScrollBehavior;
		/** The panel fill: opaque, or frosted glass. */
		surface?: OverlaySurface;
		/** Renders the element that opens the dialog. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
		/** The body. Receives `close`. */
		children?: Snippet<[OverlayContent]>;
		/** The action row at the bottom, aligned to the end. Receives `close`. */
		footer?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		size = 'md',
		dismissible = true,
		closeButton = true,
		scrollBehavior = 'inside',
		surface = 'solid',
		trigger,
		children,
		footer,
		class: klass,
		...rest
	}: Props = $props();

	const id = $props.id();
	const titleId = `${id}-title`;
	const descId = `${id}-desc`;

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}
	const show = () => setOpen(true);
	const close = () => setOpen(false);
	const toggle = () => setOpen(!open);

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': id,
			onclick: show
		},
		isOpen: open,
		open: show,
		close,
		toggle
	});

	const outside = $derived(scrollBehavior === 'outside');
	const outsideWidth: Record<DialogSize, string> = {
		sm: 'measure-sm',
		md: 'measure-md',
		lg: 'measure-lg',
		xl: 'measure-xl',
		full: 'wfull'
	};
	const content: OverlayContent = { close };
</script>

{#snippet text(value: string | Snippet)}
	{#if typeof value === 'string'}{value}{:else}{@render value()}{/if}
{/snippet}

{#snippet panel()}
	{#if title || description}
		<header class={['box gap-xs px-lg pt-lg pb-md', closeButton && 'pr-2xl']}>
			{#if title}
				<h2 id={titleId} class="text-lg weight-600 lh12 ls-tight-bs text-primary">{@render text(title)}</h2>
			{/if}
			{#if description}
				<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>
			{/if}
		</header>
	{/if}
	{#if children}
		<div
			class={[
				'px-lg text-md lh15 text-secondary',
				!(title || description) && 'pt-lg',
				!footer && 'pb-lg',
				!outside && 'grow min0 scroll-y scroll-thin'
			]}
		>
			{@render children(content)}
		</div>
	{/if}
	{#if footer}
		<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub">
			{@render footer(content)}
		</footer>
	{/if}
	{#if closeButton}
		<Button variant="ghost" size="sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />
	{/if}
{/snippet}

{@render trigger?.(api)}

{#if outside}
	<dialog
		{id}
		class={['dialog fullscreen scroll-y scroll-thin pop enter-up', klass]}
		aria-labelledby={title ? titleId : undefined}
		aria-describedby={description ? descId : undefined}
		{@attach dialogSync(() => open, setOpen, { dismissible })}
		{...rest}
	>
		<!-- the margin around the panel acts as the backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class="box xcenter py-2xl px-md"
			onclick={(event) => {
				if (dismissible && event.target === event.currentTarget) close();
			}}
		>
			<div class={['relative box ta-l radius-lg shad-2xl', surfaceClass[surface], outsideWidth[size]]}>
				{@render panel()}
			</div>
		</div>
	</dialog>
{:else}
	<dialog
		{id}
		class={[
			'dialog open-column sized pop enter-scale radius-lg shad-2xl',
			surfaceClass[surface],
			size === 'full' && 'hfull',
			klass
		]}
		aria-labelledby={title ? titleId : undefined}
		aria-describedby={description ? descId : undefined}
		{@attach dialogSync(() => open, setOpen, { dismissible })}
		{@attach vars({ size: dialogWidth[size] })}
		{...rest}
	>
		{@render panel()}
	</dialog>
{/if}
