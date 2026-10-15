<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Intent } from '../../types';

	export type ProgressIntent = Intent | 'primary';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		size?: Size;
		intent?: ProgressIntent;
		indeterminate?: boolean;
		striped?: boolean;
		animated?: boolean;
		showValue?: boolean;
		label?: string;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'md',
		intent = 'primary',
		indeterminate = false,
		striped = false,
		animated = false,
		showValue = false,
		label,
		class: className = '',
		...restProps
	}: Props = $props();

	const percentage = $derived(
		indeterminate ? 0 : Math.min(100, Math.max(0, (value / (max || 100)) * 100))
	);
</script>

<div
	class="f-progress-wrapper {className}"
	data-size={size}
	data-intent={intent}
	{...restProps}
>
	{#if label || showValue}
		<div class="f-progress-header">
			{#if label}
				<span class="f-progress-label">{label}</span>
			{/if}
			{#if showValue && !indeterminate}
				<span class="f-progress-value">{Math.round(percentage)}%</span>
			{/if}
		</div>
	{/if}

	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-label={label}
		class="f-progress-track"
	>
		<div
			class="f-progress-bar"
			data-indeterminate={indeterminate ? '' : undefined}
			data-striped={striped ? '' : undefined}
			data-animated={animated ? '' : undefined}
			style={indeterminate ? undefined : `width: ${percentage}%`}
		></div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-progress-wrapper {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			box-sizing: border-box;
			font-family: inherit;
		}

		.f-progress-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: var(--f-text-xs);
			font-weight: 500;
			color: var(--f-text-muted);
		}

		.f-progress-track {
			width: 100%;
			background: var(--f-sunken);
			border-radius: var(--f-radius-full);
			overflow: hidden;
			position: relative;
		}

		.f-progress-bar {
			height: 100%;
			border-radius: var(--f-radius-full);
			transition: width var(--f-duration-normal) var(--f-ease);
		}

		/* Sizes */
		.f-progress-wrapper[data-size='xs'] .f-progress-track {
			height: 4px;
		}
		.f-progress-wrapper[data-size='sm'] .f-progress-track {
			height: 6px;
		}
		.f-progress-wrapper[data-size='md'] .f-progress-track {
			height: 8px;
		}
		.f-progress-wrapper[data-size='lg'] .f-progress-track {
			height: 12px;
		}
		.f-progress-wrapper[data-size='xl'] .f-progress-track {
			height: 16px;
		}

		/* Intents */
		.f-progress-wrapper[data-intent='primary'] .f-progress-bar {
			background-color: var(--f-primary);
		}
		.f-progress-wrapper[data-intent='info'] .f-progress-bar {
			background-color: var(--f-info);
		}
		.f-progress-wrapper[data-intent='success'] .f-progress-bar {
			background-color: var(--f-success);
		}
		.f-progress-wrapper[data-intent='warning'] .f-progress-bar {
			background-color: var(--f-warning);
		}
		.f-progress-wrapper[data-intent='danger'] .f-progress-bar {
			background-color: var(--f-danger);
		}

		/* Striped */
		.f-progress-bar[data-striped] {
			background-image: linear-gradient(
				45deg,
				rgba(255, 255, 255, 0.15) 25%,
				transparent 25%,
				transparent 50%,
				rgba(255, 255, 255, 0.15) 50%,
				rgba(255, 255, 255, 0.15) 75%,
				transparent 75%,
				transparent
			);
			background-size: 1rem 1rem;
		}

		.f-progress-bar[data-animated] {
			animation: f-progress-stripes 1s linear infinite;
		}

		@keyframes f-progress-stripes {
			from {
				background-position: 1rem 0;
			}
			to {
				background-position: 0 0;
			}
		}

		/* Indeterminate */
		.f-progress-bar[data-indeterminate] {
			width: 40% !important;
			position: absolute;
			top: 0;
			bottom: 0;
			animation: f-progress-indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
		}

		@keyframes f-progress-indeterminate {
			0% {
				left: -40%;
				width: 30%;
			}
			50% {
				left: 20%;
				width: 60%;
			}
			100% {
				left: 100%;
				width: 30%;
			}
		}
	}
</style>
