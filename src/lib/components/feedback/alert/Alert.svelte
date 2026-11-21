<!-- @component An inline message that tells people something about the page they are on. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import type {  ChildTextSize, Gap, Pad, Shape, TextSize, Variant  } from '../../../internal/tokens.js';
	import { luCircleAlert, luCircleCheck, luInfo, luTriangleAlert, luX } from '@fractaldesign/icons/lucide';
	import { springSlide } from '../../../motion/index.js';
	import { type Tone } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		tone?: Tone;
		variant?: Variant;
		shape?: Shape;
		pad?: Pad;
		gap?: Gap;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		title?: string;
		icon?: IconData | false;
		iconSize?: TextSize;
		dismissible?: boolean;
		onDismiss?: () => void;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		tone = 'info',
		variant = 'secondary',
		shape = 'modern',
		pad = 'pad-md',
		gap = 'gap-md',
		textSize = 'text-md',
		childTextSize = 'text-sm',
		title,
		icon,
		iconSize = 'text-bs',
		dismissible = false,
		onDismiss,
		actions,
		children,
		class: className,
		role,
		...rest
	}: Props = $props();

	const defaults: Record<Tone, IconData> = {
		neutral: luInfo,
		info: luInfo,
		success: luCircleCheck,
		warning: luTriangleAlert,
		danger: luCircleAlert
	};
	const fills: Record<string, string> = { secondary: 'msg', outline: 'msg outline', primary: 'msg solid ink-auto' };

	let open = $state(true);
	const glyph = $derived(icon === undefined ? defaults[tone] : icon);
	const urgent = $derived(tone === 'danger' || tone === 'warning');

	function dismiss() {
		open = false;
		onDismiss?.();
	}
</script>

{#if open}
	<div
		class={['row', gap, pad, shape, fills[variant] ?? fills.secondary, tone, className]}
		role={role ?? (urgent ? 'alert' : 'status')}
		out:springSlide
		{...rest}
	>
		{#if glyph}
			<span class={['shrink-0 lh14', iconSize, variant === 'primary' ? '' : `text-${`tone`}`]}>
				<Icon icon={glyph} />
			</span>
		{/if}
		<div class="box grow wmin0 gap-xs">
			{#if title}
				<p class={['weight-600 lh14', textSize]}>{title}</p>
			{/if}
			{#if children}
				<div class={['lh15', childTextSize]}>{@render children()}</div>
			{/if}
			{#if actions}
				<div class="row ycenter wrap gap-sm mt-xs">{@render actions()}</div>
			{/if}
		</div>
		{#if dismissible}
			<button type="button" class={['dismiss focus-ring', iconSize]} aria-label="Dismiss" onclick={dismiss}>
				<Icon icon={luX} />
			</button>
		{/if}
	</div>
{/if}
