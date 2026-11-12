/**
 * The single shared animation-frame loop and the spring integrator.
 * Internal module: `animate()` and `SpringValue` both register tickers here,
 * so however many springs run there is exactly one `requestAnimationFrame`
 * chain, and it stops as soon as nothing is moving.
 */
import { globalMotion } from './global.svelte.js';
import type { SpringConfig } from './spring.js';

/** A per-frame callback. Receives the clamped, time-scaled step in seconds; returns `false` when idle. */
export type Ticker = (dt: number) => boolean;

/** Largest real frame gap simulated in one frame (a backgrounded tab must not explode the simulation). */
const MAX_DT = 1 / 15;
/** Fixed integration sub-step (seconds). */
const STEP = 1 / 240;
/** Upper bound on sub-steps per frame. */
const MAX_STEPS = 1200;

const tickers = new Set<Ticker>();
let frame = 0;
let last = 0;

function loop(now: number): void {
	const raw = last === 0 ? 1 / 60 : (now - last) / 1000;
	last = now;
	const scale = globalMotion.scale;
	// scale 0 means "no motion": a huge step settles everything this frame.
	const dt = scale > 0 ? Math.min(Math.max(raw, 0), MAX_DT) / scale : 5;
	for (const ticker of Array.from(tickers)) {
		if (!ticker(dt)) tickers.delete(ticker);
	}
	if (tickers.size > 0) {
		frame = requestAnimationFrame(loop);
	} else {
		frame = 0;
		last = 0;
	}
}

/** Register a ticker; starts the loop if it was idle. Browser-only. */
export function addTicker(ticker: Ticker): void {
	tickers.add(ticker);
	if (frame === 0 && typeof requestAnimationFrame === 'function') {
		frame = requestAnimationFrame(loop);
	}
}

/** Remove a ticker. The loop stops on its own once the set is empty. */
export function removeTicker(ticker: Ticker): void {
	tickers.delete(ticker);
}

/** Mutable spring state: position and velocity. */
export interface SpringState {
	x: number;
	v: number;
}

/**
 * Advance `state` toward `target` by `dt` seconds with fixed-step RK4
 * (sub-steps of at most 1/240 s). Mutates and returns `state`.
 */
export function integrate(state: SpringState, target: number, config: SpringConfig, dt: number): SpringState {
	const { stiffness: k, damping: c, mass: m } = config;
	const steps = Math.min(MAX_STEPS, Math.max(1, Math.ceil(dt / STEP)));
	const h = dt / steps;
	const acc = (x: number, v: number): number => (-k * (x - target) - c * v) / m;
	let { x, v } = state;
	for (let i = 0; i < steps; i++) {
		const a1 = acc(x, v);
		const x2 = x + 0.5 * h * v;
		const v2 = v + 0.5 * h * a1;
		const a2 = acc(x2, v2);
		const x3 = x + 0.5 * h * v2;
		const v3 = v + 0.5 * h * a2;
		const a3 = acc(x3, v3);
		const x4 = x + h * v3;
		const v4 = v + h * a3;
		const a4 = acc(x4, v4);
		x += (h / 6) * (v + 2 * v2 + 2 * v3 + v4);
		v += (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4);
	}
	state.x = x;
	state.v = v;
	return state;
}
