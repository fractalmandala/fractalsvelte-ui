/**
 * Motion attachments — `{@attach …}` factories for gestures, scroll and layout.
 *
 * Every attachment writes ONLY CSS custom properties (plus, for `inView`, a
 * state class); the stylesheet's `.motion` / `.tilt` classes turn them into
 * real transforms. Every attachment cleans up on teardown and honours reduced
 * motion (`prefers-reduced-motion` or `globalMotion.scale === 0`).
 */
import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { animate, getMotion, getVelocity, setMotion } from './animate.js';
import { reducedMotion } from './global.svelte.js';
import type { SpringInput } from './spring.js';

// ───────────────────────────── internals ─────────────────────────────

type MotionNode = HTMLElement | SVGElement;

function fmt(n: number): string {
	const r = Math.round(n * 10000) / 10000;
	return String(Object.is(r, -0) ? 0 : r);
}

function clamp(n: number, lo: number, hi: number): number {
	return Math.min(hi, Math.max(lo, n));
}

const passive: AddEventListenerOptions = { passive: true };

/** A job in the shared scroll frame: every `read` runs before any `write`. */
interface FrameJob {
	read(): void;
	write(): void;
}

const scrollJobs = new Set<FrameJob>();
let scrollFrame = 0;

function runScrollFrame(): void {
	scrollFrame = 0;
	const jobs = Array.from(scrollJobs);
	for (const job of jobs) job.read();
	for (const job of jobs) job.write();
}

function requestScrollFrame(): void {
	if (scrollFrame === 0) scrollFrame = requestAnimationFrame(runScrollFrame);
}

/** Register a scroll-linked job; shares one passive scroll/resize listener and one rAF across all jobs. */
function addScrollJob(job: FrameJob): () => void {
	if (scrollJobs.size === 0) {
		window.addEventListener('scroll', requestScrollFrame, passive);
		window.addEventListener('resize', requestScrollFrame, passive);
	}
	scrollJobs.add(job);
	requestScrollFrame();
	return () => {
		scrollJobs.delete(job);
		if (scrollJobs.size === 0) {
			window.removeEventListener('scroll', requestScrollFrame);
			window.removeEventListener('resize', requestScrollFrame);
			if (scrollFrame !== 0) cancelAnimationFrame(scrollFrame);
			scrollFrame = 0;
		}
	};
}

/** IntersectionObserver wrapper shared by `inView` and `reveal`. Returns a disconnect function. */
function observe(
	node: Element,
	opts: { once: boolean; amount: number; margin: string | undefined },
	enter: () => void,
	leave: () => void
): () => void {
	if (typeof IntersectionObserver === 'undefined') {
		enter();
		return () => {};
	}
	const amount = clamp(opts.amount, 0, 1);
	let inside = false;
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const rootHeight = entry.rootBounds?.height ?? Infinity;
				const visible =
					entry.isIntersecting &&
					(entry.intersectionRatio >= amount - 0.001 ||
						// Elements taller than the viewport can never reach a large ratio.
						entry.intersectionRect.height >= rootHeight * amount);
				if (visible && !inside) {
					inside = true;
					enter();
					if (opts.once) io.disconnect();
				} else if (!entry.isIntersecting && inside) {
					inside = false;
					leave();
				}
			}
		},
		{ threshold: amount > 0 ? [0, amount] : [0], rootMargin: opts.margin ?? '0px' }
	);
	io.observe(node);
	return () => io.disconnect();
}

/** rAF-coalesce a pointer handler: only the latest event per frame is processed. */
function throttled(fn: (e: PointerEvent) => void): { push(e: PointerEvent): void; cancel(): void } {
	let frame = 0;
	let last: PointerEvent | null = null;
	return {
		push(e) {
			last = e;
			if (frame === 0) {
				frame = requestAnimationFrame(() => {
					frame = 0;
					if (last) fn(last);
				});
			}
		},
		cancel() {
			if (frame !== 0) cancelAnimationFrame(frame);
			frame = 0;
			last = null;
		}
	};
}

// ───────────────────────────── vars ─────────────────────────────

/**
 * Bind CSS custom properties to an element — the sanctioned way to pass
 * dynamic values to the stylesheet. Keys may be given with or without the
 * leading `--`; `null`/`undefined` removes the property. Numbers are written
 * unitless. Called inline in a template it re-runs whenever its arguments change.
 *
 * @example
 * ```svelte
 * <div class="fill" {@attach vars({ value: progress })}></div>
 * ```
 * @param values Custom property values by name.
 */
