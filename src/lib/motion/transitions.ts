/**
 * Svelte transition functions driven by real spring curves.
 *
 * Each returns `{ delay, duration, easing, css }` where `duration` is the
 * spring's settle time (`springDuration`) and `easing` follows the spring
 * itself (`springEase`) — so `bouncy` really overshoots. Svelte runs the `css`
 * keyframes via the Web Animations API. Under reduced motion every transition
 * becomes a short plain opacity fade.
 */
import type { TransitionConfig } from 'svelte/transition';
import { reducedMotion } from './global.svelte.js';
import { springDuration, springEase, type SpringInput } from './spring.js';

/** Parameters shared by every spring transition. */
export interface SpringTransitionParams {
	/** The spring (preset name or partial config). Defaults to `'snappy'`. */
	spring?: SpringInput;
	/** Delay before the transition starts, in ms. Defaults to `0`. */
	delay?: number;
}

const REDUCED_MS = 120;

function reduced(delay: number): TransitionConfig {
	return { delay, duration: REDUCED_MS, css: (t) => `opacity: ${t.toFixed(3)}` };
}

function base(params: SpringTransitionParams): { delay: number; duration: number; easing: (t: number) => number } {
	const spring = params.spring ?? 'snappy';
	return { delay: params.delay ?? 0, duration: springDuration(spring), easing: springEase(spring) };
}

function computed(node: Element): { opacity: number; transform: string } {
	const style = getComputedStyle(node);
	const opacity = Number.parseFloat(style.opacity);
	return {
		opacity: Number.isFinite(opacity) ? opacity : 1,
		transform: style.transform === 'none' ? '' : style.transform
	};
}

const n = (v: number): string => (Math.round(v * 1000) / 1000).toString();

/**
 * Fade in/out along a spring curve.
 * @param node The transitioning element.
 * @param params `spring`, `delay`.
 */
export function springFade(node: Element, params: SpringTransitionParams = {}): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const { opacity } = computed(node);
	return { ...base(params), css: (t) => `opacity: ${n(Math.min(1, Math.max(0, t)) * opacity)}` };
}

/**
 * Fly in/out from an offset, springing into place (overshoot included).
 * @param node The transitioning element.
 * @param params `spring`, `delay`, `x`/`y` offset in px (default `y: 16`), `opacity` at the offset (default `0`).
 */
export function springFly(
	node: Element,
	params: SpringTransitionParams & { x?: number; y?: number; opacity?: number } = {}
): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const { opacity, transform } = computed(node);
	const x = params.x ?? 0;
	const y = params.y ?? 16;
	const from = params.opacity ?? 0;
	const od = opacity - from;
	return {
		...base(params),
		css: (t, u) =>
			`transform: ${transform} translate(${n(x * u)}px, ${n(y * u)}px); opacity: ${n(
				Math.max(0, Math.min(1, opacity - od * Math.min(1, Math.max(0, u))))
			)}`
	};
}

/**
 * Scale in/out from `start`, with spring overshoot.
 * @param node The transitioning element.
 * @param params `spring`, `delay`, `start` scale (default `0.9`), `opacity` at the start (default `0`).
 */
export function springScale(
	node: Element,
	params: SpringTransitionParams & { start?: number; opacity?: number } = {}
): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const { opacity, transform } = computed(node);
	const start = params.start ?? 0.9;
	const from = params.opacity ?? 0;
	const sd = 1 - start;
	const od = opacity - from;
	return {
		...base(params),
		css: (t, u) =>
			`transform: ${transform} scale(${n(1 - sd * u)}); opacity: ${n(
				Math.max(0, Math.min(1, opacity - od * Math.min(1, Math.max(0, u))))
			)}`
	};
}

/**
 * Blur and fade in/out, with an optional vertical drift.
 * @param node The transitioning element.
 * @param params `spring`, `delay`, `amount` of blur in px (default `8`), `y` drift in px (default `0`).
 */
export function springBlur(
	node: Element,
	params: SpringTransitionParams & { amount?: number; y?: number } = {}
): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const { opacity, transform } = computed(node);
	const amount = params.amount ?? 8;
	const y = params.y ?? 0;
	return {
		...base(params),
		css: (t, u) => {
			const k = Math.min(1, Math.max(0, u));
			return `filter: blur(${n(amount * k)}px); transform: ${transform} translateY(${n(y * u)}px); opacity: ${n(
				opacity * (1 - k)
			)}`;
		}
	};
}

/**
 * Collapse/expand the element's height (or width with `axis: 'x'`), including
 * padding, margin and border, along a spring curve. Overshoot is clamped so
 * surrounding layout never bounces.
 * @param node The transitioning element.
 * @param params `spring`, `delay`, `axis` (`'y'` default, or `'x'`).
 */
export function springSlide(node: Element, params: SpringTransitionParams & { axis?: 'x' | 'y' } = {}): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const style = getComputedStyle(node);
	const axis = params.axis ?? 'y';
	const primary = axis === 'y' ? 'height' : 'width';
	const [a, b] = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
	const size = Number.parseFloat(style[primary]);
	const px = (prop: string): number => Number.parseFloat(style.getPropertyValue(prop)) || 0;
	const padA = px(`padding-${a}`);
	const padB = px(`padding-${b}`);
	const marA = px(`margin-${a}`);
	const marB = px(`margin-${b}`);
	const borA = px(`border-${a}-width`);
	const borB = px(`border-${b}-width`);
	const opacity = Number.parseFloat(style.opacity) || 1;
	return {
		...base(params),
		css: (t) => {
			const k = Math.min(1, Math.max(0, t));
			return (
				`overflow: hidden; opacity: ${n(Math.min(k * 4, 1) * opacity)}; ${primary}: ${n(k * size)}px; ` +
				`padding-${a}: ${n(k * padA)}px; padding-${b}: ${n(k * padB)}px; ` +
				`margin-${a}: ${n(k * marA)}px; margin-${b}: ${n(k * marB)}px; ` +
				`border-${a}-width: ${n(k * borA)}px; border-${b}-width: ${n(k * borB)}px; ` +
				`min-${primary}: 0`
			);
		}
	};
}
