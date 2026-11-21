<!-- @component An on/off switch with a real sliding thumb that overshoots as it settles. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLInputAttributes  } from 'svelte/elements';
	import { type ChildTextSize, type Gap, type Shape, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size' | 'children' | 'checked' | 'name' | 'value' | 'role' | 'disabled'> {
		checked?: boolean;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		childTextColor?: TextColor;
		shape?: Shape;
		gap?: Gap;
		label?: string;
		description?: string;
		align?: 'start' | 'end';
		invalid?: boolean;
		name?: string;
		value?: string;
		onCheckedChange?: (checked: boolean) => void;
		children?: Snippet;
			disabled?: boolean | null;
}

	let {
		checked = $bindable(false),
		size = 'h-lg',
		textSize,
		childTextSize = 'text-sm',
		childTextColor = 'text-secondary',
		shape = 'round',
		gap = 'gap-md',
		label,
		description,
		align = 'end',
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
	const hasText = $derived(Boolean(label || description || children));
</script>

<label class={['inline-flex row', gap, description ? 'ytop' : 'ycenter', textSize, disabled ? 'disabled' : 'pointer', className]}>
	{#if align === 'start'}{@render text()}{/if}
	<span class={['track pill relative shrink-0', invalid && 'border is-invalid', description && 'mt-xs']}>
		<span class={['cover themed pop spring-bouncy', shape, checked && 'open']}></span>
		<input
			type="checkbox"
			role="switch"
			class="native"
			bind:checked
			{name}
			{value}
			{disabled}
			aria-invalid={invalid || undefined}
			aria-describedby={description ? `${id}-desc` : undefined}
			onchange={() => onCheckedChange?.(checked)}
			{...rest}
		/>
		<span class="thumb snug glide spring-bouncy"></span>
	</span>
	{#if align === 'end'}{@render text()}{/if}
</label>

{#snippet text()}
	{#if hasText}
		<span class="column xleft gap-xs">
			<span class=" lh13 weight-500">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if description}
				<span id="{id}-desc" class={['lh14', childTextColor, childTextSize]}>{description}</span>
			{/if}
		</span>
	{/if}
{/snippet}