export function vars(values: Record<string, string | number | null | undefined>): Attachment<HTMLElement> {
	return (node) => {
		const written: string[] = [];
		for (const [key, value] of Object.entries(values)) {
			const prop = key.startsWith('--') ? key : `--${key}`;
			if (value === null || value === undefined || (typeof value === 'number' && !Number.isFinite(value))) {
				node.style.removeProperty(prop);
				continue;
			}
			node.style.setProperty(prop, typeof value === 'number' ? fmt(value) : value);
			written.push(prop);
		}
		return () => {
			for (const prop of written) node.style.removeProperty(prop);
		};
	};
}

// ───────────────────────────── magnetic ─────────────────────────────

/**
 * Pull the element toward the pointer while it is within `radius` px of the
 * element's bounds; it springs back when the pointer moves away. Mouse and
 * pen only. Requires the `.motion` class. Disabled under reduced motion.
 * @param options `strength` (0..1, default `0.35`), `radius` (px beyond the bounds, default `40`), `spring` (default `'snappy'`).
 */
export function magnetic(
	options: { strength?: number; radius?: number; spring?: SpringInput } = {}
): Attachment<HTMLElement> {
	const strength = clamp(options.strength ?? 0.35, 0, 1);
	const radius = Math.max(0, options.radius ?? 40);
	const spring = options.spring ?? 'snappy';
	return (node) => {
		let engaged = false;
		const release = (): void => {
			if (!engaged) return;
			engaged = false;
			animate(node, { x: 0, y: 0 }, { spring });
		};
		const update = throttled((e) => {
			if (reducedMotion.current) return release();
			const r = node.getBoundingClientRect();
			// Undo our own offset so the pull is measured from the resting position.
			const cx = r.left - getMotion(node, 'x') + r.width / 2;
			const cy = r.top - getMotion(node, 'y') + r.height / 2;
			const dx = e.clientX - cx;
			const dy = e.clientY - cy;
			if (Math.abs(dx) <= r.width / 2 + radius && Math.abs(dy) <= r.height / 2 + radius) {
				engaged = true;
				animate(node, { x: dx * strength, y: dy * strength }, { spring });
			} else {
				release();
			}
		});
		const onMove = (e: PointerEvent): void => {
			if (e.pointerType !== 'touch') update.push(e);
		};
		const root = document.documentElement;
		document.addEventListener('pointermove', onMove, passive);
		root.addEventListener('pointerleave', release, passive);
		return () => {
			update.cancel();
			document.removeEventListener('pointermove', onMove);
			root.removeEventListener('pointerleave', release);
			if (engaged) setMotion(node, { x: 0, y: 0 });
		};
	};
}

// ───────────────────────────── tilt ─────────────────────────────

/**
 * 3D tilt toward the pointer. Writes `--rx`/`--ry` (and `--ms` for the lift
 * scale). Requires the `.tilt` class (plus `.motion` for the scale). With
 * `glare`, also writes the pointer position as `--px`/`--py` percentages for
 * a highlight layer. Disabled under reduced motion.
 * @param options `max` tilt in degrees (default `10`), `scale` while hovered (default `1.02`), `spring` (default `'snappy'`), `glare` (default `false`).
 */
