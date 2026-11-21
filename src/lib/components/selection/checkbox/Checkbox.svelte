<!-- @component A native checkbox with a label, a description and a check that springs in. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLInputAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luMinus } from '@fractaldesign/icons/lucide';
	import { springFade, springScale } from '../../../motion/index.js';
	import { type ChildTextSize, type Gap, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size' | 'children' | 'checked' | 'indeterminate' | 'name' | 'value' | 'disabled'> {
		checked?: boolean;
		indeterminate?: boolean;
		label?: string;
		description?: string;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		gap?: Gap;
		invalid?: boolean;
		name?: string;
		value?: string;
		onCheckedChange?: (checked: boolean) => void;
		children?: Snippet;
			disabled?: boolean | null;
}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		label,
		description,
		size = 'h-lg',
		textSize,
		childTextSize = 'text-sm',
		childTextColor = 'text-secondary',
		gap = 'gap-sm',
		invalid = false,
		name,
		value,
		disabled,
		onCheckedChange,
		class: className,
		children,
		...rest
	}: Props = $props();

	const id = $props.id();
	const marked = $derived(checked || indeterminate);
	const hasText = $derived(Boolean(label || description || children));
</script>

<label
	class={['inline-flex', gap, description ? 'ytop' : 'ycenter', 'row', textSize, disabled ? 'disabled' : 'pointer', className]}
>
	<span class={['checkbox-box', description && 'mt-xs']}>
		<input
			type="checkbox"
			class={['pointer', invalid && 'is-invalid']}
			bind:checked
			bind:indeterminate
			{name}
			{value}
			{disabled}
			aria-invalid={invalid || undefined}
			aria-describedby={description ? `${id}-desc` : undefined}
			onchange={() => onCheckedChange?.(checked)}
			{...rest}
		/>
		{#if marked}
			<span class="inline-flex pointer-none" in:springScale={{ spring: 'bouncy', start: 0.2 }} out:springFade={{ spring: 'stiff' }}>
				<Icon icon={indeterminate ? luMinus : luCheck} />
			</span>
		{/if}
	</span>
	{#if hasText}
		<span class="column xleft gap-xs">
			<span class=" lh13 weight-500">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if description}
				<span id="{id}-desc" class={['lh14', childTextColor, childTextSize]}>{description}</span>
			{/if}
		</span>
	{/if}
</label>
