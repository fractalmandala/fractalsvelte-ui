<script lang="ts" module>
	import type { Intent } from '../types';

	export interface ToastItem {
		id: string;
		title?: string;
		message?: string;
		intent?: Intent;
		duration?: number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Toast from './Toast.svelte';

	/**
	 * top-left — floats in the top layer (a manual [popover]) at the top-left
	 *            corner, inset by margins.
	 * inline   — a plain stack wherever you place it.
	 *
	 * The other corners need right/bottom offsets or auto margins; fractalstyler
	 * has neither, and its `* { margin: 0 }` reset removes the browser's own
	 * centring margins on [popover], so the top-left corner is the only one a
	 * popover can be pinned to with its classes.
	 */
	export type ToastPosition = 'top-left' | 'inline';

	interface Props {
		position?: ToastPosition;
		toasts?: ToastItem[];
		class?: string;
		ondismiss?: (id: string) => void;
		children?: Snippet;
	}

	let { position = 'top-left', toasts = $bindable([]), class: className = '', ondismiss, children }: Props = $props();

	let stackEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!stackEl || position === 'inline') return;
		const shouldShow = toasts.length > 0 || Boolean(children);
		const showing = stackEl.matches(':popover-open');
		if (shouldShow && !showing) stackEl.showPopover();
		else if (!shouldShow && showing) stackEl.hidePopover();
	});

	function remove(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
		ondismiss?.(id);
	}
</script>

{#snippet stack()}
	<div class="box gap-xs">
		{#each toasts as t (t.id)}
			<Toast id={t.id} title={t.title} message={t.message} intent={t.intent} duration={t.duration} onclose={() => remove(t.id)} />
		{/each}
		{@render children?.()}
	</div>
{/snippet}

{#if position === 'inline'}
	<div class={className} aria-live="polite">{@render stack()}</div>
{:else}
	<!-- .card[data-variant="ghost"] clears the popover's default canvas fill and
	     border; display classes stay on the inner stack so it can still hide. -->
	<div bind:this={stackEl} popover="manual" aria-live="polite" class="card ml-md mt-md pad-xs text-primary {className}" data-variant="ghost">
		{@render stack()}
	</div>
{/if}
