export default {
	Input: 'A versatile text input field supporting multiple input types, validation feedback, quick clear actions, and password visibility toggling. Exposes input text through a bindable value and accepts optional leading and trailing snippets.',
	TextArea: 'A multi-line text input field supporting dynamic height auto-resizing and character limit tracking. Clamps input to maximum length constraints and exposes contents through a bindable value.',
	Checkbox: 'An accessible selection control supporting checked, unchecked, and indeterminate states. Renders custom vector checkmark iconography and coordinates state changes through bindable checked.',
	Radio: 'An individual selection control featuring a spring-animated inner indicator dot. Emits selection changes through bindable checked and coordinates automatically with parent radio group containers.',
	RadioGroup: 'A semantic radiogroup container that coordinates single-option selection among child radio items. Manages value selection through a bindable value and provides full keyboard arrow navigation across options.',
	Switch: 'A tactile toggle switch control featuring smooth sliding spring transitions and optional track or thumb iconography. Communicates binary on and off states through bindable checked.',
	Select: 'A custom dropdown selection control featuring search filtering, clear actions, and complete keyboard navigation. Connects the active selection to a bindable value and provides accessible popup option lists.',
	Slider: 'A precision numeric range slider featuring a styled track, fill bar, and draggable thumb. Exposes current values through a bindable value and renders optional floating tooltips during interaction.',
	RangeSlider: 'A dual-thumb slider control designed for selecting lower and upper numeric boundaries. Binds minVal and maxVal concurrently and prevents thumbs from crossing minimum distance thresholds.',
	PinInput: 'A segmented one-time passcode and verification input supporting numeric or text entry. Features automatic next-box focus advance, backspace regression, clipboard paste distribution, and a bindable value.',
	NumberInput: 'A numeric stepper control equipped with incremental and decremental action buttons. Clamps values within minimum and maximum limits, adjusts by custom step increments, and binds numeric value.',
	SearchInput: 'A specialized search field pre-configured with search iconography, quick clear action, and keyboard shortcut badge. Emits search query changes through a bindable value and optionally binds to global hotkeys.',
	ColorPicker: 'An integrated color selection interface pairing a visual swatch trigger with hex text input and palette presets. Synchronizes chosen colors with a bindable hex string.',
	FileInput: 'A drag-and-drop file upload zone providing file type validation, size restriction checks, and an interactive file listing. Captures chosen files into a bindable array and provides individual file removal.',
	FormField: 'A layout wrapper component providing standardized label headers, required or optional indicators, descriptive helper text, and validation error messages for form controls.',
	TagInput: 'An interactive multi-tag input creating removable chip pills upon Enter or comma keypress. Supports backspace deletion, duplicate prevention, and maximum tag limits.',
	RotaryDial: 'A precision hardware-grade rotational dial and knob control with 270-degree arc tracking, circular tick marks, LED indicator notch, and numeric readout.'
};
