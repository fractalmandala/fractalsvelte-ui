/**
 * The JS spring engine for DOM elements.
 *
 * `animate()` springs an element's *motion channels* — CSS custom properties
 * that the `.motion` / `.tilt` classes turn into real transforms:
 *
 * | channel | custom property | unit (number written unitless) | rest |
 * |:--|:--|:--|:--|
 * | `x` / `y` | `--mx` / `--my` | px | 0 |
 * | `scale` | `--ms` | factor | 1 |
 * | `rotate` | `--mr` | deg | 0 |
 * | `opacity` | `--mo` | 0..1 | 1 |
 * | `rotateX` / `rotateY` | `--rx` / `--ry` | deg | 0 |
 * | `--anything` | written as-is | — | 0 |
 *
 * JavaScript only ever writes custom properties; the stylesheet owns the
 * real `translate` / `scale` / `rotate` / `opacity` / `transform`.
 */
import { addTicker, integrate } from './loop.js';
import { reducedMotion } from './global.svelte.js';
import { resolveSpring, type SpringConfig, type SpringInput } from './spring.js';

export { globalMotion } from './global.svelte.js';

/** A named motion channel, mapped to a custom property read by `.motion` / `.tilt`. */
export type MotionChannel = 'x' | 'y' | 'scale' | 'rotate' | 'opacity' | 'rotateX' | 'rotateY';

/** Target values by channel name; any `--custom` property may be sprung too. */
export type MotionValues = Partial<Record<MotionChannel, number>> & { [custom: `--${string}`]: number };

/** Options for {@link animate}. */
export interface AnimateOptions {
	/** The spring to use (preset name or partial config). Defaults to `'snappy'`. */
	spring?: SpringInput;
	/** Initial velocities (units per second) by channel name, overriding the carried-over velocity. */
	velocity?: Partial<Record<string, number>>;
	/** Jump straight to the targets with no animation. */
	instant?: boolean;
	/** Called after every frame with the current value of each animated channel (keyed as passed in). */
	onUpdate?: (values: Record<string, number>) => void;
}

/** A running animation. */
export interface AnimationHandle {
	/** Resolves when every channel has settled, been stopped, or been taken over by a newer `animate()` call. */
	finished: Promise<void>;
	/** Stop this animation's channels where they are (velocity is discarded). */
	stop(): void;
}

const CHANNELS: Record<MotionChannel, string> = {
	x: '--mx',
	y: '--my',
	scale: '--ms',
	rotate: '--mr',
	opacity: '--mo',
	rotateX: '--rx',
	rotateY: '--ry'
};

const REST: Record<string, number> = { '--ms': 1, '--mo': 1 };
const FINE = new Set(['--ms', '--mo']);

type MotionNode = HTMLElement | SVGElement;

interface Run {
	channels: Map<string, Channel>;
	remaining: Set<Channel>;
	onUpdate: ((values: Record<string, number>) => void) | undefined;
	resolve: () => void;
	done: boolean;
}

interface Channel {
	node: MotionNode;
	prop: string;
	x: number;
	v: number;
	target: number;
	config: SpringConfig;
	precision: number;
	owner: Run | null;
}

const registry = new WeakMap<Element, Map<string, Channel>>();
const active = new Set<Channel>();
let ticking = false;

/** Map a channel name (`x`, `--mx`, `--custom`) to its custom property, or `null` if unknown. */
function toProp(channel: string): string | null {
	if (channel.startsWith('--')) return channel;
	return channel in CHANNELS ? CHANNELS[channel as MotionChannel] : null;
}

function restOf(prop: string): number {
	return REST[prop] ?? 0;
}

function format(n: number): string {
	const r = Math.round(n * 10000) / 10000;
	return String(Object.is(r, -0) ? 0 : r);
}

function channelOf(node: MotionNode, prop: string): Channel {
	let map = registry.get(node);
	if (!map) {
		map = new Map();
		registry.set(node, map);
	}
	let ch = map.get(prop);
	if (!ch) {
		// Continue from whatever is already written inline (e.g. by `vars()`), else the rest value.
		const inline = parseFloat(node.style.getPropertyValue(prop));
		const x = Number.isFinite(inline) ? inline : restOf(prop);
		ch = {
			node,
			prop,
			x,
			v: 0,
			target: x,
			config: resolveSpring(),
			precision: FINE.has(prop) ? 0.0005 : 0.01,
			owner: null
		};
		map.set(prop, ch);
	}
	return ch;
}

function finishRun(run: Run): void {
	if (run.done) return;
	run.done = true;
	run.resolve();
}

function release(ch: Channel): void {
	const owner = ch.owner;
	ch.owner = null;
	if (!owner) return;
	owner.remaining.delete(ch);
	if (owner.remaining.size === 0) finishRun(owner);
}

function snapshot(run: Run): Record<string, number> {
	const out: Record<string, number> = {};
	for (const [key, ch] of run.channels) out[key] = ch.x;
	return out;
}

