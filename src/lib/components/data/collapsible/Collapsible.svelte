<!-- @component A single disclosure whose panel opens and closes with a spring height. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  CollapsibleTriggerProps  } from './collapsible.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		trigger?: Snippet<[CollapsibleTriggerProps]>;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		trigger,
		disabled = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const triggerId = `${uid}-trigger`;
	const panelId = `${uid}-panel`;

	function toggle() {
		if (disabled) return;
		open = !open;
		onOpenChange?.(open);
	}

	const triggerProps = $derived.by(
		(): CollapsibleTriggerProps => ({
			open,
			disabled,
			props: {
				id: triggerId,
				type: 'button',
				'aria-expanded': open,
				'aria-controls': panelId,
				disabled,
				onclick: toggle
			},
			toggle
		})
	);
</script>

<div class={['box', className]} {...rest}>
	{#if trigger}
		{@render trigger(triggerProps)}
	{/if}
	<div id={panelId} class={['collapse spring spring-snappy', open && 'open']}>
		<div>
			{@render children?.()}
		</div>
	</div>
</div>
