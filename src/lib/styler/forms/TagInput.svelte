<!-- @component A text field that turns entries into removable tags. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Surface, Size, Shape, Shadow } from '../types';
	import { getFieldLook } from './field-context';
	import Tag from '../display/Tag.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		tags?: string[];
		placeholder?: string;
		maxTags?: number;
		label?: string;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		disabled?: boolean;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	const field = getFieldLook();
	const invalid = Boolean(field.invalid);

	let {
		tags = $bindable([]),
		placeholder = 'Add tag and press Enter…',
		maxTags,
		label,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
		disabled = false,
		class: className = '',
		onchange,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	let inputValue = $state('');

	function addTag(text: string) {
		const clean = text.trim();
		if (!clean || tags.includes(clean) || (maxTags && tags.length >= maxTags)) return;
		tags = [...tags, clean];
		inputValue = '';
		onchange?.(tags);
	}

	function removeTag(index: number) {
		if (disabled) return;
		tags = tags.filter((_, i) => i !== index);
		onchange?.(tags);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
			removeTag(tags.length - 1);
		}
	}
</script>

<div class="box gap-xs {className}" style:min-width="16em" {...restProps}>
	{#if label}<label class="text-xs weight-500 text-secondary" for={uid}>{label}</label>{/if}
	<div class="row ycenter wrap gap-xs px-xs border el-shape {surface} {shape} {shadow} {invalid ? 'is-invalid' : ''}" style:min-height="var(--height-{size.slice(2)})">
		{#each tags as tag, index (tag)}
			<Tag removable={!disabled} removeLabel="Remove tag {tag}" onremove={() => removeTag(index)}>{tag}</Tag>
		{/each}
		<input
			id={uid}
			type="text"
			class="input grow min0 border-none text-sm"
			style:background="transparent"
			bind:value={inputValue}
			{onkeydown}
			onblur={() => addTag(inputValue)}
			placeholder={tags.length === 0 ? placeholder : ''}
			aria-invalid={invalid || undefined}
			{disabled}
		/>
	</div>
	{#if maxTags}<span class="text-sm text-muted tabular-nums">{String(tags.length).padStart(String(maxTags).length, '\u2007')} / {maxTags}</span>{/if}
</div>
