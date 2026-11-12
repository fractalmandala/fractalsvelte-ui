<!-- @component A star rating the person can set, with half values, a custom icon and a hover preview. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luStar } from '@fractaldesign/icons/lucide';
	import { animate, vars } from '../../../motion/index.js';
	import { textClass, type Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The rating, from 0 (none) up to `max`. Two-way bindable. */
		value?: number;
		/** Called whenever the person changes the rating. */
		onValueChange?: (value: number) => void;
		/** The number of icons, and the highest value. */
		max?: number;
		/** Lets the person pick halves, so the value steps by 0.5. */
		allowHalf?: boolean;
		/** Shows the rating without letting it be changed. */
		readonly?: boolean;
		/** The icon scale. */
		size?: Size;
		/** The icon used for each unit. Defaults to a star. */
		icon?: IconData;
		/** Accessible name of the group, announced as the rating changes. */
		label?: string;
		/** Blocks pointer and keyboard input. */
		disabled?: boolean;
		/** The field name; a hidden input submits the value with a form. */
		name?: string;
	}

	let {
		value = $bindable(0),
		onValueChange,
		max = 5,
		allowHalf = false,
		readonly = false,
		size = 'md',
		icon = luStar,
		label,
		disabled = false,
		name,
		class: klass,
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

	/** The selected increment is the tab stop; if none is selected, the first one is. */
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
	class={['inline-flex row ycenter', textClass[size], disabled && 'disabled', klass]}
	onpointerleave={() => (hover = null)}
	onkeydown={key}
	{...rest}
>
	{#each units as unit (unit)}
		<span class={['relative motion square', locked ? 'select-none' : 'pointer']}>
			<Icon {icon} class="text-muted" />
			<span class="clip text-warning" {@attach vars({ value: fillOf(unit) })}>
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
