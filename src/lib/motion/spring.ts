/**
 * The spring solver — pure maths, no DOM, no imports.
 *
 * This module is imported both by the library (the JS spring engine, the
 * Svelte transitions) and by `scripts/gen-springs.ts` under plain Node, which
 * is why it imports nothing and uses only erasable TypeScript syntax.
 *
 * Model: a damped harmonic oscillator `m·x'' = −k·(x − to) − c·x'`, solved
 * analytically for the under-, critically- and over-damped cases.
 */

/** Physical spring parameters. Units are SI-like: time in seconds, mass 1 by convention. */
export interface SpringConfig {
	/** Spring constant `k` — higher is faster and tighter. */
	stiffness: number;
	/** Damping coefficient `c` — higher removes more oscillation. Critical damping is `2·√(k·m)`. */
	damping: number;
	/** Mass `m` — higher is heavier and slower. */
	mass: number;
}

/** The named spring presets shared by CSS (`--spring-<name>`) and JS. */
export type SpringPreset = 'gentle' | 'snappy' | 'bouncy' | 'stiff' | 'slow';

/** A preset name, or a partial config merged over the `snappy` preset. */
export type SpringInput = SpringPreset | Partial<SpringConfig>;

/**
 * The preset table, in physical units with mass 1.
 *
 * | preset | feel | settle | overshoot |
 * |:--|:--|:--|:--|
 * | `stiff`  | very fast, no overshoot          | ≈ 225 ms | none |
 * | `snappy` | quick, near-critically damped    | ≈ 355 ms | < 1 % |
 * | `gentle` | soft                             | ≈ 560 ms | < 1 % |
 * | `bouncy` | playful, visible overshoot       | ≈ 690 ms | ≈ 15 % |
 * | `slow`   | deliberate, large surfaces       | ≈ 900 ms | none |
 */
export const springs: Record<SpringPreset, SpringConfig> = {
	gentle: { stiffness: 240, damping: 26, mass: 1 },
	snappy: { stiffness: 670, damping: 44, mass: 1 },
	bouncy: { stiffness: 380, damping: 20, mass: 1 },
	stiff: { stiffness: 2100, damping: 92, mass: 1 },
	slow: { stiffness: 90, damping: 19, mass: 1 }
};

/** Default rest threshold, as a fraction of the travelled distance. */
const REST_DELTA = 0.002;

/**
 * Resolve a preset name or partial config into a complete {@link SpringConfig}.
 * Partial configs are merged over the `snappy` preset; non-positive or
 * non-finite values fall back to the preset's.
 * @param input A preset name or partial config. Defaults to `'snappy'`.
 */
export function resolveSpring(input?: SpringInput): SpringConfig {
	if (input === undefined) return springs.snappy;
	if (typeof input === 'string') return springs[input] ?? springs.snappy;
	const base = springs.snappy;
	const pick = (v: number | undefined, fallback: number, allowZero: boolean): number =>
		typeof v === 'number' && Number.isFinite(v) && (allowZero ? v >= 0 : v > 0) ? v : fallback;
	return {
		stiffness: pick(input.stiffness, base.stiffness, false),
		damping: pick(input.damping, base.damping, true),
		mass: pick(input.mass, base.mass, false)
	};
}

/** Displacement and velocity of the oscillator (relative to `to`) at time `t`. */
function solve(config: SpringConfig, t: number, from: number, to: number, velocity: number): [number, number] {
	const { stiffness: k, damping: c, mass: m } = config;
	const x0 = from - to;
	const v0 = velocity;
	if (t <= 0) return [x0, v0];
	const w0 = Math.sqrt(k / m);
	const zeta = c / (2 * Math.sqrt(k * m));

	if (zeta < 1 - 1e-6) {
		// Under-damped: decaying sinusoid.
		const a = zeta * w0;
		const wd = w0 * Math.sqrt(1 - zeta * zeta);
		const A = x0;
		const B = (v0 + a * x0) / wd;
		const e = Math.exp(-a * t);
		const cos = Math.cos(wd * t);
		const sin = Math.sin(wd * t);
		const x = e * (A * cos + B * sin);
		const v = e * (-a * (A * cos + B * sin) + wd * (B * cos - A * sin));
		return [x, v];
	}
	if (zeta <= 1 + 1e-6) {
		// Critically damped.
		const B = v0 + w0 * x0;
		const e = Math.exp(-w0 * t);
		const x = e * (x0 + B * t);
		const v = e * (B - w0 * (x0 + B * t));
		return [x, v];
	}
	// Over-damped: sum of two decaying exponentials.
	const s = Math.sqrt(zeta * zeta - 1);
	const r1 = -w0 * (zeta - s);
	const r2 = -w0 * (zeta + s);
	const C2 = (v0 - r1 * x0) / (r2 - r1);
	const C1 = x0 - C2;
	const e1 = Math.exp(r1 * t);
	const e2 = Math.exp(r2 * t);
	return [C1 * e1 + C2 * e2, C1 * r1 * e1 + C2 * r2 * e2];
}

/**
 * Analytic damped-harmonic-oscillator position at time `t` (seconds),
 * handling the under-, critically- and over-damped cases exactly.
 * @param config The physical spring.
 * @param t Time in seconds since release.
 * @param from Start position. Defaults to `0`.
 * @param to Target (rest) position. Defaults to `1`.
 * @param velocity Initial velocity in units per second. Defaults to `0`.
 */
