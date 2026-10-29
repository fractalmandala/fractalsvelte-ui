<!-- @component A slider that wipes between a before and an after image. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	type Ratio = '16/9' | '9/16' | '4/3' | '3/4' | '3/2' | '2/3' | '1/1';
	import SegmentedControl from '../navigation/SegmentedControl.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Wipe position, 0–100 */
		position?: number;
		beforeLabel?: string;
		afterLabel?: string;
		/** Image URLs: when both are set, the wipe is drawn in SVG */
		beforeSrc?: string;
		afterSrc?: string;
		ratio?: Ratio;
		class?: string;
		/** HTML panes: shown one at a time behind a Before / After switch */
		before?: Snippet;
		after?: Snippet;
	}

	let {
		position = $bindable(50),
		beforeLabel = 'Before',
		afterLabel = 'After',
		beforeSrc,
		afterSrc,
		ratio = '16/9',
		class: className = '',
		before,
		after,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	let width = $state(0);
	let dragging = false;
	let shown = $state<'before' | 'after'>('before');

	const imageMode = $derived(Boolean(beforeSrc && afterSrc));
	const height = $derived.by(() => {
		const [a, b] = ratio.split('/').map(Number);
		return Math.round((width * b) / a);
	});
	const x = $derived((position / 100) * width);

	function fromPointer(e: PointerEvent & { currentTarget: HTMLElement }) {
		const r = e.currentTarget.getBoundingClientRect();
		position = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
	}

	function onkeydown(e: KeyboardEvent) {
		const step = e.shiftKey ? 10 : 2;
		const next = e.key === 'ArrowLeft' ? position - step : e.key === 'ArrowRight' ? position + step : e.key === 'Home' ? 0 : e.key === 'End' ? 100 : null;
		if (next === null) return;
		e.preventDefault();
		position = Math.min(100, Math.max(0, next));
	}
</script>

{#if imageMode}
	<!-- Image wipe: the "before" image is clipped by an SVG clipPath whose rect
	     width follows the position, so the comparison is pure SVG geometry. -->
	<div
		bind:clientWidth={width}
		class="box wfull radius-md border {className}"
		role="slider"
		tabindex="0"
		aria-label="{beforeLabel} / {afterLabel} comparison"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(position)}
		onpointerdown={(e) => {
			dragging = true;
			e.currentTarget.setPointerCapture(e.pointerId);
			fromPointer(e);
		}}
		onpointermove={(e) => dragging && fromPointer(e)}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		{onkeydown}
		{...restProps}
	>
		{#if width > 0}
			<svg viewBox="0 0 {width} {height}" class="wfull" aria-hidden="true">
				<defs>
					<clipPath id="{uid}-clip"><rect x="0" y="0" width={x} height={height} /></clipPath>
				</defs>
				<image href={afterSrc} width={width} height={height} preserveAspectRatio="xMidYMid slice" />
				<image href={beforeSrc} width={width} height={height} preserveAspectRatio="xMidYMid slice" clip-path="url(#{uid}-clip)" />
				<line x1={x} y1="0" x2={x} y2={height} class="text-white" stroke="currentColor" stroke-width="2" />
				<g transform="translate({x} {height / 2})">
					<circle r="14" class="text-white" fill="currentColor" />
					<path d="M-4 -5 L-8 0 L-4 5 M4 -5 L8 0 L4 5" class="text-black" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
				</g>
				<g class="text-white" font-size="11" font-weight="600" letter-spacing="1">
					<text x="12" y="22" fill="currentColor">{beforeLabel.toUpperCase()}</text>
					<text x={width - 12} y="22" fill="currentColor" text-anchor="end">{afterLabel.toUpperCase()}</text>
				</g>
			</svg>
		{/if}
	</div>
{:else}
	<!-- Arbitrary HTML cannot be clipped without CSS clip-path, so HTML panes
	     are compared with a switch instead of a wipe. -->
	<div class="box gap-sm {className}" {...restProps}>
		<div class="row">
			<SegmentedControl
				bind:value={shown}
				options={[
					{ value: 'before', label: beforeLabel },
					{ value: 'after', label: afterLabel }
				]}
			/>
		</div>
		<div class="box border radius-md scroll-x" aria-live="polite">
			{#if shown === 'before'}{@render before?.()}{:else}{@render after?.()}{/if}
		</div>
	</div>
{/if}
