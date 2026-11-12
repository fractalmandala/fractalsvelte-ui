<!-- @component One option in the group: a native radio with a label and an optional description. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { animate, setMotion } from '../../../motion/index.js';
	import { textClass } from '../../../internal/tokens.js';
	import { getRadioGroup } from './radio-group.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size' | 'children' | 'checked' | 'name' | 'value' | 'group'> {
		/** The value this radio selects. Must be unique within its group. */
		value: string;
		/** The label; in the `card` variant it is the card title. */
		label?: string;
		/** Supporting text under the label, in a quieter ink. */
		description?: string;
		/** Rich label content, used in place of `label`. */
		children?: Snippet;
	}

	let { value, label, description, disabled = false, class: klass, children, ...rest }: Props = $props();

	const group = getRadioGroup();
	const id = $props.id();
	const checked = $derived(group.value === value);
	const off = $derived(disabled || group.disabled);
	const card = $derived(group.variant === 'card');

	let box = $state<HTMLElement>();
	let seen = false;
	$effect(() => {
		const on = checked;
		if (!box) return;
		if (on && seen) {
			setMotion(box, { scale: 0.78 });
			animate(box, { scale: 1 }, { spring: 'bouncy' });
		}
		seen = true;
	});
</script>

<label
	class={[
		'row gap-sm relative',
		card ? 'ytop pad-md modern spring bg-surface' : description ? 'ytop' : 'ycenter',
		card && (checked ? 'glow' : 'border'),
		card && !checked && !off && 'shad-hover-xs',
		textClass[group.size],
		off ? 'disabled' : 'pointer',
		klass
	]}
>
	<span class={['checkbox-box radio motion', (description || card) && 'mt-xs']} bind:this={box}>
		<input
			type="radio"
			class={['pointer', group.invalid && 'is-invalid']}
			name={group.name}
			{value}
			{checked}
			disabled={off}
			aria-describedby={description ? `${id}-desc` : undefined}
			onchange={() => group.select(value)}
			{...rest}
		/>
	</span>
	{#if label || description || children}
		<span class="column xleft gap-xs">
			<span class="lh13 weight-500 text-primary">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if description}
				<span id="{id}-desc" class="text-secondary text-sm lh14">{description}</span>
			{/if}
		</span>
	{/if}
</label>