export function tilt(
	options: { max?: number; scale?: number; spring?: SpringInput; glare?: boolean } = {}
): Attachment<HTMLElement> {
	const max = options.max ?? 10;
	const scale = options.scale ?? 1.02;
	const spring = options.spring ?? 'snappy';
	const glare = options.glare ?? false;
	return (node) => {
		let rect: DOMRect | null = null;
		const invalidate = (): void => {
			rect = null;
		};
		const update = throttled((e) => {
			if (reducedMotion.current) return;
			rect ??= node.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			const fx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
			const fy = clamp((e.clientY - rect.top) / rect.height, 0, 1);
			animate(node, { rotateX: (0.5 - fy) * 2 * max, rotateY: (fx - 0.5) * 2 * max, scale }, { spring });
			if (glare) {
				node.style.setProperty('--px', `${fmt(fx * 100)}%`);
				node.style.setProperty('--py', `${fmt(fy * 100)}%`);
			}
		});
		const onEnter = (): void => {
			// Measure at rest-ish, before the tilt distorts the bounding box.
			rect = node.getBoundingClientRect();
			window.addEventListener('scroll', invalidate, passive);
		};
		const onLeave = (): void => {
			update.cancel();
			rect = null;
			window.removeEventListener('scroll', invalidate);
			animate(node, { rotateX: 0, rotateY: 0, scale: 1 }, { spring });
		};
		node.addEventListener('pointerenter', onEnter, passive);
		node.addEventListener('pointermove', update.push, passive);
		node.addEventListener('pointerleave', onLeave, passive);
		return () => {
			update.cancel();
			window.removeEventListener('scroll', invalidate);
			node.removeEventListener('pointerenter', onEnter);
			node.removeEventListener('pointermove', update.push);
			node.removeEventListener('pointerleave', onLeave);
			setMotion(node, { rotateX: 0, rotateY: 0, scale: 1 });
			if (glare) {
				node.style.removeProperty('--px');
				node.style.removeProperty('--py');
			}
		};
	};
}

// ───────────────────────────── press ─────────────────────────────

/**
 * Spring the element's scale down while pressed — pointer, or Enter/Space
 * from the keyboard — and back on release. Requires the `.motion` class.
 * Disabled under reduced motion.
 * @param options `scale` while pressed (default `0.96`), `spring` (default `'stiff'`).
 */
export function press(options: { scale?: number; spring?: SpringInput } = {}): Attachment<HTMLElement> {
	const scale = options.scale ?? 0.96;
	const spring = options.spring ?? 'stiff';
	return (node) => {
		let pressed = false;
		const down = (): void => {
			if (pressed || reducedMotion.current) return;
			pressed = true;
			animate(node, { scale }, { spring });
		};
		const up = (): void => {
			if (!pressed) return;
			pressed = false;
			animate(node, { scale: 1 }, { spring });
		};
		const onPointerDown = (e: PointerEvent): void => {
			if (e.button === 0) down();
		};
		const onKeyDown = (e: KeyboardEvent): void => {
			if (!e.repeat && e.target === node && (e.key === 'Enter' || e.key === ' ')) down();
		};
		const onKeyUp = (e: KeyboardEvent): void => {
			if (e.key === 'Enter' || e.key === ' ') up();
		};
		node.addEventListener('pointerdown', onPointerDown, passive);
		node.addEventListener('pointerup', up, passive);
		node.addEventListener('pointercancel', up, passive);
		node.addEventListener('pointerleave', up, passive);
		node.addEventListener('keydown', onKeyDown, passive);
		node.addEventListener('keyup', onKeyUp, passive);
		node.addEventListener('blur', up, passive);
		return () => {
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
			node.removeEventListener('pointerleave', up);
			node.removeEventListener('keydown', onKeyDown);
			node.removeEventListener('keyup', onKeyUp);
			node.removeEventListener('blur', up);
			if (pressed) setMotion(node, { scale: 1 });
		};
	};
}

// ───────────────────────────── hover ─────────────────────────────

/**
 * Spring lift while hovered (mouse/pen) or keyboard-focused (`:focus-visible`
 * on the element or a descendant). Requires the `.motion` class. Disabled
 * under reduced motion.
 * @param options `scale` (default `1.02`), `y` offset in px (default `-4`, i.e. up), `spring` (default `'snappy'`).
 */
export function hover(options: { scale?: number; y?: number; spring?: SpringInput } = {}): Attachment<HTMLElement> {
	const scale = options.scale ?? 1.02;
	const y = options.y ?? -4;
	const spring = options.spring ?? 'snappy';
	return (node) => {
		let hovered = false;
		let focused = false;
		let lifted = false;
		const apply = (): void => {
			const on = (hovered || focused) && !reducedMotion.current;
			if (on === lifted) return;
			lifted = on;
			animate(node, on ? { scale, y } : { scale: 1, y: 0 }, { spring });
		};
		const onEnter = (e: PointerEvent): void => {
			if (e.pointerType === 'touch') return;
			hovered = true;
			apply();
		};
		const onLeave = (): void => {
			hovered = false;
			apply();
		};
		const onFocusIn = (e: FocusEvent): void => {
			focused = e.target instanceof Element && e.target.matches(':focus-visible');
			apply();
		};
		const onFocusOut = (e: FocusEvent): void => {
			if (e.relatedTarget instanceof Node && node.contains(e.relatedTarget)) return;
			focused = false;
			apply();
		};
		node.addEventListener('pointerenter', onEnter, passive);
		node.addEventListener('pointerleave', onLeave, passive);
		node.addEventListener('focusin', onFocusIn, passive);
		node.addEventListener('focusout', onFocusOut, passive);
		return () => {
			node.removeEventListener('pointerenter', onEnter);
			node.removeEventListener('pointerleave', onLeave);
			node.removeEventListener('focusin', onFocusIn);
			node.removeEventListener('focusout', onFocusOut);
			if (lifted) setMotion(node, { scale: 1, y: 0 });
		};
	};
}

