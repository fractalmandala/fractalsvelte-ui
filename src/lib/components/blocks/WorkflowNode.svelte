<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface PortPin {
		id: string;
		label: string;
		type?: string;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		subtitle?: string;
		status?: 'idle' | 'running' | 'success' | 'error' | 'warning';
		statusLabel?: string;
		selected?: boolean;
		disabled?: boolean;
		inputs?: PortPin[];
		outputs?: PortPin[];
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		subtitle,
		status = 'idle',
		statusLabel,
		selected = false,
		disabled = false,
		inputs = [],
		outputs = [],
		class: className = '',
		icon,
		children,
		...restProps
	}: Props = $props();

	const resolvedStatusLabel = $derived(
		statusLabel ||
		(status === 'running' ? 'Running' :
		 status === 'success' ? 'Completed' :
		 status === 'error' ? 'Failed' :
		 status === 'warning' ? 'Warning' : 'Idle')
	);
</script>

<div
	class="f-workflow-node {className}"
	data-status={status}
	data-selected={selected ? 'true' : undefined}
	data-disabled={disabled ? 'true' : undefined}
	{...restProps}
>
	<header class="f-node-header">
		<div class="f-node-title-group">
			{#if icon}
				<div class="f-node-icon">
					{@render icon()}
				</div>
			{/if}
			<div class="f-node-titles">
				<h4 class="f-node-title">{title}</h4>
				{#if subtitle}
					<span class="f-node-subtitle">{subtitle}</span>
				{/if}
			</div>
		</div>

		<div class="f-node-status-badge" data-status={status}>
			<span class="f-node-status-dot"></span>
			<span class="f-node-status-text">{resolvedStatusLabel}</span>
		</div>
	</header>

	{#if inputs.length > 0 || outputs.length > 0}
		<div class="f-node-ports">
			<div class="f-node-ports-in">
				{#each inputs as pin (pin.id)}
					<div class="f-port f-port-in" data-port-id={pin.id}>
						<span class="f-port-pin" title={pin.type ?? pin.label}></span>
						<span class="f-port-label">{pin.label}</span>
					</div>
				{/each}
			</div>

			<div class="f-node-ports-out">
				{#each outputs as pin (pin.id)}
					<div class="f-port f-port-out" data-port-id={pin.id}>
						<span class="f-port-label">{pin.label}</span>
						<span class="f-port-pin" title={pin.type ?? pin.label}></span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if children}
		<div class="f-node-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-workflow-node {
			position: relative;
			display: flex;
			flex-direction: column;
			min-width: 16rem;
			max-width: 24rem;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			box-shadow: var(--f-shadow-md);
			font-family: var(--f-font-sans);
			user-select: none;
			transition:
				border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-workflow-node:hover {
			box-shadow: var(--f-shadow-lg);
			border-color: var(--f-border-strong);
		}

		.f-workflow-node[data-selected='true'] {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 2px var(--f-ring), var(--f-shadow-lg);
		}

		.f-workflow-node[data-disabled='true'] {
			opacity: 0.55;
			pointer-events: none;
		}

		.f-node-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-sm);
			padding: var(--f-space-md) var(--f-space-lg);
			border-bottom: 1px solid var(--f-border-subtle);
			background: var(--f-panel);
			border-top-left-radius: inherit;
			border-top-right-radius: inherit;
		}

		.f-node-title-group {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
		}

		.f-node-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1.75rem;
			height: 1.75rem;
			border-radius: var(--f-radius-sm);
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			flex-shrink: 0;
		}

		.f-node-titles {
			display: flex;
			flex-direction: column;
		}

		.f-node-title {
			margin: 0;
			font-size: var(--f-text-sm);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.2;
		}

		.f-node-subtitle {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.2;
		}

		.f-node-status-badge {
			display: inline-flex;
			align-items: center;
			gap: 0.35rem;
			padding: 0.15rem 0.5rem;
			border-radius: var(--f-radius-full);
			font-size: var(--f-text-xs);
			font-weight: 500;
			background: var(--f-sunken);
			color: var(--f-text-muted);
		}

		.f-node-status-dot {
			width: 0.375rem;
			height: 0.375rem;
			border-radius: var(--f-radius-full);
			background: currentColor;
		}

		.f-node-status-badge[data-status='running'] {
			background: var(--f-info-bg);
			color: var(--f-info);
		}
		.f-node-status-badge[data-status='running'] .f-node-status-dot {
			animation: f-pulse 1.2s infinite;
		}

		.f-node-status-badge[data-status='success'] {
			background: var(--f-success-bg);
			color: var(--f-success);
		}

		.f-node-status-badge[data-status='error'] {
			background: var(--f-danger-bg);
			color: var(--f-danger);
		}

		.f-node-status-badge[data-status='warning'] {
			background: var(--f-warning-bg);
			color: var(--f-warning);
		}

		@keyframes f-pulse {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.3; }
		}

		/* Ports */
		.f-node-ports {
			display: flex;
			justify-content: space-between;
			padding: var(--f-space-sm) 0;
			gap: var(--f-space-md);
		}

		.f-node-ports-in,
		.f-node-ports-out {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-xs);
		}

		.f-port {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			position: relative;
		}

		.f-port-in {
			padding-left: var(--f-space-md);
		}

		.f-port-out {
			padding-right: var(--f-space-md);
			justify-content: flex-end;
		}

		.f-port-pin {
			position: absolute;
			width: 0.625rem;
			height: 0.625rem;
			border-radius: var(--f-radius-full);
			background: var(--f-surface);
			border: 2px solid var(--f-border-strong);
			transition: border-color var(--f-duration-fast) var(--f-ease), transform var(--f-duration-fast) var(--f-ease);
			cursor: crosshair;
		}

		.f-port-in .f-port-pin {
			left: -0.375rem;
		}

		.f-port-out .f-port-pin {
			right: -0.375rem;
		}

		.f-port-pin:hover {
			border-color: var(--f-primary);
			transform: scale(1.3);
			background: var(--f-primary);
		}

		.f-node-body {
			padding: var(--f-space-md) var(--f-space-lg);
			border-top: 1px solid var(--f-border-subtle);
			font-size: var(--f-text-xs);
			color: var(--f-text);
		}
	}
</style>
