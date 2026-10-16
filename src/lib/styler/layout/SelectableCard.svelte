<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsCardShape, FsPad } from '../types';

	export type SelectableCardType = 'checkbox' | 'radio';
	export type IndicatorPosition = 'right' | 'left';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		selected?: boolean;
		type?: SelectableCardType;
		disabled?: boolean;
		value?: string;
		name?: string;
		indicatorPosition?: IndicatorPosition;
		padding?: FsPad;
		shape?: FsCardShape;
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
		padding = 'md',
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

<!-- Selected cards swap to the sunken/strong-border card paint; there is no
     selected-state class in fractalstyler. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex (role is checkbox or radio) -->
<div
	role={type}
	aria-checked={selected}
	aria-disabled={disabled || undefined}
	tabindex={disabled ? -1 : 0}
	data-value={value}
	data-name={name}
	class="card row ytop gap-sm {disabled ? 'text-muted' : ''} {className}"
	data-variant={selected ? 'secondary' : 'primary'}
	data-pad={padding}
	data-shape={shape}
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
		{#if title}<span class="text-sm weight-600 {disabled ? '' : 'text-primary'}">{title}</span>{/if}
		{#if description}<span class="text-body-sm text-secondary">{description}</span>{/if}
		{@render children?.()}
	</div>
	{#if indicatorPosition === 'right'}{@render mark()}{/if}
</div>
