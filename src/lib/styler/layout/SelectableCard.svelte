<!-- @component A card that works as a checkbox or radio option. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Pad, Shadow } from '../types';

	export type SelectableCardType = 'checkbox' | 'radio';
	export type IndicatorPosition = 'right' | 'left';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		selected?: boolean;
		type?: SelectableCardType;
		disabled?: boolean;
		value?: string;
		name?: string;
		indicatorPosition?: IndicatorPosition;
		size?: Size;
		surface?: Surface;
		/** Border when not selected; selected cards always use border-strong. */
		border?: Border;
		shadow?: Shadow;
		padding?: Pad;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		title?: string;
		description?: string;
		class?: string;
		onchange?: (selected: boolean) => void;
		indicator?: Snippet;
		children?: Snippet;
	}

	let {
		selected = $bindable(false),
		type = 'checkbox',
		disabled = false,
		value,
		name,
		indicatorPosition = 'right',
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-none',
		padding = 'pad-md',
		shape = 'curved',
		title,
		description,
		class: className = '',
		onchange,
		indicator,
		children,
		...restProps
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		selected = type === 'radio' ? true : !selected;
		onchange?.(selected);
	}
</script>

{#snippet mark()}
	<span class="row ycenter shrink-0 text-lg {selected ? 'text-theme' : 'text-muted'}" aria-hidden="true">
		{#if indicator}
			{@render indicator()}
		{:else}
			<svg viewBox="0 0 20 20" width="1em" height="1em">
				{#if type === 'radio'}
					<circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5" />
					{#if selected}<circle cx="10" cy="10" r="4.5" fill="currentColor" />{/if}
				{:else}
					<rect x="1.5" y="1.5" width="17" height="17" rx="4" fill={selected ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.5" />
					{#if selected}
						<polyline points="5.5 10.5 8.5 13.5 14.5 7" fill="none" class="text-white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					{/if}
				{/if}
			</svg>
		{/if}
	</span>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex (role is checkbox or radio) -->
<div
	role={type}
	aria-checked={selected}
	aria-disabled={disabled || undefined}
	tabindex={disabled ? -1 : 0}
	data-value={value}
	data-name={name}
	class="card card-sized card-clickable row ytop gap-sm el-shape {size} {shape} {padding} {surface} {shadow} {selected ? 'border-strong' : border} {disabled ? 'disabled text-muted' : ''} {className}"
	onclick={toggle}
	onkeydown={(e) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			toggle();
		}
	}}
	{...restProps}
>
	{#if indicatorPosition === 'left'}{@render mark()}{/if}
	<div class="box gap-xs grow min0">
		{#if title}<span class="card-label weight-600 {disabled ? '' : 'text-primary'}">{title}</span>{/if}
		{#if description}<span class="card-sub text-secondary">{description}</span>{/if}
		{@render children?.()}
	</div>
	{#if indicatorPosition === 'right'}{@render mark()}{/if}
</div>
