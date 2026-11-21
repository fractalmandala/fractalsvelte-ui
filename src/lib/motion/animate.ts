import { addTicker, integrate } from './loop.js';
import { reducedMotion } from './global.svelte.js';
import { resolveSpring, type SpringConfig, type SpringInput } from './spring.js';

export { globalMotion } from './global.svelte.js';

export type MotionChannel = 'x' | 'y' | 'scale' | 'rotate' | 'opacity' | 'rotateX' | 'rotateY';

export type MotionValues = Partial<Record<MotionChannel, number>> & { [custom: `--${string}`]: number };

export interface AnimateOptions {
	spring?: SpringInput;
	velocity?: Partial<Record<string, number>>;
	instant?: boolean;
	onUpdate?: (values: Record<string, number>) => void;
}

export interface AnimationHandle {
	finished: Promise<void>;
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

export function getVelocity(node: Element, channel: string): number {
	const prop = toProp(channel);
	if (!prop) return 0;
	return registry.get(node)?.get(prop)?.v ?? 0;
}

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
