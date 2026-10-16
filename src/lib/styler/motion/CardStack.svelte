<script lang="ts" module>
	export interface CardStackItemData {
		id: string;
		title?: string;
		description?: string;
		badge?: string;
		[key: string]: any;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luChevronLeft, luChevronRight } from 'fractalicons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: CardStackItemData[];
		activeIndex?: number;
		/** Swipe distance (px) that flips to the next card */
		threshold?: number;
		class?: string;
		cardSnippet?: Snippet<[{ item: CardStackItemData; index: number; isTop: boolean }]>;
		onswipe?: (item: CardStackItemData, direction: 'left' | 'right') => void;
	}

	let {
		items = [],
		activeIndex = $bindable(0),
		threshold = 80,
		class: className = '',
		cardSnippet,
		onswipe,
		...restProps
	}: Props = $props();

	const count = $derived(items.length);
	const index = $derived(count ? ((activeIndex % count) + count) % count : 0);
	const top = $derived(items[index]);
	let startX: number | null = null;

	export function next() {
		if (count) activeIndex = (index + 1) % count;
	}
	export function prev() {
		if (count) activeIndex = (index - 1 + count) % count;
	}

	function onpointerup(e: PointerEvent) {
		if (startX === null) return;
		const dx = e.clientX - startX;
		startX = null;
		if (Math.abs(dx) < threshold || count < 2) return;
		const current = top;
		next();
		onswipe?.(current, dx > 0 ? 'right' : 'left');
	}
</script>

<!-- No transforms or z-index in fractalstyler: the top card is the only full
     card, and the cards behind it show as two inset edges below it. A swipe is
     read from the pointer travel; the card itself does not follow the finger. -->
<div class="box gap-md {className}" {...restProps}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions (focusable carousel region: arrows flip cards) -->
	<div
		class="box"
		role="region"
		aria-roledescription="carousel"
		aria-label="Stacked cards"
		onpointerdown={(e) => (startX = e.clientX)}
		{onpointerup}
		onpointercancel={() => (startX = null)}
		onkeydown={(e) => {
			if (e.key === 'ArrowRight') next();
			else if (e.key === 'ArrowLeft') prev();
		}}
		tabindex="0"
	>
		{#if top}
			<div class="card box gap-sm shadow-md" data-variant="primary" data-shape="curved" data-pad="lg" aria-live="polite">
				{#if cardSnippet}
					{@render cardSnippet({ item: top, index, isTop: true })}
				{:else}
					{#if top.badge}<span class="chip bg-extra text-theme">{top.badge}</span>{/if}
					<h4 class="card-title">{top.title ?? `Card ${index + 1}`}</h4>
					{#if top.description}<p class="card-desc text-secondary">{top.description}</p>{/if}
				{/if}
			</div>
			{#if count > 1}<div class="mx-md py-xs bg-sunken border-subtle radius-sm" aria-hidden="true"></div>{/if}
			{#if count > 2}<div class="mx-xl py-xs bg-extra border-subtle radius-sm" aria-hidden="true"></div>{/if}
		{/if}
	</div>
	{#if count > 1}
		<div class="row ycenter xcenter gap-md">
			<button type="button" data-variant="secondary" data-size="lg" data-shape="round" class="frame-1-1 px-xs" aria-label="Previous card" onclick={prev}>
				<Icon icon={luChevronLeft} />
			</button>
			<div class="row ycenter gap-xs" aria-hidden="true">
				{#each items as item, i (item.id)}
					<svg viewBox="0 0 8 8" width="0.5em" height="0.5em" class={i === index ? 'text-theme' : 'text-muted'}>
						<circle cx="4" cy="4" r="4" fill="currentColor" />
					</svg>
				{/each}
			</div>
			<button type="button" data-variant="secondary" data-size="lg" data-shape="round" class="frame-1-1 px-xs" aria-label="Next card" onclick={next}>
				<Icon icon={luChevronRight} />
			</button>
		</div>
	{/if}
</div>
