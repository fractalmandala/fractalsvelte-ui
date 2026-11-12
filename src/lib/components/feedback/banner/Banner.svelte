<!-- @component A full-width announcement for the page or the site, optionally pinned and remembered when dismissed. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luCircleAlert, luCircleCheck, luInfo, luTriangleAlert, luX } from '@fractaldesign/icons/lucide';
	import { springSlide } from '../../../motion/index.js';
	import { toneText, type Tone } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		/** The meaning of the announcement. `danger` and `warning` are announced assertively; the rest politely. */
		tone?: Tone;
		/** Pins the banner to the top of the scrollport as the page moves. */
		sticky?: boolean;
		/** A short heading, set before the message. */
		title?: string;
		/** The leading icon. Defaults to one that matches the tone; pass `false` for none. */
		icon?: IconData | false;
		/** Shows a close button. The banner springs closed when it is pressed. */
		dismissible?: boolean;
		/** When set, a dismissal is stored in `localStorage` under this key and the banner stays hidden on later visits. */
		storageKey?: string;
		/** Called after the banner has been dismissed. */
		onDismiss?: () => void;
		/** The label of the action link. Shown when `href` is set. */
		action?: string;
		/** The destination of the action link. */
		href?: string;
		/** The announcement. */
		children?: Snippet;
	}

	let {
		tone = 'info',
		sticky = false,
		title,
		icon,
		dismissible = false,
		storageKey,
		onDismiss,
		action,
		href,
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
		class={['banner h-bs row ycenter gap-md wfull', 'msg', tone, sticky && 'sticky-top', klass]}
		role={role ?? (urgent ? 'alert' : 'region')}
		aria-label={!role && !urgent ? 'Announcement' : undefined}
		out:springSlide
		{...rest}
	>
		{#if glyph}
			<span class={['shrink-0 text-bs lh14', toneText[tone]]}>
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
		</div>
		{#if href && action}
			<a class="link shrink-0 text-sm weight-500" {href}>{action}</a>
		{/if}
		{#if dismissible}
			<button type="button" class="dismiss text-bs" aria-label="Dismiss" onclick={dismiss}>
				<Icon icon={luX} />
			</button>
		{/if}
	</div>
{/if}
