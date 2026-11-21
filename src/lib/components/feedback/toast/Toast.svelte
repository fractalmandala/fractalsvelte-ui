<!-- @component An imperative notification, stacked in a pile at the edge of the viewport. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import {
		luCircleAlert,
		luCircleCheck,
		luInfo,
		luLoaderCircle,
		luTriangleAlert,
		luX
	} from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import type {  ChildTextColor, ChildTextSize, Gap, Measure, Pad, Shape, Surface, TextSize, Tone  } from '../../../internal/tokens.js';
	import type {  ToastAction  } from './toast.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: Tone;
		loading?: boolean;
		message?: string;
		description?: string;
		action?: ToastAction;
		cancel?: ToastAction;
		actionProps?: ComponentProps<typeof Button>;
		cancelProps?: ComponentProps<typeof Button>;
		dismissible?: boolean;
		iconSize?: TextSize;
		surface?: Surface;
		shape?: Shape;
		pad?: Pad;
		gap?: Gap;
		measure?: Measure;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		onDismiss?: () => void;
		children?: Snippet;
	}

	let {
		tone = 'neutral',
		loading = false,
		message,
		description,
		action,
		cancel,
		actionProps,
		cancelProps,
		dismissible = true,
		iconSize = 'text-bs',
		surface = 'glass',
		shape = 'modern',
		pad = 'pad-md',
		gap = 'gap-md',
		measure = 'measure-sm',
		textSize = 'text-sm',
		childTextSize,
		childTextColor = 'text-secondary',
		onDismiss,
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

	const urgent = $derived(tone === 'danger' || tone === 'warning');
	const glyph = $derived(loading ? luLoaderCircle : defaults[tone]);
	const glyphClass = $derived(loading ? `text-${`'neutral'`}` : `text-${`tone`}`);
	const bodySize = $derived(childTextSize ?? textSize);

	function run(next?: ToastAction) {
		next?.onClick?.();
		onDismiss?.();
	}
</script>

<div
	class={['row', gap, pad, shape, surface, measure, className]}
	role={role ?? (urgent ? 'alert' : 'status')}
	aria-live={role ? undefined : urgent ? 'assertive' : 'polite'}
	aria-atomic="true"
	{...rest}
>
	<span class={['shrink-0 lh14', iconSize, glyphClass, loading && 'anim-spin']}>
		<Icon icon={glyph} />
	</span>
	<div class="box grow wmin0 gap-xs">
		{#if children}
			<div class={['weight-500 lh14', textSize]}>{@render children()}</div>
		{:else if message}
			<p class={['weight-500 lh14', textSize]}>{message}</p>
		{/if}
		{#if description}
			<p class={['lh15', bodySize, childTextColor]}>{description}</p>
		{/if}
		{#if action || cancel}
			<div class="row ycenter wrap gap-sm mt-xs">
				{#if action}
					{#if action.href}
						<Button size="h-bs" variant="primary" href={action.href} onclick={() => run(action)} {...actionProps}>{action.label}</Button>
					{:else}
						<Button size="h-bs" variant="primary" onclick={() => run(action)} {...actionProps}>{action.label}</Button>
					{/if}
				{/if}
				{#if cancel}
					<Button size="h-bs" variant="ghost" onclick={() => run(cancel)} {...cancelProps}>{cancel.label}</Button>
				{/if}
			</div>
		{/if}
	</div>
	{#if dismissible}
		<button type="button" class={['dismiss focus-ring', iconSize]} aria-label="Dismiss" onclick={() => onDismiss?.()}>
			<Icon icon={luX} />
		</button>
	{/if}
</div>
