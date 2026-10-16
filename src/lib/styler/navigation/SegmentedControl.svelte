<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface SegmentedOption {
		value: string;
		label: string;
		icon?: Snippet;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSize } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		options?: SegmentedOption[];
		value?: string;
		size?: FsSize;
		disabled?: boolean;
		/** Submits the value with a form */
		name?: string;
		class?: string;
		option?: Snippet<[{ option: SegmentedOption; selected: boolean }]>;
	}

	let {
		options = [],
		value = $bindable(''),
		size = 'md',
		disabled = false,
		name = '',
		class: className = '',
		option,
		...restProps
	}: Props = $props();

	let containerEl = $state<HTMLDivElement | null>(null);

	$effect.pre(() => {
		if (!value && options.length > 0) {
			const first = options.find((o) => !o.disabled);
			if (first) value = first.value;
		}
	});

	function onkeydown(event: KeyboardEvent, index: number) {
		if (disabled) return;
		const enabled = options.filter((o) => !o.disabled);
		const cur = enabled.findIndex((o) => o.value === options[index].value);
		const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
		if (!step || !enabled.length) return;
		event.preventDefault();
		const target = enabled[(cur + step + enabled.length) % enabled.length];
		value = target.value;
		containerEl?.querySelector<HTMLButtonElement>(`button[data-value="${CSS.escape(target.value)}"]`)?.focus();
	}
</script>

<!-- The canonical fractalstyler segmented control: the selected segment is the
     one painted primary, the rest stay ghost. -->
<div
	bind:this={containerEl}
	class="row ycenter shrink-0 pad-xs gap-xs bg-raised border radius-sm {className}"
	role="radiogroup"
	aria-disabled={disabled || undefined}
	{...restProps}
>
	{#if name}<input type="hidden" {name} {value} />{/if}
	{#each options as opt, i (opt.value)}
		{@const selected = opt.value === value}
		<button
			type="button"
			role="radio"
			class="gap-xs"
			data-variant={selected ? 'primary' : 'ghost'}
			data-size={size}
			data-shape="modern"
			data-value={opt.value}
			aria-checked={selected}
			tabindex={selected ? 0 : -1}
			disabled={disabled || opt.disabled}
			onclick={() => (value = opt.value)}
			onkeydown={(e) => onkeydown(e, i)}
		>
			{#if option}
				{@render option({ option: opt, selected })}
			{:else}
				{@render opt.icon?.()}
				<span>{opt.label}</span>
			{/if}
		</button>
	{/each}
</div>
