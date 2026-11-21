import type { TransitionConfig } from 'svelte/transition';
import { reducedMotion } from './global.svelte.js';
import { springDuration, springEase, type SpringInput } from './spring.js';

export interface SpringTransitionParams {
	spring?: SpringInput;
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

export function springFade(node: Element, params: SpringTransitionParams = {}): TransitionConfig {
	if (reducedMotion.current) return reduced(params.delay ?? 0);
	const { opacity } = computed(node);
	return { ...base(params), css: (t) => `opacity: ${n(Math.min(1, Math.max(0, t)) * opacity)}` };
}

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
