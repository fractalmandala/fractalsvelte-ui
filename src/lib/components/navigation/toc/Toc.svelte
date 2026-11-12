<!-- @component A table of contents with a scroll-spy and a spring-driven marker beside the active heading. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, reducedMotion } from '../../../motion/index.js';
	import type { TocItem } from './items.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The headings to list. When omitted, they are collected from `container`. */
		items?: TocItem[];
		/** A selector for the element whose headings are collected, when `items` is omitted. */
		container?: string;
		/** The heading selector used when collecting from `container`. */
		headingSelector?: string;
		/** The active heading's id. Two-way bindable, and updated by the scroll spy. */
		active?: string | null;
		/** Called whenever the active heading changes. */
		onActiveChange?: (id: string | null) => void;
		/** Accessible name of the navigation. */
		label?: string;
	}

	let {
		items,
		container,
		headingSelector = 'h2, h3, h4',
		active = $bindable(null),
		onActiveChange,
		label = 'On this page',
		class: klass,
		...rest
	}: Props = $props();

	let collected = $state<TocItem[]>([]);
	const entries = $derived(items && items.length > 0 ? items : collected);

	let root = $state<HTMLElement>();
	let indicator = $state<HTMLElement>();
	let placed = false;

	function collect(): TocItem[] {
		if (typeof document === 'undefined' || !container) return [];
		const scope = document.querySelector(container);
		if (!scope) return [];
		const headings = scope.querySelectorAll<HTMLElement>(headingSelector);
		const out: TocItem[] = [];
		for (const heading of headings) {
			if (!heading.id) continue;
			const level = Number(heading.tagName.replace(/^H/i, '')) || 2;
			const text = heading.textContent?.trim();
			if (text) out.push({ id: heading.id, label: text, level });
		}
		return out;
	}

	function setActive(id: string | null) {
		if (active === id) return;
		active = id;
		onActiveChange?.(id);
	}

	function place(instant = false) {
		const list = root;
		const mark = indicator;
		if (!list || !mark) return;
		const current = list.querySelector<HTMLElement>('[data-toc-link][aria-current="true"]');
		if (!current) {
			animate(mark, { '--ix': 0, '--iy': 0, '--iw': 0, '--ih': 0 }, { instant: true });
			return;
		}
		const g = list.getBoundingClientRect();
		const b = current.getBoundingClientRect();
		animate(
			mark,
			{ '--ix': 0, '--iy': b.top - g.top, '--iw': 2, '--ih': b.height },
			{ instant: instant || !placed, spring: 'snappy' }
		);
		placed = true;
	}

	function go(id: string, event: MouseEvent) {
		event.preventDefault();
		const target = document.getElementById(id);
		if (!target) return;
		target.scrollIntoView({ behavior: reducedMotion.current ? 'auto' : 'smooth', block: 'start' });
		setActive(id);
	}

	const padFor = (level: number): string => {
		if (level <= 2) return 'pl-sm';
		if (level === 3) return 'pl-lg';
		return 'pl-2xl';
	};

	$effect(() => {
		items;
		container;
		headingSelector;
		if (items && items.length > 0) {
			collected = [];
			return;
		}
		collected = collect();
		if (typeof MutationObserver === 'undefined' || !container) return;
		const scope = document.querySelector(container);
		if (!scope) return;
		const mo = new MutationObserver(() => {
			collected = collect();
		});
		mo.observe(scope, { subtree: true, childList: true, characterData: true });
		return () => mo.disconnect();
	});

	$effect(() => {
		const list = entries;
		if (typeof IntersectionObserver === 'undefined' || list.length === 0) return;
		const els = list
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => !!el);
		if (els.length === 0) return;
		const visible = new Map<string, number>();
		const io = new IntersectionObserver(
			(records) => {
				for (const record of records) {
					const id = record.target.id;
					if (record.isIntersecting) visible.set(id, record.intersectionRatio);
					else visible.delete(id);
				}
				let next: string | null = null;
				let best = -1;
				for (const item of list) {
					const ratio = visible.get(item.id);
					if (ratio !== undefined && ratio > best) {
						best = ratio;
						next = item.id;
					}
				}
				if (next) setActive(next);
			},
			{ rootMargin: '0px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
		);
		for (const el of els) io.observe(el);
		return () => io.disconnect();
	});

	$effect(() => {
		active;
		entries;
		const frame = requestAnimationFrame(() => place());
		const list = root;
		if (!list || typeof ResizeObserver === 'undefined') {
			return () => cancelAnimationFrame(frame);
		}
		const ro = new ResizeObserver(() => place(true));
		ro.observe(list);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});
</script>

<nav bind:this={root} aria-label={label} class={['toc-section relative bl', klass]} {...rest}>
	<div bind:this={indicator} class="indicator rule" aria-hidden="true"></div>
	<p class="nav-header text-muted">{label}</p>
	<ol class="column">
		{#each entries as item (item.id)}
			<li>
				<a
					href="#{item.id}"
					data-toc-link
					class={[
						'toc-link item',
						padFor(item.level),
						item.id === active && 'selected text-primary'
					]}
					aria-current={item.id === active ? 'true' : undefined}
					onclick={(event) => go(item.id, event)}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ol>
</nav>
