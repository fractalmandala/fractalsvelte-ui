import { cubicOut, elasticOut, backOut, quadOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export interface BlurScaleParams {
	delay?: number;
	duration?: number;
	start?: number;
	blur?: number;
	opacity?: number;
	easing?: (t: number) => number;
}

/**
 * Native Svelte transition that combines progressive gaussian blur with a scale entrance.
 */
export function blurScale(
	node: Element,
	{
		delay = 0,
		duration = 400,
		start = 0.92,
		blur = 8,
		opacity = 0,
		easing = cubicOut
	}: BlurScaleParams = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const targetOpacity = +style.opacity;
	const diffOpacity = targetOpacity - opacity;

	return {
		delay,
		duration,
		easing,
		css: (t) => {
			const currentScale = start + (1 - start) * t;
			const currentBlur = (1 - t) * blur;
			const currentOpacity = opacity + diffOpacity * t;
			return `
				transform: scale(${currentScale});
				filter: blur(${currentBlur}px);
				opacity: ${currentOpacity};
			`;
		}
	};
}

export interface SpringFlyParams {
	delay?: number;
	duration?: number;
	x?: number;
	y?: number;
	opacity?: number;
	easing?: (t: number) => number;
}

/**
 * Spring-physics entrance transition that flies an element into position with elastic overshoot.
 */
export function springFly(
	node: Element,
	{
		delay = 0,
		duration = 650,
		x = 0,
		y = 24,
		opacity = 0,
		easing = backOut
	}: SpringFlyParams = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const targetOpacity = +style.opacity;
	const diffOpacity = targetOpacity - opacity;

	return {
		delay,
		duration,
		easing,
		css: (t) => {
			const currentX = (1 - t) * x;
			const currentY = (1 - t) * y;
			const currentOpacity = opacity + diffOpacity * t;
			return `
				transform: translate3d(${currentX}px, ${currentY}px, 0);
				opacity: ${currentOpacity};
			`;
		}
	};
}

export interface TypewriterParams {
	speed?: number; // chars per second
	delay?: number;
}

/**
 * Typewriter transition that types out text character-by-character on mount.
 */
export function typewriter(
	node: Element,
	{ speed = 30, delay = 0 }: TypewriterParams = {}
): TransitionConfig {
	const text = node.textContent ?? '';
	const duration = (text.length / speed) * 1000;

	return {
		delay,
		duration,
		tick: (t) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

export interface CurtainParams {
	delay?: number;
	duration?: number;
	direction?: 'horizontal' | 'vertical';
	easing?: (t: number) => number;
}

/**
 * Shutter / curtain reveal transition using CSS clip-path inset.
 */
export function curtain(
	node: Element,
	{
		delay = 0,
		duration = 500,
		direction = 'horizontal',
		easing = cubicOut
	}: CurtainParams = {}
): TransitionConfig {
	return {
		delay,
		duration,
		easing,
		css: (t) => {
			if (direction === 'horizontal') {
				const inset = (1 - t) * 50;
				return `clip-path: inset(0 ${inset}% 0 ${inset}%);`;
			}
			const inset = (1 - t) * 50;
			return `clip-path: inset(${inset}% 0 ${inset}% 0);`;
		}
	};
}
