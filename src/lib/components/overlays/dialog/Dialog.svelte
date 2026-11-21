<!-- @component A modal dialog on the native <dialog> element, with a spring pop and a blurred backdrop. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLDialogAttributes  } from 'svelte/elements';
	import { luX } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/helpers.js';
	import type { ChildTextColor, ChildTextSize, Gap, Measure, TextSize, Surface } from '../../../internal/tokens.js';
	import { Button } from '../../actions/button/index.js';
	import {
		type DialogScrollBehavior,
		type OverlayContent,
		type OverlayTrigger
	} from './dialog.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string | Snippet;
		description?: string | Snippet;
		width?: Measure;
		gap?: Gap;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		bodyTextSize?: TextSize;
		childTextColor?: ChildTextColor;
		dismissible?: boolean;
		closeButton?: boolean;
		closeButtonProps?: ComponentProps<typeof Button>;
		scrollBehavior?: DialogScrollBehavior;
		surface?: Surface;
		trigger?: Snippet<[OverlayTrigger]>;
		children?: Snippet<[OverlayContent]>;
		footer?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		width = 'measure-md',
		gap = 'gap-xs',
		textSize = 'text-lg',
		childTextSize = 'text-sm',
		bodyTextSize = 'text-md',
		childTextColor = 'text-secondary',
		dismissible = true,
		closeButton = true,
		closeButtonProps,
		scrollBehavior = 'inside',
		surface = 'overlayed',
		trigger,
		children,
		footer,
		class: className,
		...rest
	}: Props = $props();

	const id = $props.id();
	const titleId = `${id}card-title`;
	const descId = `${id}card-desc`;

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
	const full = $derived(width === 'measure-full');
	const content: OverlayContent = { close };
</script>

{#snippet text(value: string | Snippet)}
	{#if typeof value === 'string'}{value}{:else}{@render value()}{/if}
{/snippet}

{#snippet panel()}
	{#if title || description}
		<header class={['box px-lg pt-lg pb-md', gap, closeButton && 'pr-2xl']}>
			{#if title}
				<h2 id={titleId} class={['weight-600 lh12 ls-tight-bs', textSize]}>{@render text(title)}</h2>
			{/if}
			{#if description}
				<p id={descId} class={['lh15', childTextSize, childTextColor]}>{@render text(description)}</p>
			{/if}
		</header>
	{/if}
	{#if children}
		<div
			class={[
				'px-lg lh15',
				bodyTextSize,
				childTextColor,
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
		<Button
			variant="ghost"
			size="h-sm"
			textColor="text-muted"
			icon={luX}
			aria-label="Close"
			onclick={close}
			{...closeButtonProps}
			class={['btn-icon pin-tr', closeButtonProps?.class]}
		/>
	{/if}
{/snippet}

{@render trigger?.(api)}

{#if outside}
	<dialog
		{id}
		class={['dialog fullscreen scroll-y scroll-thin pop enter-up', className]}
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
			<div class={['relative box ta-l radius-lg', surface, width]}>
				{@render panel()}
			</div>
		</div>
	</dialog>
{:else}
	<dialog
		{id}
		class={[
			'dialog open-column pop enter-scale radius-lg',
			surface,
			full ? 'hfull' : width,
			className
		]}
		aria-labelledby={title ? titleId : undefined}
		aria-describedby={description ? descId : undefined}
		{@attach dialogSync(() => open, setOpen, { dismissible })}
		{...rest}
	>
		{@render panel()}
	</dialog>
{/if}
