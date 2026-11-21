<!-- @component Multi-step guided product tour with target spotlighting and anchored walkthrough card. -->

<script lang="ts">
	import type {  ComponentProps  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { luX } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { IconButton } from '../../actions/icon-button/index.js';
	import { vars } from '../../../motion/index.js';
	import type { ChildTextColor, ChildTextSize, Pad, Shape, Surface, TextColor, TextSize } from '../../../internal/tokens.js';
	import { resolveTourTarget, type TourStep } from './tour.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		steps: TourStep[];
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		current?: number;
		onCurrentChange?: (step: number) => void;
		onComplete?: () => void;
		onSkip?: () => void;
		spotlight?: boolean;
		surface?: Surface;
		shape?: Shape;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		metaTextSize?: TextSize;
		childTextColor?: ChildTextColor;
		textColor?: TextColor;
		closeButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		skipButtonProps?: ComponentProps<typeof Button>;
		backButtonProps?: ComponentProps<typeof Button>;
		nextButtonProps?: ComponentProps<typeof Button>;
	}

	let {
		steps,
		open = $bindable(false),
		onOpenChange,
		current = $bindable(0),
		onCurrentChange,
		onComplete,
		onSkip,
		spotlight = true,
		surface = 'elevated',
		shape = 'curved',
		textSize = 'text-bs',
		childTextSize = 'text-sm',
		metaTextSize = 'text-xs',
		childTextColor = 'text-secondary',
		textColor = 'text-muted',
		closeButtonProps,
		skipButtonProps,
		backButtonProps,
		nextButtonProps,
		class: className,
		...rest
	}: Props = $props();

	let targetRect = $state<{ x: number; y: number; w: number; h: number } | null>(null);
	let cardPos = $state<{ x: number; y: number } | null>(null);

	const total = $derived(steps.length);
	const safeIndex = $derived(total === 0 ? 0 : Math.min(Math.max(0, current), total - 1));
	const step = $derived(steps[safeIndex]);
	const isFirst = $derived(safeIndex === 0);
	const isLast = $derived(safeIndex >= total - 1);

	function measure() {
		if (!open || !step) {
			targetRect = null;
			cardPos = null;
			return;
		}
		const el = resolveTourTarget(step.target);
		if (!el) {
			targetRect = null;
			cardPos = null;
			return;
		}
		const rect = el.getBoundingClientRect();
		const pad = 6;
		const spot = {
			x: Math.round(rect.left - pad),
			y: Math.round(rect.top - pad),
			w: Math.round(rect.width + pad * 2),
			h: Math.round(rect.height + pad * 2)
		};
		targetRect = spot;

		if (typeof window !== 'undefined') {
			const cardW = Math.min(320, window.innerWidth - 32);
			const prefTop = step.placement?.startsWith('top');
			const aboveY = spot.y - 190;
			const belowY = spot.y + spot.h + 12;
			const y = prefTop && aboveY > 12 ? aboveY : belowY + 180 < window.innerHeight ? belowY : Math.max(12, aboveY);
			const x = Math.min(window.innerWidth - cardW - 16, Math.max(16, spot.x));
			cardPos = { x: Math.round(x), y: Math.round(y) };
		}
	}

	$effect(() => {
		if (!open || !step) {
			targetRect = null;
			cardPos = null;
			return;
		}
		const el = resolveTourTarget(step.target);
		if (el && typeof el.scrollIntoView === 'function') {
			el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
		}
		measure();
		const onMove = () => measure();
		window.addEventListener('resize', onMove);
		window.addEventListener('scroll', onMove, true);
		return () => {
			window.removeEventListener('resize', onMove);
			window.removeEventListener('scroll', onMove, true);
		};
	});

	function setOpen(next: boolean) {
		open = next;
		onOpenChange?.(next);
	}

	function goTo(idx: number) {
		const next = Math.min(total - 1, Math.max(0, idx));
		current = next;
		onCurrentChange?.(next);
	}

	function skip() {
		setOpen(false);
		onSkip?.();
	}

	function next() {
		if (isLast) {
			setOpen(false);
			onComplete?.();
		} else {
			goTo(safeIndex + 1);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			skip();
		} else if (event.key === 'ArrowRight' && !isLast) {
			event.preventDefault();
			goTo(safeIndex + 1);
		} else if (event.key === 'ArrowLeft' && !isFirst) {
			event.preventDefault();
			goTo(safeIndex - 1);
		}
	}
</script>

<svelte:window onkeydown={onKeyDown} />

{#if open && step}
	{#if spotlight && targetRect}
		<div
			class="tour-spot"
			aria-hidden="true"
			{@attach vars({
				'spot-x': targetRect.x,
				'spot-y': targetRect.y,
				'spot-w': targetRect.w,
				'spot-h': targetRect.h
			})}
		></div>
	{/if}

	<div
		role="dialog"
		aria-modal="false"
		aria-labelledby="tour-step-title"
		class={[
			'tour-card box gap-md',
			surface,
			shape,
			'pad-md',
			!cardPos && 'centered',
			className
		]}
		{@attach vars(cardPos ? { 'card-x': cardPos.x, 'card-y': cardPos.y } : {})}
		{...rest}
	>
		<div class="row ycenter xbetween gap-sm">
			<span class={['weight-500 tabular-nums', metaTextSize, textColor]}>
				Step {safeIndex + 1} of {total}
			</span>
			<IconButton variant="ghost" size="h-xs" icon={luX} label="Close tour" onclick={skip} {...closeButtonProps} />
		</div>

		<div class="box gap-xs">
			<h3 id="tour-step-title" class={['weight-600', textSize]}>{step.title}</h3>
			<p class={[childTextSize, childTextColor]}>{step.description}</p>
		</div>

		<div class="row ycenter xbetween gap-sm">
			<Button variant="ghost" size="h-sm" onclick={skip} {...skipButtonProps}>Skip</Button>
			<div class="row ycenter gap-xs">
				{#if !isFirst}
					<Button variant="outline" size="h-sm" onclick={() => goTo(safeIndex - 1)} {...backButtonProps}>Back</Button>
				{/if}
				<Button variant="themed" size="h-sm" onclick={next} {...nextButtonProps}>
					{isLast ? 'Done' : 'Next'}
				</Button>
			</div>
		</div>
	</div>
{/if}
