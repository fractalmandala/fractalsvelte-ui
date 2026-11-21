<!-- @component A tabbed view with a spring-driven sliding indicator and the WAI-ARIA tabs pattern. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Gap, Orientation, Size, TextColor  } from '../../../internal/tokens.js';
	import { setTabs, type TabsActivation } from './tabs.svelte.js';
	import type { Grouping, Surface } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string | null;
		onValueChange?: (value: string | null) => void;
		orientation?: Orientation;
		grouping?: Grouping;
		surface?: Surface;
		activation?: TabsActivation;
		size?: Size;
		textColor?: TextColor;
		gap?: Gap;
		animated?: boolean;
		children?: Snippet;
	}

	let {
		value = $bindable(null),
		onValueChange,
		orientation = 'horizontal',
		grouping = 'flush',
		surface = 'paneled',
		activation = 'automatic',
		size = 'h-lg',
		textColor = 'text-secondary',
		gap = 'gap-bs',
		animated = false,
		class: className,
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
		get grouping() {
			return grouping;
		},
		get surface() {
			return surface;
		},
		get activation() {
			return activation;
		},
		get size() {
			return size;
		},
		get textColor() {
			return textColor;
		},
		get animated() {
			return animated;
		}
	});
</script>

<div class={['box', gap, className]} {...rest}>
	{@render children?.()}
</div>
