<script lang="ts" module>
	export interface PortPin {
		id: string;
		label: string;
		type?: string;
	}
	export type WorkflowStatus = 'idle' | 'running' | 'success' | 'error' | 'warning';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		subtitle?: string;
		status?: WorkflowStatus;
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

	const LABELS: Record<WorkflowStatus, string> = {
		idle: 'Idle',
		running: 'Running',
		success: 'Completed',
		error: 'Failed',
		warning: 'Warning'
	};
	const STATUS_CLASSES: Record<WorkflowStatus, string> = {
		idle: 'text-muted',
		running: 'text-info',
		success: 'text-success',
		error: 'text-danger',
		warning: 'text-warning'
	};
</script>

{#snippet pin(p: PortPin)}
	<svg viewBox="0 0 10 10" width="0.7em" height="0.7em" class="shrink-0 text-secondary" role="img" aria-label={p.type ?? p.label}>
		<title>{p.type ?? p.label}</title>
		<circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/snippet}

<div
	class="card box gap-sm shadow-md {disabled ? 'text-muted' : ''} {className}"
	data-variant={selected ? 'link' : 'primary'}
	data-shape="curved"
	data-pad="md"
	data-flow-node
	aria-disabled={disabled || undefined}
	aria-current={selected || undefined}
	{...restProps}
>
	<header class="row ytop xbetween gap-md">
		<div class="row ycenter gap-sm min0">
			{#if icon}<span class="row ycenter xcenter shrink-0 pad-xs bg-sunken radius-sm text-theme">{@render icon()}</span>{/if}
			<div class="box min0">
				<h4 class="text-sm weight-600 truncate">{title}</h4>
				{#if subtitle}<span class="text-body-sm text-muted truncate">{subtitle}</span>{/if}
			</div>
		</div>
		<span class="chip row ycenter gap-xs bg-sunken shrink-0 {STATUS_CLASSES[status]}">
			<svg viewBox="0 0 8 8" width="0.6em" height="0.6em" aria-hidden="true">
				<circle cx="4" cy="4" r="4" fill="currentColor">
					{#if status === 'running'}<animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />{/if}
				</circle>
			</svg>
			{statusLabel || LABELS[status]}
		</span>
	</header>
	{#if inputs.length > 0 || outputs.length > 0}
		<div class="row xbetween gap-md pt-sm bt-sub">
			<div role="list" class="box gap-xs">
				{#each inputs as p (p.id)}
					<div role="listitem" class="row ycenter gap-xs text-sm text-secondary" data-port-id={p.id}>{@render pin(p)}{p.label}</div>
				{/each}
			</div>
			<div role="list" class="box xright gap-xs">
				{#each outputs as p (p.id)}
					<div role="listitem" class="row ycenter gap-xs text-sm text-secondary" data-port-id={p.id}>{p.label}{@render pin(p)}</div>
				{/each}
			</div>
		</div>
	{/if}
	{#if children}<div class="box gap-xs text-body-sm text-secondary">{@render children()}</div>{/if}
</div>