function tick(dt: number): boolean {
	const writes = new Map<MotionNode, Channel[]>();
	const touched = new Set<Run>();
	const settled: Channel[] = [];
	// Integrate everything first (pure maths) …
	for (const ch of active) {
		integrate(ch, ch.target, ch.config, dt);
		if (Math.abs(ch.x - ch.target) < ch.precision && Math.abs(ch.v) < ch.precision * 10) {
			ch.x = ch.target;
			ch.v = 0;
			settled.push(ch);
		}
		let list = writes.get(ch.node);
		if (!list) {
			list = [];
			writes.set(ch.node, list);
		}
		list.push(ch);
		if (ch.owner) touched.add(ch.owner);
	}
	// … then write, batched per node (writes only — never a layout read).
	for (const [node, list] of writes) {
		for (const ch of list) node.style.setProperty(ch.prop, format(ch.x));
	}
	for (const run of touched) run.onUpdate?.(snapshot(run));
	for (const ch of settled) {
		active.delete(ch);
		release(ch);
	}
	ticking = active.size > 0;
	return ticking;
}

/**
 * Spring an element's motion channels to target values.
 *
 * Interruptible: each element's per-channel position and velocity live in a
 * `WeakMap`, so a new call continues from the current value *and* velocity —
 * gestures never jump. All running springs share one `requestAnimationFrame`
 * loop (fixed-step RK4 integration, clamped frame time) that stops when idle.
 *
 * With `prefers-reduced-motion: reduce`, `globalMotion.scale === 0`, or
 * `instant: true`, values jump to their targets.
 *
 * The element should carry the `.motion` class (and `.tilt` for
 * `rotateX`/`rotateY`) so the custom properties become real transforms.
 *
 * @example
 * ```ts
 * animate(card, { y: -8, scale: 1.02 }, { spring: 'bouncy' });
 * ```
 * @param node The element to animate.
 * @param to Target values by channel (`x`, `y`, `scale`, `rotate`, `opacity`, `rotateX`, `rotateY`, `--custom`).
 * @param options Spring, initial velocities, `instant`, `onUpdate`.
 */
export function animate(node: MotionNode, to: MotionValues, options: AnimateOptions = {}): AnimationHandle {
	let resolve: () => void = () => {};
	const finished = new Promise<void>((r) => (resolve = r));
	const run: Run = { channels: new Map(), remaining: new Set(), onUpdate: options.onUpdate, resolve, done: false };
	const handle: AnimationHandle = {
		finished,
		stop() {
			for (const ch of Array.from(run.remaining)) {
				ch.v = 0;
				ch.target = ch.x;
				active.delete(ch);
				release(ch);
			}
			finishRun(run);
		}
	};

	if (options.instant || reducedMotion.current) {
		setMotion(node, to);
		const values: Record<string, number> = {};
		for (const [key, value] of Object.entries(to)) {
			if (typeof value === 'number' && Number.isFinite(value) && toProp(key)) values[key] = value;
		}
		options.onUpdate?.(values);
		finishRun(run);
		return handle;
	}

	const config = resolveSpring(options.spring);
	for (const [key, value] of Object.entries(to)) {
		const prop = toProp(key);
		if (!prop || typeof value !== 'number' || !Number.isFinite(value)) continue;
		const ch = channelOf(node, prop);
		if (ch.owner && ch.owner !== run) release(ch);
		const v = options.velocity?.[key] ?? options.velocity?.[prop];
		if (typeof v === 'number' && Number.isFinite(v)) ch.v = v;
		ch.target = value;
		ch.config = config;
		run.channels.set(key, ch);
		if (ch.x === value && ch.v === 0) {
			// Already exactly there: nothing to schedule, nothing to write.
			active.delete(ch);
			continue;
		}
		// Even a near-target channel goes through the loop, so DOM writes only happen inside the frame.
		ch.owner = run;
		run.remaining.add(ch);
		active.add(ch);
	}

	if (run.remaining.size === 0) {
		finishRun(run);
	} else if (!ticking) {
		ticking = true;
		addTicker(tick);
	}
	return handle;
}

/**
 * Read the current sprung value of a channel on a node. Returns the channel's
 * rest value (`1` for `scale`/`opacity`, else `0`) if it has never been set.
 * @param node The element.
 * @param channel A channel name (`x`, `scale`, …), its property (`--mx`), or a `--custom` property.
 */
export function getMotion(node: Element, channel: string): number {
	const prop = toProp(channel);
	if (!prop) return 0;
	const ch = registry.get(node)?.get(prop);
	if (ch) return ch.x;
	if (node instanceof HTMLElement || node instanceof SVGElement) {
		const inline = parseFloat(node.style.getPropertyValue(prop));
		if (Number.isFinite(inline)) return inline;
	}
	return restOf(prop);
}

/**
 * Read the current velocity (units per second) of a channel on a node; `0` when at rest.
 * @param node The element.
 * @param channel A channel name, its property, or a `--custom` property.
 */
export function getVelocity(node: Element, channel: string): number {
	const prop = toProp(channel);
	if (!prop) return 0;
	return registry.get(node)?.get(prop)?.v ?? 0;
}

/**
 * Set channels immediately, with no animation. Resets their velocity and
 * interrupts any spring running on them.
 * @param node The element.
 * @param values Values by channel (`x`, `y`, `scale`, …, `--custom`).
 */
export function setMotion(node: MotionNode, values: MotionValues): void {
	for (const [key, value] of Object.entries(values)) {
		const prop = toProp(key);
		if (!prop || typeof value !== 'number' || !Number.isFinite(value)) continue;
		const ch = channelOf(node, prop);
		ch.x = value;
		ch.target = value;
		ch.v = 0;
		active.delete(ch);
		release(ch);
		node.style.setProperty(prop, format(value));
	}
}