// ───────────────────────────── pointer ─────────────────────────────

/**
 * Track the pointer over the element as `--px`/`--py` (for spotlights and
 * gradients), rAF-throttled. With `unit: 'fraction'` (default) the values
 * are `0..1` across the element's box — use `calc(var(--px) * 100%)`; with
 * `unit: 'px'` they are unitless pixel offsets from the top-left corner —
 * use `calc(var(--px) * 1px)`. Not motion, so it runs under reduced motion too.
 * @param options `unit`: `'fraction'` (default) or `'px'`.
 */
export function pointer(options: { unit?: 'px' | 'fraction' } = {}): Attachment<HTMLElement> {
	const unit = options.unit ?? 'fraction';
	return (node) => {
		const update = throttled((e) => {
			const r = node.getBoundingClientRect();
			let x = e.clientX - r.left;
			let y = e.clientY - r.top;
			if (unit === 'fraction') {
				x = r.width > 0 ? x / r.width : 0;
				y = r.height > 0 ? y / r.height : 0;
			}
			node.style.setProperty('--px', fmt(x));
			node.style.setProperty('--py', fmt(y));
		});
		node.addEventListener('pointermove', update.push, passive);
		node.addEventListener('pointerenter', update.push, passive);
		return () => {
			update.cancel();
			node.removeEventListener('pointermove', update.push);
			node.removeEventListener('pointerenter', update.push);
			node.style.removeProperty('--px');
			node.style.removeProperty('--py');
		};
	};
}

// ───────────────────────────── inView ─────────────────────────────

/**
 * Toggle a class (default `in`) when the element scrolls into view, via
 * IntersectionObserver — pair it with CSS enter states. Where
 * IntersectionObserver is unavailable the class is added immediately.
 * @param options `once` (default `true`: stop observing after the first entry), `amount` visible fraction (default `0.2`), `margin` (root margin), `class` (default `'in'`), `onEnter`, `onLeave`.
 */
export function inView(
	options: {
		once?: boolean;
		amount?: number;
		margin?: string;
		class?: string;
		onEnter?: () => void;
		onLeave?: () => void;
	} = {}
): Attachment<HTMLElement> {
	const cls = options.class ?? 'in';
	return (node) =>
		observe(
			node,
			{ once: options.once ?? true, amount: options.amount ?? 0.2, margin: options.margin },
			() => {
				node.classList.add(cls);
				options.onEnter?.();
			},
			() => {
				node.classList.remove(cls);
				options.onLeave?.();
			}
		);
}

// ───────────────────────────── reveal ─────────────────────────────

/**
 * Spring the element in from an offset state when it scrolls into view. The
 * element starts at `{ x, y, scale, opacity }` and springs to rest. With
 * `once: false` it springs back out when it leaves. Requires the `.motion`
 * class. Under reduced motion the element is simply shown at rest.
 * @param options `x` (px, default `0`), `y` (px, default `24`), `scale` (default `1`), `opacity` (default `0`), `delay` (ms, default `0`), `spring` (default `'gentle'`), `once` (default `true`), `amount` (default `0.2`).
 */
