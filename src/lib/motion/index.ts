/**
 * `@fractaldesign/fractalsvelte-ui/motion` — spring physics, the JS spring engine,
 * motion attachments, spring transitions and view transitions.
 */
export {
	springs,
	resolveSpring,
	springPosition,
	springVelocity,
	springDuration,
	springEasing,
	springEase,
	type SpringConfig,
	type SpringPreset,
	type SpringInput
} from './spring.js';
export {
	animate,
	getMotion,
	getVelocity,
	setMotion,
	globalMotion,
	type MotionChannel,
	type MotionValues,
	type AnimateOptions,
	type AnimationHandle
} from './animate.js';
export { SpringValue, reducedMotion } from './spring.svelte.js';
export {
	vars,
	magnetic,
	tilt,
	press,
	hover,
	pointer,
	inView,
	reveal,
	stagger,
	drag,
	parallax,
	scrollProgress,
	createFlip,
	type DragState
} from './attachments.js';
export {
	springFade,
	springFly,
	springScale,
	springBlur,
	springSlide,
	type SpringTransitionParams
} from './transitions.js';
export {
	startViewTransition,
	setupViewTransitions,
	supportsViewTransitions,
	vtName,
	type ViewTransitionType,
	type NavigationLike,
	type OnNavigateLike,
	type ViewTransitionSetupOptions
} from './view-transitions.js';
