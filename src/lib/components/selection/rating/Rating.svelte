<!-- @component A star rating the person can set, with half values, a custom icon and a hover preview. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luStar } from '@fractaldesign/icons/lucide';
	import { animate, vars } from '../../../motion/index.js';
	import { type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value?: number;
		onValueChange?: (value: number) => void;
		max?: number;
		allowHalf?: boolean;
		readonly?: boolean;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: TextColor;
		icon?: IconData;
		label?: string;
		disabled?: boolean;
		name?: string;
	}

	let {
		value = $bindable(0),
		onValueChange,
		max = 5,
		allowHalf = false,
		readonly = false,
		size = 'h-lg',
		textSize,
		textColor = 'text-warning',
		childTextColor = 'text-muted',
		icon = luStar,
		label,
		disabled = false,
		name,
		class: className,
		...rest
	}: Props = $props();

	const step = $derived(allowHalf ? 0.5 : 1);
	const locked = $derived(readonly || disabled);
	const units = $derived(Array.from({ length: max }, (_, i) => i + 1));

	let hover = $state<number | null>(null);
	const shown = $derived(hover ?? value);

	function snap(raw: number): number {
		const n = Math.round(raw / step) * step;
		return Math.min(max, Math.max(0, Number(n.toFixed(1))));
	}

	function fillOf(unit: number): number {
		return Math.min(1, Math.max(0, shown - (unit - 1)));
	}

	function commit(next: number, node?: HTMLElement) {
		const v = snap(next);
		if (v !== value) {
			value = v;
			onValueChange?.(v);
		}
		if (!node) return;
		animate(node, { scale: 1.18 }, { spring: 'bouncy' }).finished.then(() => {
			animate(node, { scale: 1 }, { spring: 'snappy' });
		});
	}

	function key(event: KeyboardEvent) {
		if (locked) return;
		let next: number | undefined;
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				next = snap(value + step || step);
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				next = snap(value - step);
				break;
			case 'Home':
				next = step;
				break;
			case 'End':
				next = max;
				break;
			default:
				return;
		}
		event.preventDefault();
		commit(next);
	}

	function nameOf(unit: number, half: boolean): string {
		const v = half ? unit - 0.5 : unit;
		const base = label ?? 'Rating';
		return `${base}: ${v} of ${max}`;
	}

	function tabFor(v: number): number {
		if (value === v) return 0;
		if (value === 0 && v === step) return 0;
		return -1;
	}
</script>

<div
	role="radiogroup"
	aria-label={label ?? 'Rating'}
	aria-readonly={readonly || undefined}
	aria-disabled={disabled || undefined}
	class={['inline-flex row ycenter', textSize, disabled && 'disabled', className]}
	onpointerleave={() => (hover = null)}
	onkeydown={key}
	{...rest}
>
	{#each units as unit (unit)}
		<span class={['relative motion square', locked ? 'select-none' : 'pointer']}>
			<Icon {icon} class={[childTextColor]} />
			<span class={['clip', textColor]} {@attach vars({ value: fillOf(unit) })}>
				<Icon {icon} />
			</span>
			{#if !locked}
				<span class="cover row">
					{#if allowHalf}
						<button
							type="button"
							role="radio"
							class="bare grow hfull"
							tabindex={tabFor(unit - 0.5)}
							aria-checked={value === unit - 0.5}
							aria-label={nameOf(unit, true)}
							onpointerenter={() => (hover = unit - 0.5)}
							onclick={(e) => commit(unit - 0.5, e.currentTarget.parentElement?.parentElement ?? undefined)}
						></button>
					{/if}
					<button
						type="button"
						role="radio"
						class="bare grow hfull"
						tabindex={tabFor(unit)}
						aria-checked={value === unit}
						aria-label={nameOf(unit, false)}
						onpointerenter={() => (hover = unit)}
						onclick={(e) => commit(unit, e.currentTarget.parentElement?.parentElement ?? undefined)}
					></button>
				</span>
			{/if}
		</span>
	{/each}
	{#if name}
		<input type="hidden" {name} value={value} {disabled} />
	{/if}
</div>
