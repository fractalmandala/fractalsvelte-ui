<!-- @component A full-width announcement for the page or the site, optionally pinned and remembered when dismissed. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luCircleAlert, luCircleCheck, luInfo, luTriangleAlert, luX } from '@fractaldesign/icons/lucide';
	import { springSlide } from '../../../motion/index.js';
	import { type ChildTextSize, type Gap, type Size, type TextSize, type Tone } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		tone?: Tone;
		sticky?: boolean;
		size?: Size;
		gap?: Gap;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		title?: string;
		icon?: IconData | false;
		iconSize?: TextSize;
		dismissible?: boolean;
		storageKey?: string;
		onDismiss?: () => void;
		action?: string;
		href?: string;
		children?: Snippet;
	}

	let {
		tone = 'info',
		sticky = false,
		size = 'h-bs',
		gap = 'gap-md',
		textSize = 'text-md',
		childTextSize = 'text-sm',
		title,
		icon,
		iconSize = 'text-bs',
		dismissible = false,
		storageKey,
		onDismiss,
		action,
		href,
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

	let open = $state(true);
	let ready = $state(false);
	const glyph = $derived(icon === undefined ? defaults[tone] : icon);
	const urgent = $derived(tone === 'danger' || tone === 'warning');

	$effect(() => {
		if (!storageKey) {
			ready = true;
			return;
		}
		try {
			open = localStorage.getItem(storageKey) !== '1';
		} catch {
			// private mode or a blocked store — show the banner
		}
		ready = true;
	});

	function dismiss() {
		open = false;
		if (storageKey) {
			try {
				localStorage.setItem(storageKey, '1');
			} catch {
				// ignore a blocked store
			}
		}
		onDismiss?.();
	}
</script>

{#if ready && open}
	<div
		class={['banner row ycenter wfull', gap, size, 'msg', tone, sticky && 'sticky-top', className]}
		role={role ?? (urgent ? 'alert' : 'region')}
		aria-label={!role && !urgent ? 'Announcement' : undefined}
		out:springSlide
		{...rest}
	>
		{#if glyph}
			<span class={['shrink-0 lh14', iconSize, `text-${`tone`}`]}>
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
		</div>
		{#if href && action}
			<a class={['link shrink-0 weight-500', childTextSize]} {href}>{action}</a>
		{/if}
		{#if dismissible}
			<button type="button" class={['dismiss focus-ring', iconSize]} aria-label="Dismiss" onclick={dismiss}>
				<Icon icon={luX} />
			</button>
		{/if}
	</div>
{/if}