export function reveal(
	options: {
		x?: number;
		y?: number;
		scale?: number;
		opacity?: number;
		delay?: number;
		spring?: SpringInput;
		once?: boolean;
		amount?: number;
	} = {}
): Attachment<HTMLElement> {
	const offset = { x: options.x ?? 0, y: options.y ?? 24, scale: options.scale ?? 1, opacity: options.opacity ?? 0 };
	const rest = { x: 0, y: 0, scale: 1, opacity: 1 };
	const spring = options.spring ?? 'gentle';
	const delay = Math.max(0, options.delay ?? 0);
	return (node) => {
		if (reducedMotion.current) {
			setMotion(node, rest);
			return;
		}
		setMotion(node, offset);
		let timer: ReturnType<typeof setTimeout> | undefined;
		const disconnect = observe(
			node,
			{ once: options.once ?? true, amount: options.amount ?? 0.2, margin: undefined },
			() => {
				clearTimeout(timer);
				if (delay > 0) timer = setTimeout(() => animate(node, rest, { spring }), delay);
				else animate(node, rest, { spring });
			},
			() => {
				clearTimeout(timer);
				animate(node, offset, { spring });
			}
		);
		return () => {
			clearTimeout(timer);
			disconnect();
		};
	};
}

// ───────────────────────────── stagger ─────────────────────────────

/**
 * Number a container's items for staggered CSS motion: writes `--i` (the
 * item's stagger index) on each item and `--stagger` (the step, e.g. `60ms`)
 * on the container, so CSS can use `transition-delay: calc(var(--i) * var(--stagger))`.
 * Re-indexes when the child list changes. Under reduced motion `--stagger` is `0ms`.
 * @param options `selector` for items (default: direct children), `step` in ms (default `60`), `from`: `'first'` (default), `'last'` or `'center'`.
 */
export function stagger(
	options: { selector?: string; step?: number; from?: 'first' | 'last' | 'center' } = {}
): Attachment<HTMLElement> {
	const step = Math.max(0, options.step ?? 60);
	const from = options.from ?? 'first';
	const selector = options.selector;
	return (node) => {
		node.style.setProperty('--stagger', `${reducedMotion.current ? 0 : step}ms`);
		let items: MotionNode[] = [];
		const update = (): void => {
			const list = (selector ? Array.from(node.querySelectorAll(selector)) : Array.from(node.children)).filter(
				(el): el is MotionNode => el instanceof HTMLElement || el instanceof SVGElement
			);
			const n = list.length;
			list.forEach((el, i) => {
				const index = from === 'last' ? n - 1 - i : from === 'center' ? Math.abs(i - (n - 1) / 2) : i;
				el.style.setProperty('--i', fmt(index));
			});
			items = list;
		};
		update();
		const mo = new MutationObserver(update);
		mo.observe(node, { childList: true, subtree: selector !== undefined });
		return () => {
			mo.disconnect();
			node.style.removeProperty('--stagger');
			for (const el of items) el.style.removeProperty('--i');
		};
	};
}

// ───────────────────────────── drag ─────────────────────────────

/** The drag gesture's state, passed to the drag callbacks. */
export interface DragState {
	/** Current offset on x (px, the `--mx` channel). */
	x: number;
	/** Current offset on y (px, the `--my` channel). */
	y: number;
	/** Pointer movement on x since the drag started (px). */
	dx: number;
	/** Pointer movement on y since the drag started (px). */
	dy: number;
	/** Pointer velocity on x (px/s). */
	vx: number;
	/** Pointer velocity on y (px/s). */
	vy: number;
}

