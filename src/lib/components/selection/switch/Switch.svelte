<!-- @component An on/off switch with a real sliding thumb that overshoots as it settles. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { textClass, type Size } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size' | 'children' | 'checked' | 'name' | 'value' | 'role'> {
		/** Whether the switch is on. Two-way bindable. */
		checked?: boolean;
		/** The track and text scale. */
		size?: Size;
		/** The visible label. */
		label?: string;
		/** Secondary text under the label, in a quieter ink. */
		description?: string;
		/** Which side of the switch the label sits on. */
		labelPosition?: 'start' | 'end';
		/** Marks the switch as failing validation: a danger border and `aria-invalid`. */
		invalid?: boolean;
		/** The field name submitted with a form. */
		name?: string;
		/** The value submitted with a form when on. */
		value?: string;
		/** Called after the user flips the switch, with the new state. */
		onCheckedChange?: (checked: boolean) => void;
		/** Rich label content, used in place of `label`. */
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		size = 'md',
		label,
		description,
		labelPosition = 'end',
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
	const hasText = $derived(Boolean(label || description || children));
</script>

{#snippet text()}
	{#if hasText}
		<span class="column xleft gap-xs">
			<span class="text-primary lh13 weight-500">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if description}
				<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>
			{/if}
		</span>
	{/if}
{/snippet}

<label class={['inline-flex row gap-md', description ? 'ytop' : 'ycenter', textClass[size], disabled ? 'disabled' : 'pointer', klass]}>
	{#if labelPosition === 'start'}{@render text()}{/if}
	<span class={['track pill relative shrink-0', invalid && 'border is-invalid', description && 'mt-xs']}>
		<span class={['cover themed round pop spring-bouncy', checked && 'open']}></span>
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
	{#if labelPosition === 'end'}{@render text()}{/if}
</label>
