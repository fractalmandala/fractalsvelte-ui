<!-- @component A top app bar with a brand, links and actions, glass on scroll, and a small-screen menu. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luMenu } from '@fractaldesign/icons/lucide';
	import { anchor, floating } from '../../../internal/helpers.js';
	import type { Measure, Pad, Shape, Surface } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		brand?: Snippet;
		children?: Snippet;
		actions?: Snippet;
		sticky?: boolean;
		glassOnScroll?: boolean;
		label?: string;
		menuLabel?: string;
		menuSurface?: Surface;
		menuMeasure?: Measure;
		shape?: Shape;
	}

	let {
		brand,
		children,
		actions,
		sticky = true,
		glassOnScroll = true,
		label = 'Site',
		menuLabel = 'Open menu',
		menuSurface = 'glass',
		menuMeasure = 'measure-xs',
		shape = 'modern',
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const menuId = $derived(`${uid}-menu`);
	let scrolled = $state(false);

	$effect(() => {
		if (!glassOnScroll) {
			scrolled = false;
			return;
		}
		const update = () => {
			const el = document.scrollingElement ?? document.documentElement;
			scrolled = el.scrollTop > 0;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});

	const classes = $derived([
		sticky ? 'app-header' : 'row ycenter',
		(glassOnScroll ? scrolled : false) && 'glass',
		'bg-surface bb',
		className
	]);
</script>

<header class={classes} {...rest}>
	<nav aria-label={label} class="row ycenter xbetween gap-bs wfull">
		<div class="row ycenter gap-lg min0">
			{#if brand}
				<div class="logo-link shrink-0">{@render brand()}</div>
			{/if}
			<div class="md-only">
				<div class="header-nav row ycenter gap-lg">
					{@render children?.()}
				</div>
			</div>
		</div>
		<div class="row ycenter gap-sm shrink-0">
			{#if actions}
				<div class="md-only">
					<div class="row ycenter gap-sm">{@render actions()}</div>
				</div>
			{/if}
			<div class="md-hide">
				<button
					type="button"
					class={['button btn-icon ghost no-scaling inline-flex', shape]}
					popovertarget={menuId}
					aria-label={menuLabel}
					aria-haspopup="dialog"
					{@attach anchor(uid)}
				>
					<Icon icon={luMenu} />
				</button>
				<div
					id={menuId}
					popover="auto"
					class={['floating at-bottom-end pop enter-down spring-snappy', menuSurface, 'pad-sm', menuMeasure, shape]}
					{@attach floating(uid)}
				>
					<nav class={['column gap-xs', 'pad-xs']} aria-label={label}>
						{@render children?.()}
						{#if actions}
							<div class="bt pt-sm mt-xs row ycenter gap-sm wrap">{@render actions()}</div>
						{/if}
					</nav>
				</div>
			</div>
		</div>
	</nav>
</header>
