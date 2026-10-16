<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_PAINT, FIELD_TEXT, SHAPE_RADIUS } from '../classes';
	import Tag from '../display/Tag.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		tags?: string[];
		placeholder?: string;
		maxTags?: number;
		label?: string;
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
		disabled?: boolean;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	let {
		tags = $bindable([]),
		placeholder = 'Add tag and press Enter…',
		maxTags,
		label,
		variant = 'primary',
		size = 'md',
		shape = 'modern',
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

<div class="box gap-xs {className}" {...restProps}>
	{#if label}<label class="text-xs weight-500 text-secondary" for={uid}>{label}</label>{/if}
	<div class="row ycenter wrap gap-xs pad-xs {FIELD_PAINT[variant]} {FIELD_TEXT[size]} {SHAPE_RADIUS[shape]}">
		{#each tags as tag, index (tag)}
			<Tag variant="secondary" removable={!disabled} removeLabel="Remove tag {tag}" onremove={() => removeTag(index)}>{tag}</Tag>
		{/each}
		<input
			id={uid}
			type="text"
			class="input grow min0"
			data-variant="ghost"
			data-size="md"
			bind:value={inputValue}
			{onkeydown}
			onblur={() => addTag(inputValue)}
			placeholder={tags.length === 0 ? placeholder : ''}
			{disabled}
		/>
	</div>
	{#if maxTags}<span class="text-sm text-muted">{tags.length} / {maxTags}</span>{/if}
</div>
