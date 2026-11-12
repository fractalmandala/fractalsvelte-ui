<!-- @component A tabbed view with a spring-driven sliding indicator and the WAI-ARIA tabs pattern. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation, Size } from '../../../internal/tokens.js';
	import { setTabs, type TabsActivation, type TabsVariant } from './tabs.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The selected tab's value. Two-way bindable. */
		value?: string | null;
		/** Called whenever the selected tab changes. */
		onValueChange?: (value: string | null) => void;
		/** Lays the tab list out in a row or a column. */
		orientation?: Orientation;
		/** Visual style: a sliding rule, a sliding pill, or a contained switcher. */
		variant?: TabsVariant;
		/** `automatic` selects a tab when it receives focus; `manual` waits for Enter or Space. */
		activation?: TabsActivation;
		/** The control height and text scale of each tab. */
		size?: Size;
		/** Transitions panels in and out with a spring fade. */
		animated?: boolean;
		/** The `TabList` and `TabPanel`s. */
		children?: Snippet;
	}

	let {
		value = $bindable(null),
		onValueChange,
		orientation = 'horizontal',
		variant = 'underline',
		activation = 'automatic',
		size = 'md',
		animated = false,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();

	function select(next: string) {
		if (value === next) return;
		value = next;
		onValueChange?.(next);
	}

	setTabs({
		uid,
		value: () => value,
		select,
		get orientation() {
			return orientation;
		},
		get variant() {
			return variant;
		},
		get activation() {
			return activation;
		},
		get size() {
			return size;
		},
		get animated() {
			return animated;
		}
	});
</script>

<div class={['box gap-bs', klass]} {...rest}>
	{@render children?.()}
</div>
