<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		tags?: string[];
		placeholder?: string;
		maxTags?: number;
		size?: Size;
		disabled?: boolean;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	let {
		tags = $bindable([]),
		placeholder = 'Add tag and press Enter...',
		maxTags,
		size = 'md',
		disabled = false,
		class: className = '',
		onchange,
		...restProps
	}: Props = $props();

	let inputValue = $state('');

	function addTag(text: string) {
		const clean = text.trim();
		if (!clean) return;
		if (tags.includes(clean)) return;
		if (maxTags && tags.length >= maxTags) return;

		tags = [...tags, clean];
		inputValue = '';
		onchange?.(tags);
	}

	function removeTag(index: number) {
		if (disabled) return;
		tags = tags.filter((_, i) => i !== index);
		onchange?.(tags);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
			removeTag(tags.length - 1);
		}
	}
</script>

<div
	class="f-tag-input-wrap {className}"
	data-size={size}
	data-disabled={disabled ? 'true' : undefined}
	{...restProps}
>
	<div class="f-tag-list">
		{#each tags as tag, index}
			<span class="f-tag-chip">
				<span class="f-tag-label">{tag}</span>
				{#if !disabled}
					<button
						type="button"
						class="f-tag-remove"
						onclick={() => removeTag(index)}
						aria-label="Remove tag {tag}"
					>
						&times;
					</button>
				{/if}
			</span>
		{/each}

		<input
			type="text"
			class="f-tag-inner-input"
			bind:value={inputValue}
			onkeydown={handleKeydown}
			onblur={() => addTag(inputValue)}
			placeholder={tags.length === 0 ? placeholder : ''}
			disabled={disabled}
		/>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-tag-input-wrap {
			display: flex;
			align-items: center;
			width: 100%;
			min-height: 40px;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			padding: 0.35rem 0.5rem;
			box-sizing: border-box;
			transition: border-color var(--f-duration-fast) var(--f-ease);
		}

		.f-tag-input-wrap:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 1px var(--f-primary);
		}

		.f-tag-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.35rem;
			width: 100%;
		}

		.f-tag-chip {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.2rem 0.5rem;
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border: 1px solid var(--f-border-subtle);
			border-radius: var(--f-radius-sm);
			font-size: var(--f-text-xs);
			font-weight: 500;
		}

		.f-tag-remove {
			border: none;
			background: transparent;
			color: inherit;
			cursor: pointer;
			padding: 0;
			font-size: 1rem;
			line-height: 1;
			opacity: 0.7;
		}

		.f-tag-remove:hover {
			opacity: 1;
		}

		.f-tag-inner-input {
			flex: 1;
			min-width: 80px;
			border: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-sm);
			outline: none;
			padding: 0.2rem;
		}

		.f-tag-inner-input::placeholder {
			color: var(--f-text-muted);
		}
	}
</style>
