export interface StateNode {
	id: string;
	label: string;
	type?: 'initial' | 'intermediate' | 'terminal' | 'transient';
	description?: string;
	x: number;
	y: number;
}

export interface StateTransition {
	id: string;
	from: string;
	to: string;
	event: string;
	label?: string;
	description?: string;
	curveOffset?: number;
}

export interface StateMachineScenario {
	name: string;
	description: string;
	steps: {
		from: string;
		to: string;
		event: string;
		durationMs: number;
		annotation?: string;
	}[];
}

export interface StateMachineDef {
	componentName: string;
	title: string;
	description: string;
	initialState: string;
	nodes: StateNode[];
	transitions: StateTransition[];
	scenarios: StateMachineScenario[];
}

export const stateMachines: Record<string, StateMachineDef> = {
	HoldToConfirm: {
		componentName: 'HoldToConfirm',
		title: 'Hold to Confirm Lifecycle',
		description: 'A linear progress fill animation that converts into an asynchronous promise resolution with auto-drain on early release.',
		initialState: 'idle',
		nodes: [
			{ id: 'idle', label: 'Idle', type: 'initial', description: 'At rest waiting for user pointer/key hold', x: 80, y: 150 },
			{ id: 'holding', label: 'Holding (Linear Wipe)', type: 'intermediate', description: 'Clip-path progress fills at a steady pace', x: 300, y: 70 },
			{ id: 'draining', label: 'Draining', type: 'transient', description: 'Early release drains progress back to rest in 200ms', x: 300, y: 240 },
			{ id: 'working', label: 'Working (Async)', type: 'intermediate', description: 'Hold finished; awaiting onconfirm() promise', x: 540, y: 70 },
			{ id: 'done', label: 'Done (Success)', type: 'terminal', description: 'Resolved successfully; displays checkmark for 1600ms', x: 760, y: 150 }
		],
		transitions: [
			{ id: 't1', from: 'idle', to: 'holding', event: 'pointerdown / keydown', label: 'Hold Starts' },
			{ id: 't2', from: 'holding', to: 'draining', event: 'early pointerup / keyup', label: 'Released Early' },
			{ id: 't3', from: 'draining', to: 'idle', event: 'drain complete (200ms)', label: 'Reset' },
			{ id: 't4', from: 'holding', to: 'working', event: 'hold animation finishes', label: 'onconfirm()' },
			{ id: 't5', from: 'working', to: 'done', event: 'promise resolves', label: 'Success' },
			{ id: 't6', from: 'working', to: 'idle', event: 'promise rejects / timeout', label: 'Error Catch', curveOffset: 50 },
			{ id: 't7', from: 'done', to: 'idle', event: 'timer expires (1600ms)', label: 'Auto Reset', curveOffset: 70 }
		],
		scenarios: [
			{
				name: 'Full Confirmation (Happy Path)',
				description: 'User presses and holds button through full duration until action executes and confirms.',
				steps: [
					{ from: 'idle', to: 'holding', event: 'pointerdown', durationMs: 1200, annotation: 'User presses pointer; fill animation starts linear wipe' },
					{ from: 'holding', to: 'working', event: 'hold finish', durationMs: 1400, annotation: 'Hold threshold reached; onconfirm() executes with spinner' },
					{ from: 'working', to: 'done', event: 'promise resolves', durationMs: 1600, annotation: 'Success tick displays; screen reader announces completion' },
					{ from: 'done', to: 'idle', event: 'timeout 1600ms', durationMs: 800, annotation: 'Button fades back to idle rest state' }
				]
			},
			{
				name: 'Early Release (Cancel Drain)',
				description: 'User lets go of button before completion; progress quickly drains back to 0%.',
				steps: [
					{ from: 'idle', to: 'holding', event: 'pointerdown', durationMs: 600, annotation: 'User holds for 500ms' },
					{ from: 'holding', to: 'draining', event: 'pointerup early', durationMs: 400, annotation: 'User releases; fast reverse wipe drains fill' },
					{ from: 'draining', to: 'idle', event: 'drain finished', durationMs: 600, annotation: 'Button safely back at resting state' }
				]
			}
		]
	},

	ConfirmButton: {
		componentName: 'ConfirmButton',
		title: 'Two-Step Confirmation Flow',
		description: 'A two-touch confirmation button guarded by a 3000ms expiration timeout and asynchronous settling.',
		initialState: 'idle',
		nodes: [
			{ id: 'idle', label: 'Idle', type: 'initial', description: 'Resting with primary label', x: 100, y: 150 },
			{ id: 'asking', label: 'Asking ("Are you sure?")', type: 'intermediate', description: 'Awaiting confirmation click; 3000ms countdown timer running', x: 340, y: 80 },
			{ id: 'working', label: 'Working', type: 'intermediate', description: 'Executing onconfirm(); busy state active', x: 580, y: 80 },
			{ id: 'done', label: 'Done', type: 'terminal', description: 'Action confirmed; displays done state for 1600ms', x: 740, y: 220 }
		],
		transitions: [
			{ id: 't1', from: 'idle', to: 'asking', event: 'click 1', label: 'First Press' },
			{ id: 't2', from: 'asking', to: 'idle', event: '3000ms timeout / Escape / blur', label: 'Cancel / Timeout', curveOffset: 40 },
			{ id: 't3', from: 'asking', to: 'working', event: 'click 2', label: 'Confirm Press' },
			{ id: 't4', from: 'working', to: 'done', event: 'promise resolves', label: 'Settled OK' },
			{ id: 't5', from: 'working', to: 'idle', event: 'promise rejects', label: 'Failed', curveOffset: 40 },
			{ id: 't6', from: 'done', to: 'idle', event: '1600ms timeout', label: 'Reset', curveOffset: 60 }
		],
		scenarios: [
			{
				name: 'Standard Confirmation',
				description: 'First click prompts question, second click confirms and executes.',
				steps: [
					{ from: 'idle', to: 'asking', event: 'click', durationMs: 1000, annotation: 'Morphs to "Are you sure?" with assertive screen reader announcement' },
					{ from: 'asking', to: 'working', event: 'click', durationMs: 1400, annotation: 'Shows spinner while awaiting onconfirm()' },
					{ from: 'working', to: 'done', event: 'resolved', durationMs: 1600, annotation: 'Success icon appears' },
					{ from: 'done', to: 'idle', event: '1600ms timeout', durationMs: 600, annotation: 'Morphs back to standard action label' }
				]
			},
			{
				name: 'Inaction Expiration',
				description: 'User triggers prompt but does not confirm; button safely reverts.',
				steps: [
					{ from: 'idle', to: 'asking', event: 'click', durationMs: 3000, annotation: '3000ms countdown window begins' },
					{ from: 'asking', to: 'idle', event: 'timeout', durationMs: 600, annotation: 'Timer expires; question dismisses without side effects' }
				]
			}
		]
	},

	Drawer: {
		componentName: 'Drawer',
		title: 'Drawer Gesture & Modal State Machine',
		description: 'A native HTMLDialog modal augmented with continuous physics drag-dismissal and velocity snap-back.',
		initialState: 'closed',
		nodes: [
			{ id: 'closed', label: 'Closed', type: 'initial', description: 'Dialog closed and inert', x: 80, y: 150 },
			{ id: 'open', label: 'Open', type: 'intermediate', description: 'Modal presented with inert backdrop', x: 280, y: 70 },
			{ id: 'dragging', label: 'Dragging Gesture', type: 'intermediate', description: 'Pointer captured; tracking translation delta along placement axis', x: 520, y: 70 },
			{ id: 'snapping_back', label: 'Snapping Back', type: 'transient', description: 'Released below dismiss threshold; springs back to 0px', x: 520, y: 240 },
			{ id: 'dismissing', label: 'Dismissing', type: 'terminal', description: 'Drag limit exceeded or velocity flick; slides out to edge', x: 740, y: 150 }
		],
		transitions: [
			{ id: 't1', from: 'closed', to: 'open', event: 'open = true / showModal()', label: 'Open' },
			{ id: 't2', from: 'open', to: 'dragging', event: 'pointerdown + delta >= 4px', label: 'Drag Start' },
			{ id: 't3', from: 'open', to: 'closed', event: 'Escape / close button / backdrop click', label: 'Close', curveOffset: 50 },
			{ id: 't4', from: 'dragging', to: 'dismissing', event: 'delta > 30% || velocity > 0.5', label: 'Flick / Past 30%' },
			{ id: 't5', from: 'dragging', to: 'snapping_back', event: 'delta < 30% && low velocity', label: 'Release' },
			{ id: 't6', from: 'snapping_back', to: 'open', event: 'spring settles', label: 'Restored' },
			{ id: 't7', from: 'dismissing', to: 'closed', event: 'exit animation ends', label: 'Closed', curveOffset: 60 }
		],
		scenarios: [
			{
				name: 'Drag Dismissal Gesture',
				description: 'User drags drawer down and releases past threshold to dismiss.',
				steps: [
					{ from: 'closed', to: 'open', event: 'showModal()', durationMs: 1000, annotation: 'Drawer slides into screen with backdrop overlay' },
					{ from: 'open', to: 'dragging', event: 'pointerdown + drag', durationMs: 1200, annotation: 'Pointer moves > 4px, takes pointer capture and tracks delta' },
					{ from: 'dragging', to: 'dismissing', event: 'release > 30%', durationMs: 800, annotation: 'Flick velocity exceeds threshold; slides off-screen' },
					{ from: 'dismissing', to: 'closed', event: 'closed', durationMs: 600, annotation: 'Focus returns to opening trigger' }
				]
			},
			{
				name: 'Drag Snapback (Abort)',
				description: 'User starts pulling drawer but lets go before threshold.',
				steps: [
					{ from: 'closed', to: 'open', event: 'showModal()', durationMs: 800, annotation: 'Drawer open' },
					{ from: 'open', to: 'dragging', event: 'small drag', durationMs: 800, annotation: 'Pulled 20px' },
					{ from: 'dragging', to: 'snapping_back', event: 'release', durationMs: 500, annotation: 'Delta is under 30%; springs back' },
					{ from: 'snapping_back', to: 'open', event: 'settles', durationMs: 600, annotation: 'Drawer rests stably open' }
				]
			}
		]
	},

	Toast: {
		componentName: 'Toast',
		title: 'Toast Notification Lifecycle',
		description: 'Active countdown timer with pause on hover/focus, swipe-to-dismiss velocity gesture, and stack layout.',
		initialState: 'active',
		nodes: [
			{ id: 'active', label: 'Active', type: 'initial', description: 'Pushed to toast queue with duration', x: 80, y: 150 },
			{ id: 'countdown', label: 'Counting Down', type: 'intermediate', description: 'Timeout tick running towards 0ms', x: 280, y: 70 },
			{ id: 'paused', label: 'Paused', type: 'intermediate', description: 'Cursor hovered or card focused; remaining time frozen', x: 500, y: 70 },
			{ id: 'swiping', label: 'Swiping Card', type: 'intermediate', description: 'Pointer capture horizontal drag', x: 380, y: 240 },
			{ id: 'dismissed', label: 'Dismissed', type: 'terminal', description: 'Removed from live toasts list', x: 740, y: 150 }
		],
		transitions: [
			{ id: 't1', from: 'active', to: 'countdown', event: 'mount', label: 'Start Timer' },
			{ id: 't2', from: 'countdown', to: 'paused', event: 'pointerenter / focus', label: 'Hover / Focus' },
			{ id: 't3', from: 'paused', to: 'countdown', event: 'pointerleave / blur (remaining > 0)', label: 'Resume' },
			{ id: 't4', from: 'paused', to: 'dismissed', event: 'pointerleave (remaining <= 0)', label: 'Immediate Dismiss', curveOffset: 40 },
			{ id: 't5', from: 'countdown', to: 'swiping', event: 'pointerdown on card', label: 'Swipe Start' },
			{ id: 't6', from: 'swiping', to: 'dismissed', event: 'swipe threshold met', label: 'Flick Off' },
			{ id: 't7', from: 'swiping', to: 'countdown', event: 'swipe release (under limit)', label: 'Snap Back' },
			{ id: 't8', from: 'countdown', to: 'dismissed', event: 'timeout expires', label: 'Time Expiry' }
		],
		scenarios: [
			{
				name: 'Hover Pause & Natural Expiration',
				description: 'Toast pops up, user hovers to read, then leaves and timer completes dismissal.',
				steps: [
					{ from: 'active', to: 'countdown', event: 'mount', durationMs: 1000, annotation: 'Toast appears on screen' },
					{ from: 'countdown', to: 'paused', event: 'hover', durationMs: 1800, annotation: 'User moves cursor over toast; countdown pauses' },
					{ from: 'paused', to: 'countdown', event: 'leave', durationMs: 1400, annotation: 'Cursor exits; remaining countdown resumes' },
					{ from: 'countdown', to: 'dismissed', event: 'timeout', durationMs: 600, annotation: 'Duration reaches 0; card animates out' }
				]
			},
			{
				name: 'Swipe to Dismiss',
				description: 'User quickly swipes toast card away to dismiss immediately.',
				steps: [
					{ from: 'active', to: 'countdown', event: 'mount', durationMs: 800, annotation: 'Toast displayed' },
					{ from: 'countdown', to: 'swiping', event: 'drag', durationMs: 700, annotation: 'User swipes card horizontally' },
					{ from: 'swiping', to: 'dismissed', event: 'flick > 80px', durationMs: 500, annotation: 'Velocity threshold met; flies off edge' }
				]
			}
		]
	},

	RotaryDial: {
		componentName: 'RotaryDial',
		title: 'Studio Rotary Dial Physics',
		description: 'Continuous vertical pointer drag with polar angle projection, fine precision mode, and double-click reset.',
		initialState: 'resting',
		nodes: [
			{ id: 'resting', label: 'Resting', type: 'initial', description: 'Dial resting at current quantized value', x: 120, y: 150 },
			{ id: 'dialing', label: 'Dialing (Tracking)', type: 'intermediate', description: 'Capturing relative deltaY movements and updating polar angle', x: 420, y: 70 },
			{ id: 'resetting', label: 'Resetting', type: 'transient', description: 'Double click returning dial to center/defaultVal', x: 420, y: 240 }
		],
		transitions: [
			{ id: 't1', from: 'resting', to: 'dialing', event: 'pointerdown', label: 'Grab Knob' },
			{ id: 't2', from: 'dialing', to: 'dialing', event: 'pointermove', label: 'Rotate' },
			{ id: 't3', from: 'dialing', to: 'resting', event: 'pointerup / pointercancel', label: 'Release' },
			{ id: 't4', from: 'resting', to: 'resetting', event: 'dblclick', label: 'Reset Click' },
			{ id: 't5', from: 'resetting', to: 'resting', event: 'settles', label: 'Rest' }
		],
		scenarios: [
			{
				name: 'Adjustment & Reset',
				description: 'User grabs knob, drags vertically to adjust volume/EQ, then double-clicks to reset.',
				steps: [
					{ from: 'resting', to: 'dialing', event: 'pointerdown', durationMs: 1400, annotation: 'Pointer captured; vertical movements scale value' },
					{ from: 'dialing', to: 'resting', event: 'pointerup', durationMs: 1000, annotation: 'Value locked at chosen level' },
					{ from: 'resting', to: 'resetting', event: 'double click', durationMs: 600, annotation: 'Double click resets dial to zero/bipolar center' },
					{ from: 'resetting', to: 'resting', event: 'settled', durationMs: 600, annotation: 'Dial ready for next interaction' }
				]
			}
		]
	},

	XYPad: {
		componentName: 'XYPad',
		title: '2D XY Control Pad Physics',
		description: 'Dual-axis surface coordinate tracking with 2D bounds clamping and optional spring return.',
		initialState: 'idle',
		nodes: [
			{ id: 'idle', label: 'Idle Rest', type: 'initial', description: 'Puck stationary at coordinate point', x: 120, y: 150 },
			{ id: 'tracking', label: 'Tracking Puck', type: 'intermediate', description: 'Pointer captured; crosshairs and rolling readouts active', x: 420, y: 70 },
			{ id: 'springing', label: 'Spring Return', type: 'transient', description: 'Spring return physics snapping puck back to center', x: 420, y: 240 }
		],
		transitions: [
			{ id: 't1', from: 'idle', to: 'tracking', event: 'pointerdown', label: 'Grab Surface' },
			{ id: 't2', from: 'tracking', to: 'tracking', event: 'pointermove', label: 'Translate X/Y' },
			{ id: 't3', from: 'tracking', to: 'springing', event: 'pointerup (springReturn = true)', label: 'Release' },
			{ id: 't4', from: 'tracking', to: 'idle', event: 'pointerup (springReturn = false)', label: 'Release & Hold' },
			{ id: 't5', from: 'springing', to: 'idle', event: 'reaches center', label: 'Settled' },
			{ id: 't6', from: 'idle', to: 'springing', event: 'dblclick', label: 'Reset' }
		],
		scenarios: [
			{
				name: 'Spring Joystick Mode',
				description: 'User drags puck into top-right quadrant; upon release it springs back to origin.',
				steps: [
					{ from: 'idle', to: 'tracking', event: 'pointerdown', durationMs: 1400, annotation: 'Puck follows cursor across pad' },
					{ from: 'tracking', to: 'springing', event: 'pointerup', durationMs: 800, annotation: 'SpringReturn pulls coordinate back towards default center' },
					{ from: 'springing', to: 'idle', event: 'settles', durationMs: 600, annotation: 'Center origin restored' }
				]
			}
		]
	},

	Combobox: {
		componentName: 'Combobox',
		title: 'Combobox & Autocomplete State Flow',
		description: 'Search filter input with floating anchored list, roving highlight index, and custom-value acceptance.',
		initialState: 'closed',
		nodes: [
			{ id: 'closed', label: 'Closed', type: 'initial', description: 'Field at rest showing selected value or placeholder', x: 80, y: 150 },
			{ id: 'open_listing', label: 'Open (Browse)', type: 'intermediate', description: 'Full options list popped up via chevron or arrow key', x: 300, y: 70 },
			{ id: 'filtering', label: 'Filtering (Typing)', type: 'intermediate', description: 'Query string filtering options in real-time', x: 540, y: 70 },
			{ id: 'navigating', label: 'Keyboard Navigating', type: 'intermediate', description: 'Arrow keys roving active highlight option', x: 380, y: 240 },
			{ id: 'selected', label: 'Selected / Committed', type: 'terminal', description: 'Choice confirmed; popover closed', x: 740, y: 150 }
		],
		transitions: [
			{ id: 't1', from: 'closed', to: 'open_listing', event: 'click / ArrowDown', label: 'Open' },
			{ id: 't2', from: 'open_listing', to: 'filtering', event: 'typing query', label: 'Search' },
			{ id: 't3', from: 'open_listing', to: 'navigating', event: 'ArrowDown / ArrowUp', label: 'Keys' },
			{ id: 't4', from: 'filtering', to: 'navigating', event: 'ArrowDown / ArrowUp', label: 'Select Match' },
			{ id: 't5', from: 'navigating', to: 'selected', event: 'Enter / Tab / click', label: 'Choose' },
			{ id: 't6', from: 'filtering', to: 'selected', event: 'click option', label: 'Direct Click' },
			{ id: 't7', from: 'selected', to: 'closed', event: 'close()', label: 'Sync' },
			{ id: 't8', from: 'open_listing', to: 'closed', event: 'Escape / click outside', label: 'Cancel', curveOffset: 40 },
			{ id: 't9', from: 'filtering', to: 'closed', event: 'Escape (revert query)', label: 'Revert', curveOffset: 60 }
		],
		scenarios: [
			{
				name: 'Type, Filter & Select',
				description: 'User opens combobox, types query letters, navigates highlight with arrows, and presses Enter.',
				steps: [
					{ from: 'closed', to: 'open_listing', event: 'click input', durationMs: 800, annotation: 'Options popover appears anchored to input' },
					{ from: 'open_listing', to: 'filtering', event: 'type "lon"', durationMs: 1200, annotation: 'Options filter to matching entries; accent-folded' },
					{ from: 'filtering', to: 'navigating', event: 'ArrowDown', durationMs: 800, annotation: 'Active descendant highlights "London"' },
					{ from: 'navigating', to: 'selected', event: 'Enter', durationMs: 700, annotation: 'London selected; value and onchange emitted' },
					{ from: 'selected', to: 'closed', event: 'done', durationMs: 500, annotation: 'Input reflects selected label' }
				]
			}
		]
	}
};

export function getStateMachine(name: string): StateMachineDef | undefined {
	return stateMachines[name];
}