interface Limits {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

/**
 * Make the element draggable with springs. Uses pointer capture; the element
 * should carry `.motion` (for the offset), `touch-none` (so touch drags are
 * not scrolls) and usually `select-none`.
 *
 * Bounds are offsets relative to the resting position: `'parent'` keeps it
 * inside its parent's box, a function returns a container `DOMRect`, or pass
 * explicit `{ left, right, top, bottom }` offset limits. Past a bound the
 * element rubber-bands by `elastic`. On release with `momentum`, the release
 * velocity carries it on and it springs to rest inside the bounds; with
 * `snapBack` it springs home. A drag that moved suppresses the following click.
 * Under reduced motion dragging still works but release settles instantly.
 *
 * @param options `axis` (`'both'`), `bounds`, `snapBack` (`false`), `momentum` (`true`), `elastic` (0..1, `0.35`), `spring` (`'snappy'`), `disabled`, `onDragStart`, `onDrag`, `onDragEnd`.
 */
export function drag(
	options: {
		axis?: 'x' | 'y' | 'both';
		bounds?: 'parent' | { left?: number; right?: number; top?: number; bottom?: number } | (() => DOMRect);
		snapBack?: boolean;
		momentum?: boolean;
		elastic?: number;
		spring?: SpringInput;
		disabled?: boolean;
		onDragStart?: (s: DragState) => void;
		onDrag?: (s: DragState) => void;
		onDragEnd?: (s: DragState) => void;
	} = {}
): Attachment<HTMLElement> {
	const axis = options.axis ?? 'both';
	const useX = axis !== 'y';
	const useY = axis !== 'x';
	const elastic = clamp(options.elastic ?? 0.35, 0, 1);
	const momentum = options.momentum ?? true;
	const snapBack = options.snapBack ?? false;
	const spring = options.spring ?? 'snappy';
	return (node) => {
		if (options.disabled) return;
		let pointerId: number | null = null;
		let startX = 0;
		let startY = 0;
		let originX = 0;
		let originY = 0;
		let limits: Limits | null = null;
		let samples: { t: number; x: number; y: number }[] = [];
		let moved = false;
		let suppressClick = false;
		const state: DragState = { x: 0, y: 0, dx: 0, dy: 0, vx: 0, vy: 0 };

		const computeLimits = (): Limits | null => {
			const b = options.bounds;
			if (!b) return null;
			if (typeof b === 'object') {
				return {
					left: b.left ?? -Infinity,
					right: b.right ?? Infinity,
					top: b.top ?? -Infinity,
					bottom: b.bottom ?? Infinity
				};
			}
			const box = b === 'parent' ? node.parentElement?.getBoundingClientRect() : b();
			if (!box) return null;
			const r = node.getBoundingClientRect();
			const mx = getMotion(node, 'x');
			const my = getMotion(node, 'y');
			// Offsets at which each edge meets the container (measured from the resting box).
			const a = box.left - (r.left - mx);
			const c = box.right - (r.right - mx);
			const d = box.top - (r.top - my);
			const e = box.bottom - (r.bottom - my);
			// An element larger than its container may travel between the two alignments.
			return { left: Math.min(a, c), right: Math.max(a, c), top: Math.min(d, e), bottom: Math.max(d, e) };
		};

		const band = (v: number, lo: number, hi: number): number => {
			if (v < lo) return lo - (lo - v) * elastic;
			if (v > hi) return hi + (v - hi) * elastic;
			return v;
		};

		const velocity = (now: number): void => {
			const recent = samples.filter((s) => now - s.t <= 100);
			if (recent.length < 2) {
				state.vx = 0;
				state.vy = 0;
				return;
			}
			const a = recent[0];
			const b = recent[recent.length - 1];
			const dt = (b.t - a.t) / 1000;
			state.vx = dt > 0 && useX ? (b.x - a.x) / dt : 0;
			state.vy = dt > 0 && useY ? (b.y - a.y) / dt : 0;
		};

		const onPointerDown = (e: PointerEvent): void => {
			if (pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
			pointerId = e.pointerId;
			node.setPointerCapture(e.pointerId);
			startX = e.clientX;
			startY = e.clientY;
			originX = getMotion(node, 'x');
			originY = getMotion(node, 'y');
			// Catch the element mid-flight: freeze any running spring where it is.
			setMotion(node, { x: originX, y: originY });
			limits = computeLimits();
			samples = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
			moved = false;
			suppressClick = false;
			Object.assign(state, { x: originX, y: originY, dx: 0, dy: 0, vx: 0, vy: 0 });
			options.onDragStart?.({ ...state });
		};

		const onPointerMove = (e: PointerEvent): void => {
			if (e.pointerId !== pointerId) return;
			const dx = useX ? e.clientX - startX : 0;
			const dy = useY ? e.clientY - startY : 0;
			let x = originX + dx;
			let y = originY + dy;
			if (limits) {
				x = band(x, limits.left, limits.right);
				y = band(y, limits.top, limits.bottom);
			}
			if (!moved && Math.hypot(dx, dy) > 3) moved = true;
			samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
			if (samples.length > 20) samples = samples.slice(-20);
			velocity(e.timeStamp);
			setMotion(node, { x, y });
			Object.assign(state, { x, y, dx, dy });
			options.onDrag?.({ ...state });
		};

		const onPointerUp = (e: PointerEvent): void => {
			if (e.pointerId !== pointerId) return;
			pointerId = null;
			if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
			velocity(e.timeStamp);
			suppressClick = moved;
			const x = getMotion(node, 'x');
			const y = getMotion(node, 'y');
			let tx = x;
			let ty = y;
			if (snapBack) {
				tx = 0;
				ty = 0;
			} else {
				if (momentum) {
					// Project where the release velocity would carry it (≈ 0.2 s of travel).
					tx = x + state.vx * 0.2;
					ty = y + state.vy * 0.2;
				}
				if (limits) {
					tx = clamp(tx, limits.left, limits.right);
					ty = clamp(ty, limits.top, limits.bottom);
				}
			}
			const carry = momentum || snapBack;
			const to: { x?: number; y?: number } = {};
			if (useX) to.x = tx;
			if (useY) to.y = ty;
			animate(node, to, { spring, velocity: carry ? { x: state.vx, y: state.vy } : { x: 0, y: 0 } });
			Object.assign(state, { x, y });
			options.onDragEnd?.({ ...state });
		};

		const onClick = (e: MouseEvent): void => {
			if (!suppressClick) return;
			suppressClick = false;
			e.preventDefault();
			e.stopPropagation();
		};

		node.addEventListener('pointerdown', onPointerDown, passive);
		node.addEventListener('pointermove', onPointerMove, passive);
		node.addEventListener('pointerup', onPointerUp, passive);
		node.addEventListener('pointercancel', onPointerUp, passive);
		node.addEventListener('click', onClick, { capture: true });
		return () => {
			if (pointerId !== null && node.hasPointerCapture(pointerId)) node.releasePointerCapture(pointerId);
			pointerId = null;
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointermove', onPointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerUp);
			node.removeEventListener('click', onClick, { capture: true });
		};
	};
}

// ───────────────────────────── parallax ─────────────────────────────

/**
 * Scroll-linked parallax: offsets the element by `speed` × its distance from
 * the viewport centre, written to `--my` (or `--mx`). Positive speeds lag
 * behind the scroll (background feel), negative ones lead it. Shares one
 * passive scroll listener and one rAF (all reads before all writes) with every
 * other scroll attachment. Requires the `.motion` class. Off under reduced motion.
 * @param options `speed` (-1..1, default `0.2`), `axis` (`'y'` default, or `'x'`).
 */
export function parallax(options: { speed?: number; axis?: 'x' | 'y' } = {}): Attachment<HTMLElement> {
	const speed = clamp(options.speed ?? 0.2, -1, 1);
	const axis = options.axis ?? 'y';
	return (node) => {
		let next = 0;
		let current = Number.NaN;
		const remove = addScrollJob({
			read() {
				if (reducedMotion.current) {
					next = 0;
					return;
				}
				const r = node.getBoundingClientRect();
				const offset = getMotion(node, axis);
				const center = axis === 'y' ? r.top + r.height / 2 - offset : r.left + r.width / 2 - offset;
				const viewport = axis === 'y' ? window.innerHeight / 2 : window.innerWidth / 2;
				next = -(center - viewport) * speed;
			},
			write() {
				if (Math.abs(next - current) < 0.05) return;
				current = next;
				setMotion(node, axis === 'y' ? { y: next } : { x: next });
			}
		});
		return () => {
			remove();
			setMotion(node, axis === 'y' ? { y: 0 } : { x: 0 });
		};
	};
}

// ───────────────────────────── scrollProgress ─────────────────────────────

/**
 * Write scroll progress `0..1` to `--value` on the element (progress bars,
 * scroll-linked fills). `target: 'page'` (default) tracks the document's
 * scroll; `'element'` tracks the element's own passage through the viewport
 * (0 as it enters, 1 as it leaves). Shares the scroll frame with `parallax`.
 * @param options `target` (`'page'` | `'element'`), `axis` (`'y'` default, or `'x'`).
 */
export function scrollProgress(
	options: { target?: 'page' | 'element'; axis?: 'x' | 'y' } = {}
): Attachment<HTMLElement> {
	const target = options.target ?? 'page';
	const axis = options.axis ?? 'y';
	return (node) => {
		let next = 0;
		let current = Number.NaN;
		const remove = addScrollJob({
			read() {
				if (target === 'page') {
					const el = document.scrollingElement ?? document.documentElement;
					const max = axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
					const pos = axis === 'y' ? el.scrollTop : el.scrollLeft;
					next = max > 0 ? clamp(pos / max, 0, 1) : 0;
				} else {
					const r = node.getBoundingClientRect();
					const view = axis === 'y' ? window.innerHeight : window.innerWidth;
					const start = axis === 'y' ? r.top : r.left;
					const size = axis === 'y' ? r.height : r.width;
					next = view + size > 0 ? clamp((view - start) / (view + size), 0, 1) : 0;
				}
			},
			write() {
				if (Math.abs(next - current) < 0.0005) return;
				current = next;
				node.style.setProperty('--value', fmt(next));
			}
		});
		return () => {
			remove();
			node.style.removeProperty('--value');
		};
	};
}

// ───────────────────────────── FLIP ─────────────────────────────

/**
 * FLIP layout animation with springs. Attach `flip.attach` to a container;
 * call `read()` before the DOM changes and `play()` after it (`await tick()`
 * first), or just `await flip.run(() => …)`. Items are matched across the
 * change by `data-flip-id`; each springs from its old position (and size, as a
 * uniform scale when the aspect ratio is kept) to its new one — interruptible,
 * carrying velocity. New items fade/scale in. Items need the `.motion` class.
 * Under reduced motion layout changes are instant.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	const flip = createFlip({ spring: 'snappy' });
 * 	let items = $state(['a', 'b', 'c']);
 * 	const shuffle = () => flip.run(() => { items = items.toReversed(); });
 * </script>
 * <ul {@attach flip.attach}>
 * 	{#each items as id (id)}<li class="motion" data-flip-id={id}>{id}</li>{/each}
 * </ul>
 * ```
 * @param options `spring` (default `'snappy'`), `selector` for items (default `[data-flip-id]`).
 */
export function createFlip(options: { spring?: SpringInput; selector?: string } = {}): {
	attach: Attachment<HTMLElement>;
	read(): void;
	play(): void;
	/** read → run fn → await tick → play */
	run(fn: () => void | Promise<void>): Promise<void>;
} {
	const spring = options.spring ?? 'snappy';
	const selector = options.selector ?? '[data-flip-id]';
	let container: HTMLElement | null = null;
	let first = new Map<string, DOMRect>();

	const items = (): { el: MotionNode; id: string }[] => {
		if (!container) return [];
		const out: { el: MotionNode; id: string }[] = [];
		for (const el of Array.from(container.querySelectorAll(selector))) {
			if (!(el instanceof HTMLElement || el instanceof SVGElement)) continue;
			const id = el.getAttribute('data-flip-id');
			if (id !== null) out.push({ el, id });
		}
		return out;
	};

	const read = (): void => {
		first = new Map();
		for (const { el, id } of items()) first.set(id, el.getBoundingClientRect());
	};

	const play = (): void => {
		const before = first;
		first = new Map();
		if (!container || reducedMotion.current) return;
		// Read phase: every measurement before any write.
		const plans = items().map(({ el, id }) => ({
			el,
			from: before.get(id),
			last: el.getBoundingClientRect(),
			x: getMotion(el, 'x'),
			y: getMotion(el, 'y'),
			s: getMotion(el, 'scale'),
			vx: getVelocity(el, 'x'),
			vy: getVelocity(el, 'y'),
			vs: getVelocity(el, 'scale')
		}));
		// Write phase.
		for (const p of plans) {
			if (!p.from) {
				if (before.size > 0) {
					setMotion(p.el, { opacity: 0, scale: 0.96 });
					animate(p.el, { opacity: 1, scale: 1 }, { spring });
				}
				continue;
			}
			const dx = p.from.left + p.from.width / 2 - (p.last.left + p.last.width / 2);
			const dy = p.from.top + p.from.height / 2 - (p.last.top + p.last.height / 2);
			let s = p.s;
			if (p.last.width > 0 && p.last.height > 0) {
				const ws = p.from.width / p.last.width;
				const hs = p.from.height / p.last.height;
				if (Math.abs(ws - hs) <= 0.05 * Math.max(ws, hs)) s = p.s * Math.sqrt(ws * hs);
			}
			if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(s - p.s) < 0.001) continue;
			setMotion(p.el, { x: p.x + dx, y: p.y + dy, scale: s });
			animate(p.el, { x: 0, y: 0, scale: 1 }, { spring, velocity: { x: p.vx, y: p.vy, scale: p.vs } });
		}
	};

	return {
		attach: (node) => {
			container = node;
			return () => {
				if (container === node) container = null;
				first = new Map();
			};
		},
		read,
		play,
		async run(fn) {
			read();
			await fn();
			await tick();
			play();
		}
	};
}
