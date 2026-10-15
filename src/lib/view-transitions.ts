/**
 * View Transitions & Web Animations API (WAAPI) integration for SvelteKit.
 * Zero external dependencies. Browser-native, 60fps GPU-accelerated motion.
 */

export type ViewTransitionType = 'drill' | 'sheet' | 'fade' | 'zoom' | 'slide';
export type NavigationDirection = 'forward' | 'backward';

export interface TransitionOptions {
	duration?: number;
	easing?: string;
	direction?: NavigationDirection;
}

/**
 * Keyframe definitions for spatial view transitions.
 */
export function getKeyframes(
	type: ViewTransitionType,
	direction: NavigationDirection = 'forward'
): { out: Keyframe[]; in: Keyframe[] } {
	switch (type) {
		case 'drill': {
			const isForward = direction === 'forward';
			return {
				out: isForward
					? [
							{ transform: 'translate3d(0, 0, 0)', opacity: '1' },
							{ transform: 'translate3d(-20%, 0, 0)', opacity: '0.6' }
						]
					: [
							{ transform: 'translate3d(0, 0, 0)', opacity: '1' },
							{ transform: 'translate3d(100%, 0, 0)', opacity: '1' }
						],
				in: isForward
					? [
							{ transform: 'translate3d(100%, 0, 0)', opacity: '1' },
							{ transform: 'translate3d(0, 0, 0)', opacity: '1' }
						]
					: [
							{ transform: 'translate3d(-20%, 0, 0)', opacity: '0.6' },
							{ transform: 'translate3d(0, 0, 0)', opacity: '1' }
						]
			};
		}

		case 'sheet': {
			const isForward = direction === 'forward';
			return {
				out: isForward
					? [
							{ transform: 'scale(1)', filter: 'brightness(1)', borderRadius: '0px' },
							{ transform: 'scale(0.94)', filter: 'brightness(0.7)', borderRadius: '16px' }
						]
					: [
							{ transform: 'translate3d(0, 0, 0)' },
							{ transform: 'translate3d(0, 100%, 0)' }
						],
				in: isForward
					? [
							{ transform: 'translate3d(0, 100%, 0)' },
							{ transform: 'translate3d(0, 0, 0)' }
						]
					: [
							{ transform: 'scale(0.94)', filter: 'brightness(0.7)', borderRadius: '16px' },
							{ transform: 'scale(1)', filter: 'brightness(1)', borderRadius: '0px' }
						]
			};
		}

		case 'zoom': {
			const isForward = direction === 'forward';
			return {
				out: isForward
					? [
							{ transform: 'scale(1)', opacity: '1' },
							{ transform: 'scale(0.88)', opacity: '0' }
						]
					: [
							{ transform: 'scale(1)', opacity: '1' },
							{ transform: 'scale(1.12)', opacity: '0' }
						],
				in: isForward
					? [
							{ transform: 'scale(1.12)', opacity: '0' },
							{ transform: 'scale(1)', opacity: '1' }
						]
					: [
							{ transform: 'scale(0.88)', opacity: '0' },
							{ transform: 'scale(1)', opacity: '1' }
						]
			};
		}

		case 'slide': {
			const isForward = direction === 'forward';
			return {
				out: [
					{ transform: 'translate3d(0, 0, 0)', opacity: '1' },
					{ transform: `translate3d(${isForward ? -100 : 100}%, 0, 0)`, opacity: '0' }
				],
				in: [
					{ transform: `translate3d(${isForward ? 100 : -100}%, 0, 0)`, opacity: '0' },
					{ transform: 'translate3d(0, 0, 0)', opacity: '1' }
				]
			};
		}

		case 'fade':
		default: {
			return {
				out: [{ opacity: '1' }, { opacity: '0' }],
				in: [{ opacity: '0' }, { opacity: '1' }]
			};
		}
	}
}

/**
 * Executes a synchronized Web Animations API transition on outgoing and incoming DOM elements.
 */
export function animateElements(
	outgoingEl: HTMLElement | null,
	incomingEl: HTMLElement | null,
	type: ViewTransitionType,
	options: TransitionOptions = {}
): Promise<void> {
	const {
		duration = type === 'sheet' ? 420 : 380,
		easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
		direction = 'forward'
	} = options;

	const keyframes = getKeyframes(type, direction);
	const timing: KeyframeAnimationOptions = {
		duration,
		easing,
		fill: 'forwards'
	};

	const promises: Promise<Animation>[] = [];

	if (outgoingEl) {
		const outAnim = outgoingEl.animate(keyframes.out, timing);
		promises.push(outAnim.finished);
	}

	if (incomingEl) {
		const inAnim = incomingEl.animate(keyframes.in, timing);
		promises.push(inAnim.finished);
	}

	return Promise.all(promises).then(() => {
		// Clean up forward fill styling so layout flow resets
		if (outgoingEl) outgoingEl.style.transform = '';
		if (incomingEl) incomingEl.style.transform = '';
	});
}

/**
 * Shared element snapshot cache for FLIP hero animations.
 */
interface ElementSnapshot {
	rect: DOMRect;
	borderRadius: string;
}

const sharedRegistry = new Map<string, ElementSnapshot>();

/**
 * Records an element's spatial geometry before navigation or view replacement.
 */
export function recordSharedElement(name: string, element: HTMLElement) {
	if (!element) return;
	const rect = element.getBoundingClientRect();
	const style = window.getComputedStyle(element);
	sharedRegistry.set(name, {
		rect,
		borderRadius: style.borderRadius
	});
}

/**
 * Animates a newly mounted target element from its previously recorded snapshot position.
 */
export function playSharedElementTransition(
	name: string,
	targetElement: HTMLElement,
	duration = 400,
	easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
): Animation | null {
	const snapshot = sharedRegistry.get(name);
	if (!snapshot || !targetElement) return null;

	const targetRect = targetElement.getBoundingClientRect();

	const dx = snapshot.rect.left - targetRect.left;
	const dy = snapshot.rect.top - targetRect.top;
	const scaleX = snapshot.rect.width / (targetRect.width || 1);
	const scaleY = snapshot.rect.height / (targetRect.height || 1);

	const anim = targetElement.animate(
		[
			{
				transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`,
				borderRadius: snapshot.borderRadius,
				transformOrigin: 'top left'
			},
			{
				transform: 'translate3d(0, 0, 0) scale(1, 1)',
				borderRadius: window.getComputedStyle(targetElement).borderRadius,
				transformOrigin: 'top left'
			}
		],
		{
			duration,
			easing
		}
	);

	// Remove from registry once animated
	sharedRegistry.delete(name);
	return anim;
}

/**
 * Integrates SvelteKit's `onNavigate` lifecycle with the browser's View Transitions API.
 * Gracefully handles browsers without native `document.startViewTransition`.
 */
export function setupViewTransitions(onNavigateFn?: (cb: (navigation: any) => Promise<void> | void) => void) {
	if (typeof window === 'undefined') return;
	if (!onNavigateFn) return;

	onNavigateFn((navigation) => {
		if (!('startViewTransition' in document)) return;

		return new Promise<void>((resolve) => {
			(document as any).startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
}
