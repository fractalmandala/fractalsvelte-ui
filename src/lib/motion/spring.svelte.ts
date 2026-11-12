/**
 * Rune-based spring values for component state.
 */
import { addTicker, integrate, removeTicker, type SpringState } from './loop.js';
import { reducedMotion } from './global.svelte.js';
import { resolveSpring, type SpringInput } from './spring.js';

export { reducedMotion } from './global.svelte.js';

/**
 * A reactive, spring-driven number. Setting `target` animates `current`
 * along the spring; reading `current` in a template or `$derived` re-renders
 * every frame while it moves. Retargeting mid-flight keeps the velocity, so
 * motion stays continuous. Shares the motion layer's single rAF loop and
 * honours reduced motion (jumps to the target). SSR-safe.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import { SpringValue, vars } from '@fractaldesign/fractalsvelte-ui/motion';
 * 	const width = new SpringValue(0, 'gentle');
 * </script>
 * <div class="fill" {@attach vars({ value: width.current })}></div>
 * <button onclick={() => (width.target = 0.8)}>Grow</button>
 * ```
 */
export class SpringValue {
	#current = $state(0);
	#target = $state(0);
	#state: SpringState = { x: 0, v: 0 };
	#precision = 0.001;
	#running = false;
	#waiters: (() => void)[] = [];

	/** The spring used for subsequent motion (preset name or partial config). */
	spring: SpringInput;

	/**
	 * @param initial The starting value (also the initial target).
	 * @param spring The spring to use. Defaults to `'snappy'`.
	 */
	constructor(initial: number, spring: SpringInput = 'snappy') {
		this.#current = initial;
		this.#target = initial;
		this.#state.x = initial;
		this.spring = spring;
	}

	/** The current animated value (reactive, read-only — set `target` or call `set()`). */
	get current(): number {
		return this.#current;
	}

	/** The value being animated toward (reactive). Assigning it starts the spring. */
	get target(): number {
		return this.#target;
	}

	set target(value: number) {
		void this.set(value);
	}

	/** The current velocity in units per second. Assign to impart momentum. */
	get velocity(): number {
		return this.#state.v;
	}

	set velocity(value: number) {
		this.#state.v = Number.isFinite(value) ? value : 0;
	}

	/**
	 * Animate to `value`. Resolves when the spring settles (or is stopped or jumped).
	 * @param value The new target.
	 * @param opts `instant` jumps with no animation; `velocity` sets the starting velocity (units/s).
	 */
	set(value: number, opts: { instant?: boolean; velocity?: number } = {}): Promise<void> {
		if (!Number.isFinite(value)) return Promise.resolve();
		this.#target = value;
		if (typeof opts.velocity === 'number' && Number.isFinite(opts.velocity)) this.#state.v = opts.velocity;
		if (opts.instant || reducedMotion.current || typeof requestAnimationFrame !== 'function') {
			this.#jump(value);
			return Promise.resolve();
		}
		const distance = Math.abs(value - this.#state.x);
		this.#precision = distance > 0 ? Math.max(1e-6, distance * 0.0005) : 0.001;
		const promise = new Promise<void>((resolve) => this.#waiters.push(resolve));
		if (!this.#running) {
			this.#running = true;
			addTicker(this.#tick);
		}
		return promise;
	}

	/** Stop where it is: `target` becomes `current` and velocity is discarded. */
	stop(): void {
		this.#state.v = 0;
		this.#target = this.#state.x;
		this.#halt();
	}

	#jump(value: number): void {
		this.#state.x = value;
		this.#state.v = 0;
		this.#current = value;
		this.#halt();
	}

	#halt(): void {
		if (this.#running) {
			this.#running = false;
			removeTicker(this.#tick);
		}
		const waiters = this.#waiters;
		this.#waiters = [];
		for (const resolve of waiters) resolve();
	}

	#tick = (dt: number): boolean => {
		const target = this.#target;
		const s = integrate(this.#state, target, resolveSpring(this.spring), dt);
		if (Math.abs(s.x - target) < this.#precision && Math.abs(s.v) < this.#precision * 10) {
			this.#jump(target);
			return false;
		}
		this.#current = s.x;
		return true;
	};
}
