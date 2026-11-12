<!-- @component The host that renders the pile. Mount once near the root of the app. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { createFlip, drag, springFly, vars, type DragState } from '../../../motion/index.js';
	import Toast from './Toast.svelte';
	import { claimToaster, toast, toaster, type ToastItem } from './toast.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Where the pile sits in the viewport. */
		position?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
		/** The number of toasts shown at once. Older ones wait until a slot is free. */
		max?: number;
		/** Default auto-dismiss time, in milliseconds. `0` keeps toasts until they are dismissed. Overridden per toast. */
		duration?: number;
		/** When true, the pile stays expanded. When false, it stacks and expands on hover or focus. */
		expand?: boolean;
	}

	let {
		position = 'top-end',
		max = 3,
		duration = 4000,
		expand = false,
		class: klass,
		...rest
	}: Props = $props();

	const layerClass: Record<NonNullable<Props['position']>, string> = {
		top: 'at-top',
		'top-start': 'at-top-start',
		'top-end': 'at-top-end',
		bottom: 'at-bottom',
		'bottom-start': 'at-bottom-start',
		'bottom-end': 'at-bottom-end'
	};

	const fromTop = $derived(position === 'top' || position === 'top-start' || position === 'top-end');
	const visible = $derived(toaster.items.slice(-Math.max(1, max)).reverse());

	const flip = createFlip({ spring: 'snappy' });

	let layer = $state<HTMLDivElement>();
	let frontH = $state('0px');
	let hovered = $state(false);
	let focused = $state(false);
	let hidden = $state(false);
	let isHost = $state(false);
	const opened = $derived(expand || hovered || focused);

	function measureFront(node: HTMLElement) {
		const apply = () => (frontH = `${node.offsetHeight}px`);
		apply();
		const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply);
		ro?.observe(node);
		return () => ro?.disconnect();
	}

	const timers = new Map<string, { remaining: number; started: number; id: number }>();

	const pause = $derived(hovered || focused || hidden);

	$effect(() => {
		const claim = claimToaster();
		isHost = claim.active;
		return () => claim.release();
	});

	$effect(() => {
		const node = layer;
		if (!node || !isHost) return;
		try {
			node.showPopover();
		} catch {
			// already open, or the Popover API is missing
		}
		return () => {
			try {
				node.hidePopover();
			} catch {
				// already closed
			}
		};
	});


	$effect(() => {
		if (typeof document === 'undefined') return;
		hidden = document.hidden;
		const onVis = () => (hidden = document.hidden);
		document.addEventListener('visibilitychange', onVis);
		return () => document.removeEventListener('visibilitychange', onVis);
	});

	function arm(item: ToastItem) {
		const dur = item.duration ?? duration;
		if (dur <= 0 || item.type === 'loading' || timers.has(item.id)) return;
		const started = Date.now();
		const id = window.setTimeout(() => void dismiss(item.id), dur);
		timers.set(item.id, { remaining: dur, started, id });
	}

	function clearTimer(id: string) {
		const t = timers.get(id);
		if (!t) return;
		if (t.id !== -1) window.clearTimeout(t.id);
		timers.delete(id);
	}

	$effect(() => {
		const ids = new Set(visible.map((t) => t.id));
		for (const id of [...timers.keys()]) if (!ids.has(id)) clearTimer(id);
		if (pause) {
			for (const t of timers.values()) {
				if (t.id === -1) continue;
				window.clearTimeout(t.id);
				t.remaining -= Date.now() - t.started;
				t.id = -1;
			}
			return;
		}
		for (const item of visible) {
			const t = timers.get(item.id);
			if (t) {
				if (t.id !== -1) continue;
				if (t.remaining <= 0) {
					clearTimer(item.id);
					void dismiss(item.id);
					continue;
				}
				t.started = Date.now();
				t.id = window.setTimeout(() => void dismiss(item.id), t.remaining);
			} else {
				arm(item);
			}
		}
	});

	async function dismiss(id: string) {
		clearTimer(id);
		await flip.run(() => toast.dismiss(id));
	}

	function swipe(id: string) {
		return (s: DragState) => {
			if (Math.abs(s.x) > 72 || Math.abs(s.vx) > 700) void dismiss(id);
		};
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		const front = visible[0];
		if (!front) return;
		e.preventDefault();
		void dismiss(front.id);
	}
</script>

{#if isHost}
	<div
		bind:this={layer}
		popover="manual"
		class={['layer', layerClass[position], 'z-toast', klass]}
		onkeydown={onKey}
		{...rest}
	>
		<div
			class={['pile measure-sm', fromTop && 'from-top', opened && 'open', 'gap-sm']}
			role="region"
			aria-label="Notifications"
			tabindex="-1"
			{@attach flip.attach}
			{@attach vars({ 'front-h': frontH })}
			onpointerenter={() => (hovered = true)}
			onpointerleave={() => (hovered = false)}
			onfocusin={() => (focused = true)}
			onfocusout={() => (focused = false)}
		>
			{#each visible as item, i (item.id)}
				<div
					data-flip-id={item.id}
					data-behind={i > 0 ? '' : undefined}
					class="motion touch-none select-none"
					in:springFly={{ y: fromTop ? -24 : 24, spring: 'snappy' }}
					out:springFly={{ y: fromTop ? -24 : 24, spring: 'snappy' }}
					{@attach vars({ depth: i })}
					{@attach i === 0 ? measureFront : undefined}
					{@attach drag({ axis: 'x', snapBack: true, momentum: true, onDragEnd: swipe(item.id) })}
				>
					<Toast
						type={item.type}
						message={item.message}
						description={item.description}
						action={item.action}
						cancel={item.cancel}
						onDismiss={() => dismiss(item.id)}
					/>
				</div>
			{/each}
		</div>
	</div>
{/if}
