<!-- @component A single disclosure whose panel opens and closes with a spring height. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CollapsibleTriggerProps } from './collapsible.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the panel is open. */
		open?: boolean;
		/** Called when the panel opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** The trigger. Receives `open`, `disabled`, `props` to spread, and `toggle`. */
		trigger?: Snippet<[CollapsibleTriggerProps]>;
		/** When true, the trigger does nothing and the panel stays as it is. */
		disabled?: boolean;
		/** The panel content. */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		trigger,
		disabled = false,
		class: klass,
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

<div class={['box', klass]} {...rest}>
	{#if trigger}
		{@render trigger(triggerProps)}
	{/if}
	<div id={panelId} class={['collapse spring spring-snappy', open && 'open']}>
		<div>
			{@render children?.()}
		</div>
	</div>
</div>
