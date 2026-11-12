<!-- @component An inline message that tells people something about the page they are on. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luCircleAlert, luCircleCheck, luInfo, luTriangleAlert, luX } from '@fractaldesign/icons/lucide';
	import { springSlide } from '../../../motion/index.js';
	import { toneText, type Tone } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		/** The meaning of the message. `danger` and `warning` are announced assertively; the rest politely. */
		tone?: Tone;
		/** The fill style: a tinted `soft` fill, a hairline `outline`, or a full-strength `solid` fill. */
		variant?: 'soft' | 'outline' | 'solid';
		/** A short heading, set above the message. */
		title?: string;
		/** The leading icon. Defaults to one that matches the tone; pass `false` for none. */
		icon?: IconData | false;
		/** Shows a close button. The alert springs closed when it is pressed. */
		dismissible?: boolean;
		/** Called after the alert has been dismissed. */
		onDismiss?: () => void;
		/** Controls drawn below the message — buttons or links. */
		actions?: Snippet;
		/** The message. */
		children?: Snippet;
	}

	let {
		tone = 'info',
		variant = 'soft',
		title,
		icon,
		dismissible = false,
		onDismiss,
		actions,
		children,
		class: klass,
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
	const fills = { soft: 'msg', outline: 'msg outline', solid: 'msg solid ink-auto' } as const;

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
		class={['row gap-md pad-md modern', fills[variant], tone, klass]}
		role={role ?? (urgent ? 'alert' : 'status')}
		out:springSlide
		{...rest}
	>
		{#if glyph}
			<span class={['shrink-0 text-bs lh14', variant === 'solid' ? '' : toneText[tone]]}>
				<Icon icon={glyph} />
			</span>
		{/if}
		<div class="box grow wmin0 gap-xs">
			{#if title}
				<p class="weight-600 text-md lh14">{title}</p>
			{/if}
			{#if children}
				<div class="text-sm lh15">{@render children()}</div>
			{/if}
			{#if actions}
				<div class="row ycenter wrap gap-sm mt-xs">{@render actions()}</div>
			{/if}
		</div>
		{#if dismissible}
			<button type="button" class="dismiss focus-ring text-bs" aria-label="Dismiss" onclick={dismiss}>
				<Icon icon={luX} />
			</button>
		{/if}
	</div>
{/if}