export function springPosition(config: SpringConfig, t: number, from = 0, to = 1, velocity = 0): number {
	return to + solve(config, t, from, to, velocity)[0];
}

/**
 * Analytic velocity (units per second) of the oscillator at time `t` (seconds).
 * @param config The physical spring.
 * @param t Time in seconds since release.
 * @param from Start position. Defaults to `0`.
 * @param to Target (rest) position. Defaults to `1`.
 * @param velocity Initial velocity in units per second. Defaults to `0`.
 */
export function springVelocity(config: SpringConfig, t: number, from = 0, to = 1, velocity = 0): number {
	return solve(config, t, from, to, velocity)[1];
}

const durationCache = new Map<string, number>();

/**
 * Settle time in milliseconds for a unit move (0 → 1, at rest): the first
 * moment after which the position stays within `restDelta` of the target and
 * the velocity stays below `restDelta × 10` per second. Results are cached.
 * @param input A preset name or partial config. Defaults to `'snappy'`.
 * @param restDelta Rest threshold as a fraction of the distance. Defaults to `0.002`.
 */
export function springDuration(input?: SpringInput, restDelta = REST_DELTA): number {
	const config = resolveSpring(input);
	const key = `${config.stiffness}|${config.damping}|${config.mass}|${restDelta}`;
	const cached = durationCache.get(key);
	if (cached !== undefined) return cached;
	const restSpeed = restDelta * 10;
	const step = 0.001;
	const limit = 10;
	let lastUnsettled = 0;
	for (let t = 0; t <= limit; t += step) {
		const [x, v] = solve(config, t, 0, 1, 0);
		if (Math.abs(x) > restDelta || Math.abs(v) > restSpeed) lastUnsettled = t;
	}
	const ms = Math.min(limit * 1000, Math.ceil((lastUnsettled + step) * 1000));
	durationCache.set(key, ms);
	return ms;
}

/** Perpendicular distance from point p to the segment a–b (in normalised plot space). */
function segmentDistance(p: [number, number], a: [number, number], b: [number, number]): number {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
	let u = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
	u = Math.max(0, Math.min(1, u));
	return Math.hypot(p[0] - (a[0] + u * dx), p[1] - (a[1] + u * dy));
}

/** Ramer–Douglas–Peucker simplification: keep only points that matter. */
function simplify(points: [number, number][], epsilon: number): [number, number][] {
	if (points.length < 3) return points;
	const keep = new Array<boolean>(points.length).fill(false);
	keep[0] = true;
	keep[points.length - 1] = true;
	const stack: [number, number][] = [[0, points.length - 1]];
	while (stack.length > 0) {
		const range = stack.pop();
		if (!range) break;
		const [start, end] = range;
		let max = 0;
		let index = -1;
		for (let i = start + 1; i < end; i++) {
			const d = segmentDistance(points[i], points[start], points[end]);
			if (d > max) {
				max = d;
				index = i;
			}
		}
		if (index !== -1 && max > epsilon) {
			keep[index] = true;
			stack.push([start, index], [index, end]);
		}
	}
	return points.filter((_, i) => keep[i]);
}

/** Format a number with fixed precision and no trailing zeros (`-0` → `0`). */
function fmt(n: number, digits: number): string {
	const s = n.toFixed(digits).replace(/\.?0+$/, '');
	return s === '-0' ? '0' : s;
}

/**
 * A CSS `linear()` easing sampled from the spring, plus its settle duration —
 * true spring curves in plain CSS transitions and animations. Output is
 * deterministic: values to 3 decimals, stops to 2, redundant points dropped.
 * @param input A preset name or partial config. Defaults to `'snappy'`.
 * @param samples Number of samples over the duration before simplification. Defaults to `40`.
 * @returns `{ easing: 'linear(…)', duration: <ms> }`.
 */
export function springEasing(input?: SpringInput, samples = 40): { easing: string; duration: number } {
	const config = resolveSpring(input);
	const duration = springDuration(config);
	const n = Math.max(2, Math.floor(samples));
	const points: [number, number][] = [];
	for (let i = 0; i <= n; i++) {
		const p = i / n;
		const y = i === n ? 1 : springPosition(config, (p * duration) / 1000, 0, 1, 0);
		points.push([p, y]);
	}
	const kept = simplify(points, 0.0015);
	const stops = kept.map(([p, y], i) => {
		const value = fmt(y, 3);
		if (i === 0 || i === kept.length - 1) return value;
		return `${value} ${fmt(p * 100, 2)}%`;
	});
	return { easing: `linear(${stops.join(', ')})`, duration };
}

/**
 * An easing function `(t: 0..1) => value` that follows the spring (it may
 * overshoot 1). Pair it with {@link springDuration} of the same input — e.g.
 * for Svelte transitions. `ease(0) === 0` and `ease(1) === 1` exactly.
 * @param input A preset name or partial config. Defaults to `'snappy'`.
 */
export function springEase(input?: SpringInput): (t: number) => number {
	const config = resolveSpring(input);
	const seconds = springDuration(config) / 1000;
	return (t: number): number => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		return springPosition(config, t * seconds, 0, 1, 0);
	};
}
