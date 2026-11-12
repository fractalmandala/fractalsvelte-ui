<!-- @component A native checkbox with a label, a description and a check that springs in. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luMinus } from '@fractaldesign/icons/lucide';
	import { springFade, springScale } from '../../../motion/index.js';
	import { textClass, type Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size' | 'children' | 'checked' | 'indeterminate' | 'name' | 'value'> {
		/** Whether the box is checked. Two-way bindable. */
		checked?: boolean;
		/** Shows the mixed state: a dash instead of a check. Cleared by the next user toggle. Two-way bindable. */
		indeterminate?: boolean;
		/** The visible label, drawn beside the box. */
		label?: string;
		/** Secondary text under the label, in a quieter ink. */
		description?: string;
		/** The box and text scale. */
		size?: Size;
		/** Marks the box as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** The field name submitted with a form. */
		name?: string;
		/** The value submitted with a form when checked. */
		value?: string;
		/** Called after the user toggles the box, with the new checked state. */
		onCheckedChange?: (checked: boolean) => void;
		/** Rich label content, used in place of `label`. */
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		label,
		description,
		size = 'md',
		invalid = false,
		name,
		value,
		disabled,
		onCheckedChange,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const id = $props.id();
	const marked = $derived(checked || indeterminate);
	const hasText = $derived(Boolean(label || description || children));
</script>

<label
	class={['inline-flex gap-sm', description ? 'ytop' : 'ycenter', 'row', textClass[size], disabled ? 'disabled' : 'pointer', klass]}
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
			<span class="text-primary lh13 weight-500">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if description}
				<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>
			{/if}
		</span>
	{/if}
</label>
