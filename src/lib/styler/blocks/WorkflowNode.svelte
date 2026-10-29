<!-- @component A node card for workflow diagrams, with ports and status. -->

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
	import { Icon, type IconData } from '@fractaldesign/icons';
	import type { Size, Shape, Surface, Border, Shadow, Pad } from '../types';
	import Card from '../layout/Card.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		title: string;
		subtitle?: string;
		status?: WorkflowStatus;
		statusLabel?: string;
		selected?: boolean;
		disabled?: boolean;
		inputs?: PortPin[];
		outputs?: PortPin[];
		/** An icon from @fractaldesign/icons, e.g. luMail */
		icon?: IconData;
		size?: Size;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		padding?: Pad;
		class?: string;
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
		icon,
		size = 'h-md',
		shape = 'modern',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-sm',
		padding = 'pad-md',
		class: className = '',
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

<Card
	{size}
	{shape}
	{surface}
	border={selected ? 'border-strong' : border}
	{shadow}
	{padding}
	class="{disabled ? 'text-muted' : ''} {className}"
	data-flow-node
	aria-disabled={disabled || undefined}
	aria-current={selected || undefined}
	{...restProps}
>
	{#snippet header()}
		<div class="row ycenter xbetween gap-md">
			<div class="row ycenter gap-sm min0">
				{#if icon}<span class="row ycenter xcenter shrink-0 pad-sm bg-sunken radius-sm text-theme"><Icon {icon} /></span>{/if}
				<div class="box min0">
					<h4 class="text-sm weight-600 truncate">{title}</h4>
					{#if subtitle}<span class="text-xs text-muted truncate">{subtitle}</span>{/if}
				</div>
			</div>
			<span class="row ycenter gap-xs shrink-0 text-xs {STATUS_CLASSES[status]}">
				<svg viewBox="0 0 8 8" width="0.6em" height="0.6em" aria-hidden="true">
					<circle cx="4" cy="4" r="4" fill="currentColor">
						{#if status === 'running'}<animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />{/if}
					</circle>
				</svg>
				{statusLabel || LABELS[status]}
			</span>
		</div>
	{/snippet}
	{#if inputs.length > 0 || outputs.length > 0}
		<div class="row xbetween gap-md">
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
	{@render children?.()}
</Card>
