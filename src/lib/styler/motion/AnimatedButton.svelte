<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { FsVariant, FsSize, FsShape, BtnType } from '../types';
	import Spinner from '../display/Spinner.svelte';
	import Ripples, { makeRipple, type Ripple } from './Ripples.svelte';

	interface Props extends HTMLButtonAttributes {
		variant?: FsVariant;
		size?: FsSize;
		shape?: FsShape;
		type?: BtnType;
		disabled?: boolean;
		loading?: boolean;
		/** Periodic sheen across the face */
		shine?: boolean;
		/** Ink wave from the click point */
		ripple?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		type = 'button',
		disabled = false,
		loading = false,
		shine = true,
		ripple = true,
		class: className = '',
		children,
		leading,
		trailing,
		onclick,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	let ripples = $state<Ripple[]>([]);
	let counter = 0;

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (disabled || loading) return;
		if (ripple) {
			const r = makeRipple(event, event.currentTarget, ++counter);
			ripples = [...ripples, r];
			setTimeout(() => (ripples = ripples.filter((x) => x.id !== r.id)), 600);
		}
		onclick?.(event);
	}
</script>

<!-- Overlays are .absolute with no offsets inside a centring flex button, so
     their static position is the button's own box; .relative on the content
     keeps it painted above them. -->
<button
	{type}
	class="relative gap-xs {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	disabled={disabled || loading}
	aria-busy={loading || undefined}
	onclick={handleClick}
	{...restProps}
>
	{#if shine && !disabled && !loading}
		<svg class="absolute full text-white" pointer-events="none" aria-hidden="true">
			<defs>
				<linearGradient id="{uid}-sheen" gradientTransform="rotate(20)">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0" />
					<stop offset="50%" stop-color="currentColor" stop-opacity="0.35" />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
				</linearGradient>
			</defs>
			<rect y="0" width="35%" height="100%" fill="url(#{uid}-sheen)">
				<animate attributeName="x" values="-35%;-35%;100%" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite" />
			</rect>
		</svg>
	{/if}
	{#if ripple}<Ripples {ripples} />{/if}
	<span class="relative row ycenter gap-xs">
		{#if loading}<Spinner />{:else}{@render leading?.()}{/if}
		{@render children?.()}
		{#if !loading}{@render trailing?.()}{/if}
	</span>
</button>
