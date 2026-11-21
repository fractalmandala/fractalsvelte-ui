import { addTicker, integrate, removeTicker, type SpringState } from './loop.js';
import { reducedMotion } from './global.svelte.js';
import { resolveSpring, type SpringInput } from './spring.js';

export { reducedMotion } from './global.svelte.js';

export class SpringValue {
	#current = $state(0);
	#target = $state(0);
	#state: SpringState = { x: 0, v: 0 };
	#precision = 0.001;
	#running = false;
	#waiters: (() => void)[] = [];

	spring: SpringInput;

	constructor(initial: number, spring: SpringInput = 'snappy') {
		this.#current = initial;
		this.#target = initial;
		this.#state.x = initial;
		this.spring = spring;
	}

	get current(): number {
		return this.#current;
	}

	get target(): number {
		return this.#target;
	}

	set target(value: number) {
		void this.set(value);
	}

	get velocity(): number {
		return this.#state.v;
	}

	set velocity(value: number) {
		this.#state.v = Number.isFinite(value) ? value : 0;
	}

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
