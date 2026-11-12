<!-- @component A top app bar with a brand, links and actions, glass on scroll, and a small-screen menu. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luMenu } from '@fractaldesign/icons/lucide';
	import { anchor, floating } from '../../../internal/floating.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The mark or title at the start of the bar. */
		brand?: Snippet;
		/** The primary links, usually `NavbarLink`s. */
		children?: Snippet;
		/** Trailing actions — a search, an account menu, a sign-in button. */
		actions?: Snippet;
		/** Pins the bar to the top of the viewport as the page scrolls. */
		sticky?: boolean;
		/** Adds a glass surface once the page has been scrolled. */
		glassOnScroll?: boolean;
		/** Accessible name of the navigation. */
		label?: string;
		/** Accessible name of the small-screen menu button. */
		menuLabel?: string;
	}

	let {
		brand,
		children,
		actions,
		sticky = true,
		glassOnScroll = true,
		label = 'Site',
		menuLabel = 'Open menu',
		class: klass,
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
		klass
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
					class="button btn-icon ghost modern no-scaling inline-flex"
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
					class="floating at-bottom-end pop enter-down spring-snappy glass border rim shad-lg modern pad-sm measure-xs"
					{@attach floating(uid)}
				>
					<nav class="column gap-xs pad-xs" aria-label={label}>
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
