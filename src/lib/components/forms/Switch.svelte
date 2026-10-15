<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLButtonAttributes {
		checked?: boolean;
		label?: string;
		description?: string;
		size?: Size;
		disabled?: boolean;
		id?: string;
		class?: string;
		thumbIcon?: Snippet;
		checkedIcon?: Snippet;
		uncheckedIcon?: Snippet;
	}

	let {
		checked = $bindable(false),
		label,
		description,
		size = 'md',
		disabled = false,
		id,
		class: className = '',
		thumbIcon,
		checkedIcon,
		uncheckedIcon,
		...restProps
	}: Props = $props();

	const autoId = 'f-sw-' + Math.random().toString(36).slice(2, 9);
	const switchId = $derived(id || autoId);

	function toggle() {
		if (disabled) return;
		checked = !checked;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		}
	}
</script>

<div
	class="f-switch-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
>
	<div class="f-switch-row">
		<button
			id={switchId}
			type="button"
			role="switch"
			aria-checked={checked}
			aria-labelledby={label ? `${switchId}-label` : undefined}
			aria-describedby={description ? `${switchId}-desc` : undefined}
			{disabled}
			onclick={toggle}
			onkeydown={handleKeyDown}
			class="f-switch-track"
			data-state={checked ? 'checked' : 'unchecked'}
			{...restProps}
		>
			<span class="f-switch-track-icon f-switch-on-icon" aria-hidden="true">
				{#if checkedIcon}
					{@render checkedIcon()}
				{/if}
			</span>

			<span class="f-switch-thumb" data-state={checked ? 'checked' : 'unchecked'}>
				{#if thumbIcon}
					<span class="f-switch-thumb-icon" aria-hidden="true">
						{@render thumbIcon()}
					</span>
				{/if}
			</span>

			<span class="f-switch-track-icon f-switch-off-icon" aria-hidden="true">
				{#if uncheckedIcon}
					{@render uncheckedIcon()}
				{/if}
			</span>
		</button>

		{#if label || description}
			<label class="f-switch-text" for={switchId}>
				{#if label}
					<span class="f-switch-label" id="{switchId}-label">{label}</span>
				{/if}
				{#if description}
					<span class="f-switch-desc" id="{switchId}-desc">{description}</span>
				{/if}
			</label>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-switch-container {
			display: inline-flex;
			flex-direction: column;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-switch-row {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-sm);
			user-select: none;
		}

		/* Track styling */
		.f-switch-track {
			position: relative;
			display: inline-flex;
			align-items: center;
			padding: 2px;
			background: var(--f-border-strong);
			border: 1px solid transparent;
			border-radius: var(--f-radius-full);
			cursor: pointer;
			outline: none;
			flex-shrink: 0;
			box-sizing: border-box;
			transition: background-color var(--f-duration-normal) var(--f-ease),
				border-color var(--f-duration-normal) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-switch-track:focus-visible {
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-switch-track[data-state='checked'] {
			background: var(--f-primary);
		}

		/* Thumb */
		.f-switch-thumb {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 2px;
			background: #ffffff;
			border-radius: var(--f-radius-full);
			box-shadow: var(--f-shadow-sm);
			transition: transform var(--f-duration-normal) var(--f-ease-spring),
				background-color var(--f-duration-fast) var(--f-ease);
			pointer-events: none;
			box-sizing: border-box;
		}

		.f-switch-thumb-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			color: var(--f-text);
		}

		/* Track Icons */
		.f-switch-track-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			font-size: 10px;
			color: rgba(255, 255, 255, 0.9);
			pointer-events: none;
		}

		.f-switch-on-icon {
			left: 5px;
		}

		.f-switch-off-icon {
			right: 5px;
			color: var(--f-text-muted);
		}

		/* Label / Description */
		.f-switch-text {
			display: flex;
			flex-direction: column;
			gap: 2px;
			cursor: pointer;
		}

		.f-switch-label {
			font-size: var(--f-text-base);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-switch-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		/* Sizing - iOS / macOS proportion scale */
		/* Small */
		.f-switch-container[data-size='sm'] .f-switch-track {
			width: 34px;
			height: 20px;
		}
		.f-switch-container[data-size='sm'] .f-switch-thumb {
			width: 16px;
			height: 16px;
		}
		.f-switch-container[data-size='sm'] .f-switch-track[data-state='checked'] .f-switch-thumb {
			transform: translateX(14px);
		}
		.f-switch-container[data-size='sm'] .f-switch-label {
			font-size: var(--f-text-sm);
		}

		/* Medium (Default) */
		.f-switch-container[data-size='md'] .f-switch-track {
			width: 44px;
			height: 24px;
		}
		.f-switch-container[data-size='md'] .f-switch-thumb {
			width: 20px;
			height: 20px;
		}
		.f-switch-container[data-size='md'] .f-switch-track[data-state='checked'] .f-switch-thumb {
			transform: translateX(20px);
		}
		.f-switch-container[data-size='md'] .f-switch-label {
			font-size: var(--f-text-base);
		}

		/* Large */
		.f-switch-container[data-size='lg'] .f-switch-track {
			width: 54px;
			height: 30px;
		}
		.f-switch-container[data-size='lg'] .f-switch-thumb {
			width: 26px;
			height: 26px;
		}
		.f-switch-container[data-size='lg'] .f-switch-track[data-state='checked'] .f-switch-thumb {
			transform: translateX(24px);
		}
		.f-switch-container[data-size='lg'] .f-switch-label {
			font-size: var(--f-text-lg);
		}

		/* Disabled State */
		.f-switch-container[data-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
		}
		.f-switch-container[data-disabled='true'] .f-switch-track,
		.f-switch-container[data-disabled='true'] .f-switch-text {
			cursor: not-allowed;
		}
	}
</style>
